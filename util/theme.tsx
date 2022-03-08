const brandColor = 'rgb(219, 98, 9)';
const theme = {
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
};

export type CustomTheme = typeof theme;
export default theme;
