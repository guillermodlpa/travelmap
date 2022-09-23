import type { ReactNode } from 'react';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import useIndividualMap from '../../hooks/useIndividualMap';
import { CUSTOM_CLAIM_APP_USER_ID } from '../../util/tokenCustomClaims';
import { AuthorizationComponentProps, AuthorizationHookReturnValue } from './types';

export function checkCanEditTravelmap({
  user,
  travelMap,
}: {
  user: UserProfile;
  travelMap: ClientIndividualTravelMap;
}) {
  return travelMap && user?.[CUSTOM_CLAIM_APP_USER_ID] === travelMap?.userId;
}

export function useCanEditTravelmap({
  individualMapId,
}: {
  individualMapId: string | undefined;
}): AuthorizationHookReturnValue {
  const { user, isLoading, error: userError } = useUser();
  const { data: travelMap, error: mapError, loading } = useIndividualMap(individualMapId);
  if (loading || isLoading) {
    return { error: undefined, loading, canAccess: false };
  }
  if (userError) {
    return { error: userError, loading: false, canAccess: false };
  }
  if (mapError) {
    return { error: mapError, loading: false, canAccess: false };
  }
  return {
    error: undefined,
    loading: false,
    canAccess: user && travelMap ? checkCanEditTravelmap({ user, travelMap }) : false,
  };
}

export function CanEditTravelmapAuthorization({
  individualMapId,
  children,
  forbiddenFallback,
  errorFallback,
  loadingFallback,
}: {
  individualMapId: string;
} & AuthorizationComponentProps) {
  const { error, loading, canAccess } = useCanEditTravelmap({ individualMapId });
  if (error) {
    return errorFallback;
  }
  if (loading) {
    return loadingFallback;
  }
  return canAccess ? children : forbiddenFallback;
}
