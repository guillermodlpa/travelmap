import { GetServerSideProps } from 'next';
import fixtures from '../fixtures';

const slugifyName = (name: string): string => {
  const slug = name.replace(/^[a-z0-9]/gi, '');
  const notReallyUniqueSlug = `${slug}-${Math.round(Math.random() * 10000)}`;
  return notReallyUniqueSlug;
};

const SignUpCallbackPage = () => <></>;
export default SignUpCallbackPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { countries } = context.query;

  // Save the country to the new user
  // const session = await getMockSession({ req: context.req });
  if (!countries) {
    context.res.statusCode = 401;
    context.res.end();
    return { props: {} };
  } else {
    const newUser = fixtures.users[fixtures.users.length - 1];

    const session = {
      user: {
        email: newUser.email,
        name: newUser.name,
        image: '',
      },
      expires: new Date(),
    };

    // would create DB entities here

    return {
      redirect: {
        permanent: false,
        destination: '/maps',
      },
    };
  }
};
