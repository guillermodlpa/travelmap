import { grommet } from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

const theme = deepMerge(grommet, {
  global: {
    font: {
      family: "'Roboto', sans-serif",
      size: '18px',
      height: '20px',
    },
    colors: {
      brand: { light: 'rgb(219, 98, 9)', dark: 'rgb(217, 94, 4)' },
      paper: { dark: 'rgb(120, 79, 34)', light: 'rgb(217, 152, 78)' },
      popup: { dark: 'rgb(49, 31, 11)', light: 'rgb(238, 209, 175)' },
      info: '#FFCA58',
      focus: 'rgb(101, 196, 236)',
      'status-ok': '#00C781',
      control: 'brand',
      border: {
        dark: 'rgba(255, 255, 255, 0.66)',
        light: 'rgba(0, 0, 0, 0.66)',
      },
      placeholder: 'text',
      text: { dark: '#f8f8f8', light: '#0f0f0f' },
      'text-strong': { dark: '#FFFFFF', light: '#000000' },
      'text-weak': { dark: '#CCCCCC', light: '#555555' },
      'text-xweak': { dark: '#BBBBBB', light: '#666666' },
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
    extend: { '-webkit-font-smoothing': 'auto' },
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
    background: 'transparent',
    options: {
      container: {
        background: 'popup',
        extend: () => css`
          font-smooth: auto;
          -webkit-font-smoothing: auto;
        `,
      },
    },
    icons: {
      down: FormDown,
      up: FormUp,
    },
    // control: {
    //   extend: (/* { open, theme } */) => css`
    //     & input::placeholder {
    //       font-weight: normal;
    //     }
    //   `,
    // },
  },
  layer: {
    background: 'red',
  },
  tag: {
    border: {
      color: 'brand',
    },
  },
  anchor: {
    color: 'brand',
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
  text: {
    extend: { '-webkit-font-smoothing': 'auto' },
  },
  paragraph: {
    extend: { '-webkit-font-smoothing': 'auto' },
  },
});

export type CustomTheme = typeof theme;
export default theme;
