import { grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

const brandColorLight = 'rgb(219, 98, 9)';
const brandColorDark = 'rgb(217, 94, 4)';

const theme = deepMerge(grommet, {
  global: {
    font: {
      family: "'Roboto', sans-serif",
      size: '18px',
      height: '20px',
    },
    colors: {
      brand: {
        light: brandColorLight,
        dark: brandColorDark,
      },
      paper: {
        dark: 'rgb(120, 79, 34)',
        light: 'rgb(217, 152, 78)',
      },
      info: '#FFCA58',
      focus: 'rgb(101, 196, 236)',
      'status-ok': '#00C781',
      control: {
        dark: 'brand',
        light: 'brand',
      },
      border: {
        dark: 'rgba(255, 255, 255, 0.66)',
        light: 'rgba(0, 0, 0, 0.66)',
      },
      text: {
        dark: '#f8f8f8',
        light: '#0f0f0f',
      },
    },
    elevation: {
      dark: {
        large: '0px 8px 16px rgba(0, 0, 0, 0.40)',
        medium: '0px 6px 8px rgba(0, 0, 0, 0.40)',
        none: 'none',
        small: '0px 4px 4px rgba(0, 0, 0, 0.40)',
        xlarge: '0px 12px 24px rgba(0, 0, 0, 0.40)',
        xsmall: '0px 2px 2px rgba(0, 0, 0, 0.40)',
      },
      light: {
        large: '0px 8px 16px rgba(0, 0, 0, 0.30)',
        medium: '0px 4px 8px rgba(0, 0, 0, 0.30)',
        none: 'none',
        small: '0px 2px 4px rgba(0, 0, 0, 0.30)',
        xlarge: '0px 12px 24px rgba(0, 0, 0, 0.30)',
        xsmall: '0px 1px 2px rgba(0, 0, 0, 0.30)',
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
    control: {
      extend: () => css`
        /* background-color: red !important; */
      `,
    },
  },
  tag: {
    border: {
      color: brandColorLight,
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
