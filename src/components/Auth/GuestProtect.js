import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { PATH_APP } from '~/routes/paths';
import { Redirect } from 'react-router-dom';
import LoadingScreen from '~/components/LoadingScreen';

// ----------------------------------------------------------------------

GuestProtect.propTypes = {
  children: PropTypes.node
};

function GuestProtect({ children }) {
  const { accessToken, loginLoading } = useSelector(state => state.auth);

  if (loginLoading) {
    return <LoadingScreen />;
  }

  if (accessToken) {
    return <Redirect to={PATH_APP.main.overview} />;
  }

  return children;
}

export default GuestProtect;
