import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from '@/container/App';
import * as serviceWorker from '@/serviceWorker';

import store from '@/store';

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.register();
