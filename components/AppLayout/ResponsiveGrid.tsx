import { Grid, GridProps, ResponsiveContext } from 'grommet';
import { useContext } from 'react';

interface ResponsiveGridProps extends GridProps {
  smallGridProps?: GridProps;
  mediumGridProps?: GridProps;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  smallGridProps = {},
  mediumGridProps = {},
  ...props
}) => {
  const size = useContext(ResponsiveContext);
  const useSmall = size === 'small';
  return (
    <Grid {...props} {...(useSmall ? smallGridProps : mediumGridProps)}>
      {children}
    </Grid>
  );
};

export default ResponsiveGrid;
