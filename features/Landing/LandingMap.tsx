import { Box } from 'grommet';
import { useEffect, useState } from 'react';
import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import useRecentMapList from '../../hooks/useRecentMaps';
import { MAP_HIGHLIGHT_COLOR_1 } from '../../util/mapHighlightColors';

export default function LandingMap({ height }: { height: string }) {
  const { data: recentMaps } = useRecentMapList();
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  useEffect(() => {
    if (recentMaps && recentMaps.length) {
      const randomMap = recentMaps[Math.floor(Math.random() * recentMaps.length)];
      setVisitedCountries(
        randomMap.type === 'individual'
          ? randomMap.visitedCountries
          : randomMap.individualTravelMaps[0].visitedCountries
      );
    }
  }, [recentMaps]);

  return (
    <Box style={{ position: 'relative' }}>
      <HighlightedCountriesMap
        height={height}
        id="landing-page-map"
        highlightedCountries={[
          {
            id: 'landing-map',
            countries: visitedCountries || [],
            color: MAP_HIGHLIGHT_COLOR_1,
          },
        ]}
        interactive
        zoomCountriesOnLoad
        countriesAreInteractive={false}
        showHoveredCountryFill={false}
        applyMapMotion
        animateCamera
        scrollZoom={false}
        initialZoomPadding={{ top: 0, bottom: 0, left: 0, right: 0 }}
      />
    </Box>
  );
}
