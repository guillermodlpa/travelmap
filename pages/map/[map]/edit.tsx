/**
 * Edit map page
 */
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { Button } from 'grommet';
import StaticMap from '../../../components/Maps/StaticMap';
import Legend from '../../../components/Legend/Legend';
import LegendTitle from '../../../components/Legend/LegendTitle';
import LegendBody from '../../../components/Legend/LegendBody';
import LegendCountryList from '../../../components/Legend/LegendCountryList';
import CountrySearch from '../../../components/CountrySearch';
import LegendActions from '../../../components/Legend/LegendActions';
import UserMenu from '../../../components/UserMenu';
import { useRouter } from 'next/router';
import fixtures from '../../../fixtures';
import ThemeModeToggle from '../../../components/ThemeModeToggle';

const EditMapPage: React.FC<{ userMap: UserMap; userLoggedIn: boolean }> = ({
  userMap,
  userLoggedIn,
}) => {
  const [countries, setCountries] = useState<string[]>(userMap.countries);
  const toggleCountry = (country: string) =>
    setCountries((countries) =>
      countries.includes(country)
        ? countries.filter((c) => c !== country)
        : countries.concat(country)
    );

  const router = useRouter();
  const onSave = () => {
    router.push(`/map/${userMap.slug}`);
  };

  return (
    <>
      <StaticMap height="100vh" id="background-map" />

      <ThemeModeToggle />

      {userLoggedIn && <UserMenu />}

      <Legend>
        <LegendTitle avatarContent="" avatarSrc={undefined} headingText={`Your Travelmap`} />

        <LegendBody>
          <LegendCountryList countries={countries} />
          <CountrySearch disabledCountries={countries} onCountrySelected={toggleCountry} />

          <LegendActions>
            <Button primary label="Save" disabled={countries.length === 0} onClick={onSave} />
          </LegendActions>
        </LegendBody>
      </Legend>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ userMap: UserMap }, { map: string }> = async (
  context
) => {
  const mapId = context.params?.map;
  if (!mapId) {
    return { notFound: true };
  }
  const userMap = Object.values(fixtures.userMapsBySlug).find(({ id }) => id === mapId);
  if (!userMap) {
    // try with the slug
    const userMap = Object.values(fixtures.userMapsBySlug).find(({ slug }) => slug === mapId);
    if (userMap) {
      return {
        redirect: {
          permanent: false,
          destination: `/map/${userMap.id}/edit`,
        },
      };
    }

    return { notFound: true };
  }
  return { props: { userMap, userLoggedIn: true } };
};

export default EditMapPage;
