import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from '@/hoc';
import * as serviceWorker from '@/serviceWorker';

const app = <Wrapper />;

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.register();
