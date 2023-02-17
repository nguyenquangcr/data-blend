import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
// import remoteRoutes from 'app2/routes';
// import App2 from 'app2/App2';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ToastContainer } from 'react-toastify';
import routes, { renderRoutes } from '~/routes';
import LoadingScreen from '~/components/LoadingScreen';
import ThemeConfig from './theme';
// ----------------------------------------------------------------------

import 'lazysizes';
import './_mock_api_';
import './utils/i18n';
import './utils/highlight';
import 'intersection-observer';
import 'simplebar/src/simplebar.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'slick-carousel/slick/slick.css';
import 'react-image-lightbox/style.css';
import 'react-quill/dist/quill.snow.css';
import 'slick-carousel/slick/slick-theme.css';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-awesome-query-builder-pd/lib/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';

//css-new
import '@cads-ui/core/index.css';

const history = createBrowserHistory();

export const valueTabContext = React.createContext(0);

function ValueTabProvider({ children }) {
  const [valueTab, setValueTab] = React.useState({
    tabConnection: 0,
    tabDataset: 0,
    tabPipeline: 0
  });
  return (
    <valueTabContext.Provider value={[valueTab, setValueTab]}>
      {children}
    </valueTabContext.Provider>
  );
}

function App() {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Provider store={store}>
          <ValueTabProvider>
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
              <ThemeConfig>
                <Router history={history}>{renderRoutes(routes)}</Router>
              </ThemeConfig>
            </PersistGate>
          </ValueTabProvider>
        </Provider>
      </Suspense>
    </>
  );
}

export default App;
