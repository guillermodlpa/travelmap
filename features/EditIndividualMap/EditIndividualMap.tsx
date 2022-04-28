import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWRImmutable, { Fetcher } from 'swr';

import { Button, Card, CardBody, Paragraph } from 'grommet';
import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import LegendActions from '../../components/Legend/LegendActions';
import LegendColorIndicators from '../../components/Legend/LegendColorIndicators';
import getCountryName from '../../util/getCountryName';
import EditMapSettings from './EditMapSettings';

const fetcher: Fetcher<ClientIndividualTravelMap, string> = (url) =>
  fetch(url).then((r) => r.json());

export default function EditMap({
  defaultOUserSettingsModal,
}: {
  defaultOUserSettingsModal: boolean;
}) {
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

  const [editMapSettingsDialogOpen, setEditMapSettingsDialogOpen] =
    useState<boolean>(defaultOUserSettingsModal);

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

      <EditMapSettings
        open={editMapSettingsDialogOpen}
        onClose={() => setEditMapSettingsDialogOpen(false)}
        showWelcomeMessage={defaultOUserSettingsModal && !travelMap?.userDisplayName}
        allowUserToClose={Boolean(travelMap?.userDisplayName)}
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
          onClickEditNameButton={() => setEditMapSettingsDialogOpen(true)}
        />

        <LegendBody>
          <Card pad="small" animation="fadeIn" margin={{ bottom: 'small' }}>
            <CardBody>
              <Paragraph margin="none">Find countries in the map and select them</Paragraph>
            </CardBody>
          </Card>

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
              primary
              disabled={loading || saving || countries.length === 0}
              onClick={handleSave}
            />
          </LegendActions>
        </LegendBody>
      </Legend>
    </>
  );
}
