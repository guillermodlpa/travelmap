# Travelmap

![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)

[![Built with TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

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

This is a NextJS app, so you can run it locally with

```bash
npm install
npm run dev
```

Note you'll need to configure a Mapbox access token in `.env.local` to render the map.
