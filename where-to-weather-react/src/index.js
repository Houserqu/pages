import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import { Provider } from 'mobx-react';
import registerServiceWorker from './registerServiceWorker';
import WeatherStore from './stores/WeatherStore';

let stores = {
  WeatherStore,
};

ReactDOM.render((
  <Provider {...stores}>
    <App />
  </Provider>
  ), document.getElementById('root'));
registerServiceWorker();
