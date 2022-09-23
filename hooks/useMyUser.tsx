import { useUser } from '@auth0/nextjs-auth0';
import { User } from '@prisma/client';
import useSWRImmutable, { useSWRConfig } from 'swr';
import getFetcher from '../lib/fetcher';

const fetcher = getFetcher<User>();

const useMyUser = () => {
  const { user } = useUser();
  // we use useSWRImmutable because we don't expect settings to change behind the scenes, only when we call mutate()
  const { data, error, mutate } = useSWRImmutable(Boolean(user) ? `/api/user` : null, fetcher);
  const { mutate: globalMutate } = useSWRConfig();

  return {
    data,
    error,
    mutate: () => {
      mutate();
      // we clear the individual map loaded for the user as well, since it contains user name and picture
      globalMutate(`/api/map`);
    },
  };
};

export default useMyUser;
