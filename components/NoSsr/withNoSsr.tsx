import NoSsr from './NoSsr';

function withNoSsr<T>(Component: React.FC<T>) {
  const WrappedComponent: React.FC<T> = (props: T) => (
    <NoSsr>
      <Component {...props} />
    </NoSsr>
  );
  return WrappedComponent;
}

export default withNoSsr;
