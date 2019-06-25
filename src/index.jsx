import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/container/App';
import * as serviceWorker from '@/serviceWorker';

const app = (
  <div>
    <App />
  </div>
);

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.register();
