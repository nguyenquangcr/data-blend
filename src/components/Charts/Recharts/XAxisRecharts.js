import React from 'react';
import { XAxis } from 'recharts';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

function XAxisRecharts({ ...other }) {
  const theme = useTheme();

  return (
    <XAxis
      axisLine={false}
      tickLine={false}
      tickSize={16}
      tick={{
        fill: theme.palette.text.disabled,
        fontSize: 12
      }}
      {...other}
    />
  );
}

export default XAxisRecharts;
