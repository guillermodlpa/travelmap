// Custom types to use with Next.js

type NextPageWithLayout = NextPage & {
  getLayout: (page: ReactElement) => ReactNode;
};
