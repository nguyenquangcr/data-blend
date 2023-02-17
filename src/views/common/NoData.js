import { Box, Typography } from '@mui/material';
import { linkImage } from '../data-integration/detail-datablend/constant';

export const NoData = ({ text, size }) => {
  return (
    <Box textAlign="center" p={6}>
      <img
        src={`${linkImage}/no-data.png`}
        alt="No data found"
        style={{ margin: '0 auto' }}
        width={size === 'small' ? 100 : size === 'medium' ? '50%' : '100%'}
      />
      <Typography
        variant={size === 'small' ? 'body1' : size === 'medium' ? 'h3' : 'h1'}
        color="#919EAB"
      >
        {text}
      </Typography>
    </Box>
  );
};
