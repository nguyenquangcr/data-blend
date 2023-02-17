import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { PATH_PAGE } from '~/routes/paths';
import LoadingScreen from '~/components/LoadingScreen';
import { getUserInfo } from '~/redux/slices/auth';

// ----------------------------------------------------------------------

AuthProtect.propTypes = {
  children: PropTypes.node
};

function AuthProtect({ children }) {
  const { accessToken, loginLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInfo());
  }, []);

  if (loginLoading) {
    return <LoadingScreen />;
  }

  if (!accessToken) {
    return <Redirect to={PATH_PAGE.auth.login} />;
  }

  return children;
}

export default AuthProtect;
