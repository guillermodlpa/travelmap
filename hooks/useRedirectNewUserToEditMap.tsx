import useUserMap from './useUserMap';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useRedirectUserWithoutDisplayNameToOnboarding() {
  const router = useRouter();
  const { map, loading, error } = useUserMap();
  useEffect(() => {
    if (map && !map.userDisplayName) {
      router.replace('/map/edit?onboarding');
    }
  }, [map, router]);

  return { mapLoaded: Boolean(map && !error), loading };
}
