// import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import darkModeReducer from './slices/dark-mode';
import calendarReducer from './slices/calendar';
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import blogReducer from './slices/blog';
import productReducer from './slices/product';
import userReducer from './slices/user';
import notificationsReducer from './slices/notifications';
import authReducer from './slices/auth';
import projectReducer from './slices/project';
import uploadReducer from './slices/upload';

// ----------------------------------------------------------------------

// const rootPersistConfig = {
//   key: 'root',
//   storage: storage,
//   keyPrefix: 'redux-',
//   version: 1,
//   whitelist: ['theme']
// };

const productPersistConfig = {
  key: 'product',
  storage: storage,
  keyPrefix: 'redux-',
  blacklist: ['isLoading', 'error', 'products', 'product', 'filters']
};

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  keyPrefix: 'redux-',
  blacklist: ['loginLoading', 'username', 'error']
};

// const rootReducer = combineReducers({
const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  theme: darkModeReducer,
  calendar: calendarReducer,
  mail: mailReducer,
  chat: chatReducer,
  blog: blogReducer,
  product: persistReducer(productPersistConfig, productReducer),
  user: userReducer,
  notifications: notificationsReducer,
  project: projectReducer,
  upload: uploadReducer
  // });
};

// export { rootPersistConfig, rootReducer };
export default rootReducer;
