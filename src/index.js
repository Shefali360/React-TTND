import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { store } from './store/store';
import {Provider} from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
    <App className={styles.container}/>
  </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
