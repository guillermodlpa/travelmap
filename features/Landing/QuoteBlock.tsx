import { Box, Paragraph } from 'grommet';

export default function QuoteBlock({ content, author }: { content: string; author: string }) {
  return (
    <Box
      flex={{ shrink: 0 }}
      border={{ side: 'left', size: 'medium' }}
      pad={{ left: 'medium' }}
      margin={{ vertical: 'medium' }}
    >
      <Paragraph margin={{ top: '0' }} fill style={{ whiteSpace: 'pre-line' }}>
        {content}
      </Paragraph>
      <Paragraph textAlign="end" margin={{ top: '0' }} fill>
        {`― ${author}`}
      </Paragraph>
    </Box>
  );
}
