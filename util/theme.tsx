import { grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';

const brandColor = 'rgb(219, 98, 9)';
const theme = deepMerge(grommet, {
  global: {
    font: {
      family: "'Roboto', sans-serif",
      size: '18px',
      height: '20px',
    },
    colors: {
      brand: brandColor,
      focus: 'rgb(101, 196, 236)',
      'status-ok': '#00C781',
      control: {
        dark: 'brand',
        light: 'brand',
      },
    },
  },
  heading: {
    font: {
      family: "'Rye', cursive",
    },
  },
  select: {
    options: {
      container: { align: 'start', pad: 'small' },
    },
  },
  tag: {
    border: {
      color: brandColor,
    },
  },
  anchor: {
    color: {
      dark: 'brand',
      light: 'brand',
    },
  },
});

export type CustomTheme = typeof theme;
export default theme;
