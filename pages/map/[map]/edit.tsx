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
import ThemeModeToggle from '../../../components/ThemeMode/ThemeModeToggle';
import { useTheme } from 'styled-components';
import getTravelMapNameForUsers from '../../../util/getTravelMapName';

const EditMapPage: React.FC<{ travelMap: TravelMap; users: User[] }> = ({ travelMap, users }) => {
  const [countries, setCountries] = useState<string[]>(travelMap.countries);
  const toggleCountry = (country: string) =>
    setCountries((countries) =>
      countries.includes(country)
        ? countries.filter((c) => c !== country)
        : countries.concat(country)
    );

  const router = useRouter();
  const onSave = () => {
    router.push(`/map/${travelMap.slug}`);
  };

  console.log(useTheme());

  return (
    <>
      <StaticMap height="100vh" id="background-map" />

      <ThemeModeToggle />

      <UserMenu />

      <Legend>
        <LegendTitle
          avatarContent=""
          avatarSrc={undefined}
          headingText={getTravelMapNameForUsers(users)}
        />

        <LegendBody>
          <LegendCountryList countries={countries} />
          <CountrySearch selectedCountries={countries} onCountrySelected={toggleCountry} />

          <LegendActions>
            <Button primary label="Save" disabled={countries.length === 0} onClick={onSave} />
          </LegendActions>
        </LegendBody>
      </Legend>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  { travelMap: TravelMap; users: User[] },
  { map: string }
> = async (context) => {
  const mapId = context.params?.map;
  if (!mapId) {
    return { notFound: true };
  }
  const travelMap = fixtures.travelMaps.find(({ id }) => id === mapId);
  if (!travelMap) {
    // try with the slug
    const travelMapBySlug = fixtures.travelMaps.find(({ slug }) => slug === mapId);
    if (travelMapBySlug) {
      return {
        redirect: {
          permanent: false,
          destination: `/map/${travelMapBySlug.id}/edit`,
        },
      };
    }

    return { notFound: true };
  }
  const users = fixtures.userTravelMaps
    .filter(({ travelMapId }) => travelMapId === travelMap.id)
    .map(({ userId }) => fixtures.users.find(({ id }) => id === userId))
    .map((user) => user as User);

  return { props: { travelMap, users } };
};

export default EditMapPage;
