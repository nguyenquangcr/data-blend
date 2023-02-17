import React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Grid, Button } from '@mui/material';
import { save } from '~/redux/slices/auth';
import { apiConfig } from '~/config';

// ----------------------------------------------------------------------

const useStyles = makeStyles(theme => ({
  root: {}
}));

// ----------------------------------------------------------------------

OpenIDLogin.propTypes = {
  className: PropTypes.string
};

function OpenIDLogin({ className }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleSaveAuthUri = uri => {
    dispatch(save({ key: 'authUri', value: uri }));
    localStorage.setItem('authUri', uri);
  };

  return (
    <Grid container spacing={2} className={clsx(classes.root, className)}>
      <Grid item xs>
        <Button
          fullWidth
          size="large"
          href={`${apiConfig.apiUrl}/csoc/auth`}
          variant="contained"
          onClick={() => handleSaveAuthUri(`${apiConfig.apiUrl}/csoc`)}
        >
          Login via FPT Account
        </Button>
      </Grid>
    </Grid>
  );
}

export default OpenIDLogin;
