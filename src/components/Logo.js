import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  className: PropTypes.string
};

function Logo({ className, ...other }) {
  return (
    <Box
      component="img"
      alt="logo"
      src={`${process.env.REACT_APP_URL}/img/dmc/apps/datablend.png`}
      height={35}
      className={className}
      {...other}
    />
  );
}

export default Logo;
