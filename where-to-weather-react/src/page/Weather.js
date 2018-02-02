import React, {Component} from 'react';
import {inject} from "mobx-react/index";
import "../components/weather/weather.less";
import DailyWeather from "../components/weather/DailyWeather";
import NowWeather from "../components/weather/NowWeather";

@inject('WeatherStore')
class Weather extends Component {
  state = {}

  componentDidMount(){
    this.props.WeatherStore.fetchWeather();
  }

  render(){
    const { daily, weather, week, img, temp } = this.props.WeatherStore.weather;

    return (
      <div>
        <div className="weather__content">

        </div>
        <div className="weather__footer">
          <NowWeather weather={weather} week={week} img={img} temp={temp} />
          <DailyWeather data={daily}/>
        </div>
      </div>

    )
  }
}

export default Weather;
