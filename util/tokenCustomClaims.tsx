// @see https://auth0.com/docs/secure/tokens/json-web-tokens/create-namespaced-custom-claims
// The exported keys are included in the Auth0 user descriptor because they are added by Auth0 Actions upon login

const NAMESPACE = 'https://travelmap.guillermodlpa.com';

export const CUSTOM_CLAIM_APP_USER_ID = `${NAMESPACE}/app_user_id`;
