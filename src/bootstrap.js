import React from 'react';
import App from './App';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

// ----------------------------------------------------------------------
// Opt-in to Webpack hot module replacement
if (module.hot) module.hot.accept();

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
