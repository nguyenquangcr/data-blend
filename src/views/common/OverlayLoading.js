import { Box } from '@mui/material';

export const OverlayLoading = ({ isLoading, children }) => {
  return (
    isLoading && (
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={10}
        style={{ backgroundColor: 'rgba(250,250,250,0.5)' }}
      >
        {children}
      </Box>
    )
  );
};
