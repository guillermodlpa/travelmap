import { Box } from 'grommet';
import { useEffect, useState } from 'react';
import HighlightedCountriesMap from '../../components/Maps/HighlightedCountriesMap';
import useRecentMapList from '../../hooks/useRecentMaps';

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
            color: 'status-ok',
          },
        ]}
        interactive
        zoomCountriesOnLoad
        countriesCanBeSelected={false}
        applyMapMotion
        animateCamera
        scrollZoom={false}
      />
    </Box>
  );
}
