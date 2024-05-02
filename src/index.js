import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
   reducer,
   applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);
/*const myTemplate = (
  <div>
    <h1>Hello World</h1>
    <p>Welcome to my website</p>
  </div>
);
ReactDOM.render(myTemplate, document.getElementById('root'));*/
ReactDOM.render( <Provider store={store}>
  
  <App />
</Provider>, document.getElementById('root'));


