import { Anchor, Footer } from 'grommet';

const AppFooter: React.FC = () => (
  <Footer
    pad={{ horizontal: 'medium', vertical: 'medium' }}
    responsive={false}
    background="background-front"
  >
    <Anchor
      href="https://guillermodelapuente.com"
      target="_blank"
    >{`Author's website, Guillermo de la Puente`}</Anchor>
  </Footer>
);

export default AppFooter;
