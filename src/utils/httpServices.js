import { apiConfig } from '../config';
import { getLocalStorage } from './localStorage';
import axios from 'axios';
import storage from 'redux-persist/lib/storage';
import { useDispatch } from 'react-redux';
import { logoutAction } from '~/redux/slices/auth';
import { CENTRAL_LOGOUT_ENDPOINT } from '~/api/endpoint';

// ----------------------------------------------------------------------

const getLocalUri = () => {
  const authUri = getLocalStorage('authUri');
  if (authUri) {
    return authUri;
  }
  return apiConfig.apiUrl;
};

const getLocalToken = () => {
  const accessToken = getLocalStorage('accessToken');
  if (accessToken) {
    return `Bearer ${accessToken}`;
  }
  return null;
};

const axiosInstance = axios.create({
  baseURL: getLocalUri()
});

axiosInstance.interceptors.request.use(
  config => {
    // Do something before request is sent
    config.headers['Authorization'] = getLocalToken();
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // if (
    //   error?.response?.data?.code !== undefined &&
    //   error?.response?.data?.code == 401
    // ) {
    //   window.location = CENTRAL_LOGOUT_ENDPOINT;
    //   storage.removeItem('redux-auth');
    //   storage.removeItem('accessToken');
    // }
    // if (
    //   error?.response?.status !== undefined &&
    //   error?.response?.status == 401
    // ) {
    //   window.location = CENTRAL_LOGOUT_ENDPOINT;
    //   storage.removeItem('redux-auth');
    //   storage.removeItem('accessToken');
    // }
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);

export default axiosInstance;

export const requestAll = (requests, keys) => {
  return Promise.all(requests)
    .then(values => {
      return keys.map((k, index) => {
        return {
          [k]: values[index]
        };
      });
    })
    .catch(err => {
      console.log(err);
    });
};
