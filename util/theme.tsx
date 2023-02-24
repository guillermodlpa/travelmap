import { grommet } from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

const getColorCode = (theme: ThemeType, colorValue: string): string => {
  const themeColor = theme.global.colors?.[colorValue];
  if (typeof themeColor === 'string') {
    return themeColor;
  }
  if (typeof themeColor === 'object' && themeColor[theme.dark ? 'dark' : 'light']) {
    return themeColor[theme.dark ? 'dark' : 'light'] as string;
  }
  return colorValue;
};

const customTheme = deepMerge(grommet, {
  global: {
    animation: { duration: '0.5s' },
    font: {
      family: "'Barlow', sans-serif",
      size: '18px',
      height: '20px',
    },
    colors: {
      active: { light: 'rgba(0, 0, 0, 0.05)', dark: 'rgba(255, 255, 255, 0.05)' },
      brand: { light: '#112f6a', dark: '#91b0ee' },
      parchment: { light: '#e8ceba', dark: '#383842' },
      parchmentInset: { light: '#c29c80', dark: '#1c1c21' },
      popup: { light: '#f4e7dd', dark: '#101013' },
      'map-background': { light: '#cfb19b', dark: '#1c1b1e' },
      info: '#FFCA58',
      'status-ok': '#00C781',
      control: 'brand',
      focus: 'brand',
      border: { light: 'rgba(0, 0, 0, 0.33)', dark: 'rgba(255, 255, 255, 0.33)' },
      placeholder: 'text',
      text: { light: '#0f0f0f', dark: '#FCF5E5' },
      'text-inverted': { light: '#FCF5E5', dark: '#0f0f0f' },
      'text-footer': { light: '#FCF5E5', dark: '#FCF5E5' },
      'text-strong': { light: '#000000', dark: '#FFFFFF' },
      'text-weak': { light: '#555555', dark: '#CCCCCC' },
      'text-xweak': { light: '#666666', dark: '#BBBBBB' },
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
    focus: {
      shadow: {
        color: { light: '#112f6a', dark: '#91b0ee' },
        size: '3px',
      },
    },
    drop: {
      zIndex: 200,
    },
  },
  layer: {
    zIndex: 100,
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
      'margin-top': '0',
      '-webkit-font-smoothing': 'auto',
      'word-break': 'break-word',
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
    //   extend: (/* { open, theme: ThemeType } */) => css`
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
    extend: () => css<{
      hasIcon: boolean;
      hasLabel: boolean;
      sizeProp: 'small' | 'medium' | 'large';
    }>`
      ${(props) => {
        // We customize padding for icon-only buttons
        const iconOnlyButton = Boolean(props.hasIcon && !props.hasLabel);
        if (iconOnlyButton) {
          const pad = {
            large: '10px',
            medium: '4px',
            small: '2px',
          }[props.sizeProp];
          return pad ? `padding: ${pad} ${pad};` : '';
        }
        return '';
      }}
    `,
    border: { radius: '0px' },
    size: {
      large: { pad: { vertical: '10px', horizontal: '24px' } },
      medium: { pad: { vertical: '4px', horizontal: '22px' } },
      small: { pad: { vertical: '4px', horizontal: '20px' } },
    },
    default: {
      color: 'text',
      extend: () => css`
        font-weight: 600;
        border-radius: 5px;
      `,
    },
    primary: {
      background: 'transparent',
      color: 'text-inverted',
      extend: () => css<{ colorValue: string }>`
        position: relative;
        background-color: transparent; // override when a color is set, like status-critical
        font-weight: 600;

        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          filter: url(#wavy-button);
          z-index: -1;
          background-color: ${(props) => getColorCode(props.theme, props.colorValue || 'brand')};
          /* translateZ(0) is a Safari workaround. https://stackoverflow.com/a/58289524/2853239 */
          transform: scale(1) translateZ(0);
          transition: transform 0.1s ease-in-out;
        }
      `,
    },
    secondary: {
      color: 'brand',
      extend: () => css<{ colorValue: string }>`
        position: relative;
        font-weight: 600;

        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          filter: url(#wavy-button);
          z-index: -1;
          border: 2px solid ${(props) => getColorCode(props.theme, props.colorValue || 'brand')};
          /* translateZ(0) is a Safari workaround. https://stackoverflow.com/a/58289524/2853239 */
          transform: scale(1) translateZ(0);
          transition: transform 0.1s ease-in-out;
        }
      `,
    },
    hover: {
      primary: {
        extend: () => css`
          &:before {
            transform: scale(1.1) translateZ(0);
          }
        `,
      },
      secondary: {
        extend: () => css`
          &:before {
            transform: scale(1.1) translateZ(0);
          }
        `,
      },
      default: {
        background: 'active',
      },
    },
  },
  text: {
    extend: { '-webkit-font-smoothing': 'auto' },
    small: { size: '13px' },
    medium: { size: '16px' },
    large: { size: '20px' },
  },
  paragraph: {
    extend: { '-webkit-font-smoothing': 'auto' },
    small: { size: '13px' },
    medium: { size: '16px' },
    large: { size: '20px' },
  },
  formField: {
    extend: () => css`
      width: 100%;
    `,
    label: {
      margin: {
        top: 'xsmall',
        bottom: 'xsmall',
        right: 'small',
        left: '0',
      },
    },
  },
  card: {
    container: {
      background: 'popup',
      border: {
        style: 'double',
        size: '4px',
      },
      elevation: 'none',
    },
  },
  grommet: {},
});

type ThemeType = typeof customTheme & { dark: boolean };

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}

export default customTheme;
