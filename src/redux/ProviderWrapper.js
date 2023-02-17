import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { store } from './store';

// ----------------------------------------------------------------------

ProviderWrapper.propTypes = {
  children: PropTypes.node
};

function ProviderWrapper({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export default ProviderWrapper;
