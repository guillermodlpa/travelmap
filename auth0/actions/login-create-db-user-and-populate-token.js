const axios = require('axios');

// In the production Auth0 tenant, we point to our deployed site URL
const baseUrl = 'https://travelmap.guillermodlpa.com';

// In the development Auth0 tenant, we point to our preview URL that uses the dev DB
// const baseUrl = 'https://preview.travelmap.guillermodlpa.com';

// Locally, when testing changes on this file, we'll typically use ngrok
// const baseUrl = 'https://[...].eu.ngrok.io';

const claimNamespace = 'https://travelmap.guillermodlpa.com';

/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // Credit to https://www.prisma.io/blog/fullstack-nextjs-graphql-prisma-3-clxbrcqppv#sync-auth0-users-with-the-apps-database

  // 1. Get the se
  const auth0ActionsHookSecret = event.secrets.AUTH0_ACTIONS_HOOK_SECRET;

  // 2. skip if we already have done this for the user
  if (event.user.app_metadata.appUserId) {
    // add app_user_id to the token, so in the frontend app, useUser() has it
    api.idToken.setCustomClaim(`${claimNamespace}/app_user_id`, event.user.app_metadata.appUserId);
    return;
  }

  // 3. Hit the endpoint
  return axios
    .post(`${baseUrl}/api/auth/hook/login`, {
      email: event.user.email,
      sub: event.user.user_id,
      pictureUrl: event.user.picture || null,
      secret: auth0ActionsHookSecret,
    })
    .then((response) => {
      // 4. Update in Auth0 the ID of the user in the database
      const appUserId = response.data.id;
      api.user.setAppMetadata('appUserId', appUserId);

      // add app_user_id to the token, so in the frontend app, useUser() has it
      api.idToken.setCustomClaim(`${claimNamespace}/app_user_id`, appUserId);
    })
    .catch((error) => {
      const { status, data } = error.response;
      api.access.deny(`Login hook error: ${status} ${JSON.stringify(data)}`);
    });
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
// exports.onContinuePostLogin = async (event, api) => {
// };
