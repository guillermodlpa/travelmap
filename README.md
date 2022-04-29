# Travelmap

![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)

This is a small web application that allows to make a list of visited countries, display them in a map, and share the URL.

## Technologies

- Frontend: TypeScript, Next.js
  - UI Library: Grommet
  - Vercel SWR for data fetching
- Backend: TypeScript
  - Implemented in this repository using Next.js in `pages/api`
  - Prisma for ORM
    - Reminder: when making changes to the schema, remember to run `npx prisma generate`.
- Data: Planetscale (serverless MySQL)
  - Reminder: to push a schema up, use Prisma with `npx prisma db push`. It knows where to push thanks to the env var `DATABASE_URL` that you need to set in your `.env`
- Authentication: Auth0
  - When users log in, there's an Auth0 Action executed that,
    - Upon registration, creates the user record and their map, and saves the user record ID in Auth0.
    - Sets the user record ID in the Auth0 token, so we can read it directly from the frontend with the hook `useUser`.
  - There are 2 applications configured, each with its variables defined in the environment variables file:
    - Frontend: it's a generic application, the one integrated with Next.js
    - Backend: it's a "Machine to Machine" application, used to interact with the Management API when needed, like when needing to delete a user account.
- Images: Cloudinary to host and serve the profile pictures

## Development

Before it works locally, you'll need to set up accounts on the following services, and add their API keys and secrets to your `.env.local` file:

- Mapbox Studio
- Cloudinary
- Auth0. [See instructions](https://github.com/auth0/nextjs-auth0#getting-started)

Once that's done, this is a Next.js app, so you can run it simply by:

```bash
npm install
npm run dev
```

### Planetscale reference for creating database

Keeping it here for future reference.

Commands to set up the development database:

```sh
# Create database
pscale database create travelmap-dev --org travelmap
# Create `main` branch and password for it
pscale password create travelmap-dev main main-password --org travelmap

# Then copy the values in the DATABASE_URL env var, with format `mysql://[username]:[password]@[host]/travelmap-dev?sslaccept=strict`

# Push the schema
DATABASE_URL='mysql://[username]:[password]@[host]/travelmap-dev?sslaccept=strict' npx prisma db push

# Promote branch to production
pscale branch promote travelmap-dev main --org travelmap
```
