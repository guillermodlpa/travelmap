import NoSsr from './NoSsr';

export default function withNoSsr<T>(Component: React.ComponentType<T>) {
  const WrappedComponent: React.ComponentType<T> = (props: T) => (
    <NoSsr>
      <Component {...props} />
    </NoSsr>
  );
  return WrappedComponent;
}
