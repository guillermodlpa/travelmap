/**
 * Edit map page
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR, { Fetcher } from 'swr';

import { Button } from 'grommet';
import StaticMap from '../../../components/Maps/StaticMap';
import Legend from '../../../components/Legend/Legend';
import LegendTitle from '../../../components/Legend/LegendTitle';
import LegendBody from '../../../components/Legend/LegendBody';
import LegendCountryList from '../../../components/Legend/LegendCountryList';
import CountrySearch from '../../../components/CountrySearch';
import LegendActions from '../../../components/Legend/LegendActions';
import { useTheme } from 'styled-components';
import getTravelMapName from '../../../util/getTravelMapName';
import Nav from '../../../components/Nav';

const fetcher: Fetcher<TravelMap, string> = (url) => fetch(url).then((r) => r.json());

const EditMapPage: React.FC = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: travelMap, error } = useSWR(`/api/user/${userId}/map`, fetcher, {
    suspense: false,
  });
  const loading = !error && !travelMap;

  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    if (travelMap?.users[0]?.visitedCountries) {
      setCountries(travelMap.users[0].visitedCountries);
    }
  }, [travelMap]);

  const toggleCountry = (country: string) =>
    setCountries((countries) =>
      countries.includes(country)
        ? countries.filter((c) => c !== country)
        : countries.concat(country)
    );

  const onSave = () => {
    if (travelMap?.pathView) {
      router.push(travelMap?.pathView);
    }
  };

  console.log(useTheme());

  return (
    <>
      <StaticMap height="100vh" id="background-map" />

      <Nav />

      <Legend>
        <LegendTitle
          heading={travelMap ? getTravelMapName(travelMap) : undefined}
          avatars={travelMap?.users.map((user) => ({
            id: user.id,
            name: user.name,
          }))}
        />

        <LegendBody>
          <LegendCountryList countries={countries} />
          <CountrySearch
            selectedCountries={countries}
            onCountrySelected={toggleCountry}
            disabled={loading}
          />

          <LegendActions>
            <Button
              primary
              label="Save"
              disabled={loading || countries.length === 0}
              onClick={onSave}
            />
          </LegendActions>
        </LegendBody>
      </Legend>
    </>
  );
};

export default EditMapPage;
