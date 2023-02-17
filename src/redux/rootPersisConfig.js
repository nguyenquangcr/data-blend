import storage from 'redux-persist/lib/storage';

const rootPersistConfig = {
  key: 'root',

  storage: storage,

  keyPrefix: 'redux-',

  version: 1,

  whitelist: ['theme']
};

export default rootPersistConfig;
