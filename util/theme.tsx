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
      paper: 'rgb(169, 111, 45)',
      info: '#FFCA58',
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
      family: "'Rye', sans-serif",
    },
    level: {
      1: {
        small: {
          size: '24px',
          height: '28px',
        },
      },
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
  button: {
    border: { radius: '0px' },
    size: {
      large: {
        border: { radius: 0 },
        pad: { vertical: '24px', horizontal: '32px' },
      },
      medium: { border: { radius: 0 } },
      small: { border: { radius: 0 } },
    },
  },
});

export type CustomTheme = typeof theme;
export default theme;
