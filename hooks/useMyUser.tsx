import { useUser } from '@auth0/nextjs-auth0';
import { User } from '@prisma/client';
import useSWRImmutable, { useSWRConfig } from 'swr';
import getFetcher from '../util/fetcher';

const fetcher = getFetcher<User>();

const useMyUser = () => {
  const { user } = useUser();
  // we use useSWRImmutable because we don't expect settings to change behind the scenes, only when we call mutate()
  const { data, error, mutate } = useSWRImmutable(Boolean(user) ? `/api/user` : null, fetcher);

  return { data, error, mutate };
};

export default useMyUser;
