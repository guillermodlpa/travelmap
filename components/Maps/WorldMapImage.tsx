import Image from 'next/image';
import worldMapLightImageFile from './world-map-light.png';
import worldMapDarkImageFile from './world-map-dark.png';
import { useTheme } from 'styled-components';

/**
 * New images can be obtained using the Mapbox Static Images API
 * Example light: https://api.mapbox.com/styles/v1/gpuenteallott/cl1953d18005r14o33cb7z60t/static/0,10,1.3,0.00,0.00/1278x858@2x?access_token=[token]
 * Example dark: https://api.mapbox.com/styles/v1/gpuenteallott/cl195e9ja002f14o09biv9ntq/static/0,10,1.3,0.00,0.00/1278x858@2x?access_token=[token]
 */

export default function WorldMapImage() {
  const theme = useTheme();
  return (
    <Image
      src={theme.dark ? worldMapDarkImageFile : worldMapLightImageFile}
      layout="fill"
      alt="World map background"
      objectFit="cover"
      placeholder="blur"
    />
  );
}
