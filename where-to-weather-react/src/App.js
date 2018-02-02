import React, { Component } from 'react';
import './App.less';
import { inject } from 'mobx-react';
import Weather from "./page/Weather";

@inject('WeatherStore')
class App extends Component {
  render() {
    return (
      <Weather/>
    );
  }
}

export default App;
