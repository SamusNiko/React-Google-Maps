import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import mapReducer from './reducer';

const store = createStore(mapReducer, applyMiddleware(thunk));
export default store;
