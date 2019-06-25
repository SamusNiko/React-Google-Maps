import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/components/App';
import * as serviceWorker from '@/serviceWorker';

const app = (
  <div>
    <App />
  </div>
);

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.register();
