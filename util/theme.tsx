import { grommet } from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

const theme = deepMerge(grommet, {
  global: {
    font: {
      family: "'Barlow', sans-serif",
      size: '18px',
      height: '20px',
    },
    colors: {
      brand: { light: '#112f6a', dark: '#91b0ee' },
      parchment: { light: '#e8ceba', dark: '#383842' },
      parchmentInset: { light: '#c29c80', dark: '#1c1c21' },
      popup: { light: '#f4e7dd', dark: '#101013' },
      info: '#FFCA58',
      'status-ok': '#00C781',
      control: 'brand',
      focus: 'brand',
      border: {
        dark: 'rgba(255, 255, 255, 0.33)',
        light: 'rgba(0, 0, 0, 0.33)',
      },
      placeholder: 'text',
      text: { dark: '#FCF5E5', light: '#0f0f0f' },
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
  avatar: {
    size: {
      medium: '48px',
      small: '36px',
      xsmall: '24px',
    },
  },
  heading: {
    font: {
      family: "'Merienda', cursive",
    },
    extend: {
      '-webkit-font-smoothing': 'auto',
      'word-break': 'break-word',
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
  tag: {
    border: {
      color: 'brand',
    },
  },
  tip: {
    content: {
      background: 'popup',
      round: 'none',
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
  formField: {
    label: {
      margin: {
        top: 'xsmall',
        bottom: 'xsmall',
        right: 'small',
        left: '0',
      },
    },
  },
  grommet: {
    extend: {
      // overflow: 'hidden',
    },
  },
});

type ThemeType = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}

export default theme;
