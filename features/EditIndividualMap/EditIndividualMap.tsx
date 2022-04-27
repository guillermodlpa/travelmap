import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWRImmutable, { Fetcher } from 'swr';

import { Button, Paragraph } from 'grommet';
import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import LegendActions from '../../components/Legend/LegendActions';
import LegendColorIndicators from '../../components/Legend/LegendColorIndicators';
import getCountryName from '../../util/getCountryName';
import EditDisplayNameDialog from './EditDisplayNameDialog';

const fetcher: Fetcher<ClientIndividualTravelMap, string> = (url) =>
  fetch(url).then((r) => r.json());

export default function EditMap() {
  const router = useRouter();

  const { data: travelMap, error } = useSWRImmutable(`/api/map`, fetcher, {
    suspense: false,
  });
  const loading = !error && !travelMap;

  const [countries, setCountries] = useState<string[]>([]);
  useEffect(() => {
    if (travelMap?.visitedCountries) {
      setCountries(travelMap.visitedCountries);
    }
  }, [travelMap?.visitedCountries]);

  const toggleCountry = (country: string) =>
    setCountries((countries) => {
      const newCountries = countries.includes(country)
        ? countries.filter((c) => c !== country)
        : countries.concat(country);
      newCountries.sort();
      return newCountries;
    });

  const [editDisplayNameDialogOpen, setEditDisplayNameDialogOpen] = useState<boolean>(false);

  const [saving, setSaving] = useState<boolean>(false);
  const handleSave = () => {
    setSaving(true);

    fetch(`/api/map`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitedCountries: countries,
      }),
    })
      .then(() => {
        setSaving(false);
        if (travelMap) {
          router.push(travelMap.pathView);
        }
      })
      .catch((error) => {
        setSaving(false);
        console.error(error);
        alert('error');
      });
  };

  return (
    <>
      <HighlightedCountriesMap
        height="100vh"
        id="background-map"
        highlightedCountries={[
          {
            id: 'editing',
            countries: countries,
            color: 'status-ok',
          },
        ]}
        interactive
        applyMapMotion={false}
        animateCamera={false}
        countriesCanBeSelected={true}
        onCountrySelected={toggleCountry}
      />

      <EditDisplayNameDialog
        open={editDisplayNameDialogOpen}
        onClose={() => setEditDisplayNameDialogOpen(false)}
      />

      <Legend>
        <LegendTitle
          heading={
            travelMap?.userDisplayName ? `${travelMap?.userDisplayName}'s Travelmap` : 'Travelmap'
          }
          avatars={
            travelMap
              ? [
                  {
                    id: travelMap.userId,
                    name: travelMap?.userDisplayName,
                    pictureUrl: travelMap.userPictureUrl,
                  },
                ]
              : []
          }
          showEditNameButton
          onClickEditNameButton={() => setEditDisplayNameDialogOpen(true)}
        />

        <LegendBody>
          <Paragraph margin={{ top: 'none' }}>
            Find the country in the map and click on it to add it.
          </Paragraph>

          <LegendColorIndicators
            forceExpanded
            data={[
              {
                id: 'edit-map',
                color: 'status-ok',
                label: `Visited countries (${countries.length})`,
                subItems: countries.map((country) => ({
                  id: country,
                  label: getCountryName(country) || '',
                })),
              },
            ]}
          />

          <LegendActions>
            <Button
              label={saving ? 'Saving' : 'Save'}
              disabled={loading || saving || countries.length === 0}
              onClick={handleSave}
            />
          </LegendActions>
        </LegendBody>
      </Legend>
    </>
  );
}
