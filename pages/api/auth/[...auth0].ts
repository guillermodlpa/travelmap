import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

// @see https://auth0.com/docs/quickstart/webapp/nextjs#add-the-dynamic-api-route

// This will create 4 handlers for the following urls:
//  /api/auth/login: log the user in to your app by redirecting them to your Identity Provider.
//  /api/auth/callback: The page that your Identity Provider will redirect the user back to on login.
//  /api/auth/logout: log the user out of your app.
//  /api/auth/me: View the user profile JSON (used by the UseUser hook)

export default handleAuth({
  async login(req, res) {
    // We read the query, as it could be /api/auth/login?screen_hint=signup
    const screenHint =
      typeof req.query.screen_hint === 'string' ? req.query.screen_hint : undefined;

    await handleLogin(req, res, {
      returnTo: '/my/maps', // URL to take users after authenticated
      authorizationParams: {
        screen_hint: screenHint,
      },
    });
  },
  async logout(req, res) {
    await handleLogout(req, res, {
      // returnTo: '/#logout', // URL to take users after logged out
    });
  },
});
