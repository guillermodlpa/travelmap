/**
 * Edit map page
 */
import { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWRImmutable, { Fetcher } from 'swr';

import { Box, Button, FormField, Heading, Layer, TextInput } from 'grommet';
import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import Legend from '../../components/Legend/Legend';
import LegendTitle from '../../components/Legend/LegendTitle';
import LegendBody from '../../components/Legend/LegendBody';
import LegendCountryList from '../../components/Legend/LegendCountryList';
import CountrySearch from '../../components/CountrySearch';
import LegendActions from '../../components/Legend/LegendActions';
import Nav from '../../components/Nav';
import type { NextPage } from 'next';
import HeadWithDefaults from '../../components/HeadWithDefaults';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const EditDisplayNameDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  displayName: string;
  onDisplayNameChange: (displayName: string) => void;
}> = ({ open, onClose, displayName, onDisplayNameChange }) => {
  const [currentDisplayName, setCurrentDisplayName] = useState<string>(displayName);
  const [inputError, setInputError] = useState<boolean>(false);
  useEffect(() => {
    if (open) {
      setCurrentDisplayName(displayName);
    }
  }, [open]);
  const handleConfirm = () => {
    const cleanDisplayName = currentDisplayName.trim();
    if (!cleanDisplayName) {
      setInputError(true);
      return;
    }
    onDisplayNameChange(cleanDisplayName);
    onClose();
  };
  if (!open) {
    return <></>;
  }
  return (
    <Layer
      background="popup"
      position="center"
      onClickOutside={onClose}
      onEsc={onClose}
      responsive={false}
      margin="large"
    >
      <Box pad="medium" gap="small" width="medium">
        {/* @todo: use React 18 useId */}
        <FormField
          label="User Display Name"
          htmlFor="user-display-name-input"
          error={inputError ? 'Invalid' : ''}
        >
          <TextInput
            id="user-display-name-input"
            value={currentDisplayName}
            onChange={(event) => setCurrentDisplayName(event.target.value)}
          />
        </FormField>
        <Box
          as="footer"
          gap="small"
          direction="row"
          align="center"
          justify="end"
          pad={{ top: 'medium', bottom: 'small' }}
        >
          <Button label="Cancel" onClick={onClose} />
          <Button label={'Confirm'} onClick={handleConfirm} primary />
        </Box>
      </Box>
    </Layer>
  );
};

const fetcher: Fetcher<ClientIndividualTravelMap, string> = (url) =>
  fetch(url).then((r) => r.json());

const EditMapPage: NextPage = () => {
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
    setCountries((countries) =>
      countries.includes(country)
        ? countries.filter((c) => c !== country)
        : countries.concat(country)
    );

  const [editDisplayNameDialogOpen, setEditDisplayNameDialogOpen] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');
  const savedUserName = travelMap?.userDisplayName || '';
  useEffect(() => {
    setDisplayName(savedUserName);
  }, [savedUserName]);

  const [saving, setSaving] = useState<boolean>(false);
  const handleSave = () => {
    setSaving(true);
    Promise.all([
      fetch(`/api/map`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitedCountries: countries,
        }),
      }),
      fetch(`/api/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName,
        }),
      }),
    ])

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
      <HeadWithDefaults title="Travelmap - Edit Map" />

      <HighlightedCountriesMap
        height="100vh"
        id="background-map"
        highlightedCountries={[countries]}
        interactive
        applyMapMotion={false}
        animateCamera={false}
      />

      <Nav />

      <Legend>
        <LegendTitle
          heading={displayName ? `${displayName}'s Travelmap` : 'Travelmap'}
          avatars={travelMap ? [{ id: travelMap.userId, name: travelMap.userDisplayName }] : []}
          showEditNameButton
          onClickEditNameButton={() => setEditDisplayNameDialogOpen(true)}
        />

        <EditDisplayNameDialog
          open={editDisplayNameDialogOpen}
          onClose={() => setEditDisplayNameDialogOpen(false)}
          displayName={displayName}
          onDisplayNameChange={(newDisplayName) => setDisplayName(newDisplayName)}
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
              label={saving ? 'Saving' : 'Save'}
              disabled={loading || countries.length === 0 || saving}
              onClick={handleSave}
            />
          </LegendActions>
        </LegendBody>
      </Legend>
    </>
  );
};

export default withPageAuthRequired(EditMapPage);
