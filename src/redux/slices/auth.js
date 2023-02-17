import { createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { authService } from '~/api/auth';

// ----------------------------------------------------------------------

const initialState = {
  error: false,
  loginLoading: false,
  logoutLoading: false,
  accessToken:
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJMNmcwZDB5OUVvOGpJTTNXNkp5ZTRRRllDeWhzb3F5SlA1WER0Y2lpcGNrIn0.eyJleHAiOjE2MzgzMjgzMDEsImlhdCI6MTYzODMyNzcwMSwiYXV0aF90aW1lIjoxNjM4MzI3NzAwLCJqdGkiOiJlNGJkNDVmYy1jNzk3LTQyZGMtODJmYS03ODEyMWI2OGI0M2QiLCJpc3MiOiJodHRwOi8va2V5Y2xvYWsuc3lzLmJpZ2RhdGEubG9jYWwvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImYwMmQwZDIwLTBlYWYtNDI1ZC04YTg0LWI3ZjY3YWNiMjkzZSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImRtYy1iYWNrZW5kIiwic2Vzc2lvbl9zdGF0ZSI6IjJhYjlhMjMyLTQ0ZDctNDFkZS05MDQxLWM1MzllZTg2YWMwMiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9kbWMuZGV2LmJpZ2RhdGEubG9jYWwiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJkbWMtYmFja2VuZCI6eyJyb2xlcyI6WyJSRUFEIiwiQ1JFQVRFIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJncm91cF9yb2xlcyI6WyJVU0VSX1NQQUNFIl0sIm5hbWUiOiJIYSBYdWFuIERhdCIsIndlYnNpdGVzIjoiaHR0cHM6Ly9kbWMuZGV2LmJpZ2RhdGEubG9jYWwvIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdHVzZXIiLCJnaXZlbl9uYW1lIjoiSGEiLCJmYW1pbHlfbmFtZSI6Ilh1YW4gRGF0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIn0.SnpRCdX_36sFeQNBmgKvj9k765GomalW__vNQkFvJXuVJWuIuv4cfh1JfeKtzzcXxk_-XkoG8sHK50OC1nsitYh36CoO_m7kgwmq4E6Pegxyzt7Aq_uhON1LiyiXTmmF1qHem0unkJhVmUF1A6ayJh_jSeD8_re-JtGftDCKqB0096okAGYGFxzcGrngxp1j9kUR6y2Giyv_TZngZutG63SNDFYKSwp-K3b1BfLUzNnLjlJBBk4Twv0umlJELGg18y4PgNrM2aMRgCmjoDwvXQiRM9j1gHTR2FnPlyaCAKRa_jOWjE6K2ZpUN2nHiqA0ykru46aTjlpMMY_mOIMRXQ',
  username: 'testuser',
  roles:
    '{"dmc-backend":{"roles":["read","create"]},"account":{"roles":["manage-account","manage-account-links","view-profile"]}}',
  groups: '["user_space"]',
  siteUrl: null,
  authUri: ''
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // START LOADING
    toggleLoading(state, action) {
      const { status, keyLoading } = action.payload;
      state[keyLoading] = status ? status : !state[keyLoading];
    },

    // HAS ERROR
    hasError(state, action) {
      const { error, keyLoading } = action.payload;
      if (keyLoading) {
        state[keyLoading] = false;
      }
      state.error = error;
    },

    // SAVE
    save(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },

    // LOGIN SUCCESS
    loginSuccess(state, action) {
      const {
        access_token,
        username,
        roles,
        groups,
        website
      } = action.payload.data;
      state.accessToken = access_token;
      state.username = username;
      state.roles = roles;
      state.groups = groups;
      state.siteUrl = website;
      storage.setItem('accessToken', access_token);
    },

    // LOGOUT SUCCESS
    logout(state, action) {
      state.accessToken = null;
      storage.removeItem('redux-auth');
      storage.removeItem('accessToken');
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { logout, save } = slice.actions;

// ----------------------------------------------------------------------

export function login(data) {
  return async dispatch => {
    dispatch(
      slice.actions.toggleLoading({
        keyLoading: 'loginLoading',
        status: true
      })
    );
    try {
      const response = await authService._login(data);
      if (response.data.success) {
        dispatch(
          slice.actions.loginSuccess({
            data: response.data.data
          })
        );

        dispatch(
          slice.actions.toggleLoading({
            keyLoading: 'loginLoading',
            status: false
          })
        );
        return;
      }
      throw response;
    } catch (error) {
      dispatch(slice.actions.hasError({ keyLoading: 'loginLoading', error }));
    }
  };
}

export function centralLogout() {
  return async dispatch => {
    dispatch(
      slice.actions.toggleLoading({
        keyLoading: 'logoutLoading',
        status: true
      })
    );
    try {
      const response = await authService._centralLogout();
      if (response) {
        dispatch(slice.actions.logout());
        return;
      }
      throw response;
    } catch (error) {
      dispatch(slice.actions.hasError({ keyLoading: 'logoutLoading', error }));
    }
  };
}

export function sessionLogout() {
  return async dispatch => {
    try {
      const response = await authService._logout();
      if (response.status === 200) {
        dispatch(slice.actions.logout());
        return;
      }
      throw response;
    } catch (error) {
      dispatch(slice.actions.hasError({ error }));
    }
  };
}

export function validateToken({ token }) {
  return async dispatch => {
    dispatch(
      slice.actions.toggleLoading({
        keyLoading: 'loginLoading',
        status: true
      })
    );
    try {
      const response = await authService._validateToken({ token });
      console.log('validateToken', response);
      if (response) {
        // dispatch(
        //   slice.actions.loginSuccess({
        //     data: response.data.data
        //   })
        // );

        dispatch(
          slice.actions.toggleLoading({
            keyLoading: 'loginLoading',
            status: false
          })
        );
        return;
      }
      throw response;
    } catch (error) {
      dispatch(slice.actions.hasError({ keyLoading: 'loginLoading', error }));
    }
  };
}

export function getUserInfo() {
  return async dispatch => {
    dispatch(
      slice.actions.toggleLoading({
        keyLoading: 'loginLoading',
        status: true
      })
    );
    try {
      const response = await authService._getUserInfo();
      if (response) {
        if (response.data.access_token !== 'N/A') {
          dispatch(
            slice.actions.loginSuccess({
              data: response.data
            })
          );
        }
        if (response.data.access_token === 'N/A') {
          dispatch(slice.actions.logout());
        }
        dispatch(
          slice.actions.toggleLoading({
            keyLoading: 'loginLoading',
            status: false
          })
        );
        return;
      }
      // if (response && response.access_token === 'N/A') {
      //   dispatch(
      //     slice.actions.toggleLoading({
      //       keyLoading: 'loginLoading',
      //       status: false
      //     })
      //   );
      //   dispatch(slice.actions.logout());
      //   return;
      // }
      throw response;
    } catch (error) {
      dispatch(slice.actions.hasError({ keyLoading: 'loginLoading', error }));
    }
  };
}
