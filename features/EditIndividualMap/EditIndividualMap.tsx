import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWRImmutable, { Fetcher } from 'swr';

import { Box, Button, Card, CardBody, Paragraph, ResponsiveContext, Text } from 'grommet';
import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import LegendActions from '../../components/Legend/LegendActions';
import LegendColorIndicators from '../../components/Legend/LegendColorIndicators';
import getCountryName from '../../util/getCountryName';
import EditMapSettings from './EditMapSettings';
import HoveredCountryToast from './HoveredCountryToast';
import { MAP_HIGHLIGHT_COLOR_1 } from '../../util/mapHighlightColors';
import getTravelMapName from '../../util/getTravelMapName';

const fetcher: Fetcher<ClientIndividualTravelMap, string> = (url) =>
  fetch(url).then((r) => r.json());

export default function EditMap({
  defaultOUserSettingsModal,
}: {
  defaultOUserSettingsModal: boolean;
}) {
  const router = useRouter();
  const size = useContext(ResponsiveContext);

  const { data: travelMap, error } = useSWRImmutable(`/api/map`, fetcher, {
    suspense: false,
  });

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
  const [savingError, setSavingError] = useState<string>();
  const handleSave = () => {
    setSaving(true);
    setSavingError(undefined);

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
        setSavingError(error.message);
      });
  };

  const [hoveredCountry, setHoveredCountry] = useState<
    undefined | { code: string; name: string }
  >();
  const handleCountryHovered = (param: undefined | { code: string; name: string }) => {
    setHoveredCountry(param);
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
            color: MAP_HIGHLIGHT_COLOR_1,
          },
        ]}
        interactive
        applyMapMotion={false}
        animateCamera={false}
        zoomCountriesOnLoad={false}
        countriesCanBeSelected={true}
        onCountrySelected={toggleCountry}
        onCountryHovered={handleCountryHovered}
      />

      <EditMapSettings
        open={editMapSettingsDialogOpen}
        onClose={() => setEditMapSettingsDialogOpen(false)}
        showWelcomeMessage={defaultOUserSettingsModal && !travelMap?.userDisplayName}
        allowUserToClose={Boolean(travelMap?.userDisplayName)}
      />

      <HoveredCountryToast hoveredCountry={hoveredCountry} />

      <Legend>
        <LegendTitle
          heading={travelMap ? getTravelMapName(travelMap) || 'Travelmap' : 'Travelmap'}
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
          {error && (
            <Text color="status-error" margin={{ bottom: 'small' }}>
              {error.message}
            </Text>
          )}

          <Card pad="small" animation="fadeIn" margin={{ bottom: 'small' }}>
            <CardBody>
              <Paragraph margin="none">Select the countries in the map</Paragraph>
            </CardBody>
          </Card>

          <LegendColorIndicators
            expandedInitially={size !== 'small'}
            data={[
              {
                id: 'edit-map',
                color: MAP_HIGHLIGHT_COLOR_1,
                label: travelMap ? `Visited countries (${countries.length})` : 'Visited countries',
                subItems: countries.map((country) => ({
                  id: country,
                  label: getCountryName(country) || '',
                })),
              },
            ]}
          />
        </LegendBody>

        <LegendActions>
          {savingError && (
            <Box flex={{ shrink: 0 }}>
              <Text color="status-error">{savingError}</Text>
            </Box>
          )}
          <Button
            label={saving ? 'Saving' : 'Save'}
            primary
            disabled={error || !travelMap || saving || countries.length === 0}
            onClick={handleSave}
          />
        </LegendActions>
      </Legend>
    </>
  );
}
