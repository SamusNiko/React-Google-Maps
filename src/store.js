import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import mapReducer from './reducer';

const store = createStore(mapReducer, applyMiddleware(thunk));

store.subscribe(() => {
  console.log(store.getState());
});

export default store;
