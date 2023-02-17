import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
// import { rootPersistConfig, rootReducer } from './rootReducer';
import rootReducer from './rootReducer';
import rootPersistConfig from './rootPersisConfig';

// ----------------------------------------------------------------------

const store = configureStore({
  // reducer: persistReducer(rootPersistConfig, rootReducer),
  reducer: persistReducer(rootPersistConfig, combineReducers(rootReducer)),
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false
  })
});

const persistor = persistStore(store);

export { store, persistor };
