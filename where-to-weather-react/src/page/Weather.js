import React, {Component} from 'react';
import {inject} from "mobx-react/index";
import "../components/weather/weather.less";
import DailyWeather from "../components/weather/DailyWeather";
import NowWeather from "../components/weather/NowWeather";
import Location from "../components/weather/Location";
import WeatherTitle from "../components/weather/WeatherTitle";

@inject('WeatherStore')
class Weather extends Component {
  state = {}

  componentDidMount(){
    this.props.WeatherStore.fetchWeather();
  }

  render(){
    const { daily, weather, week, img, temp, winddirect } = this.props.WeatherStore.weather;

    return (
      <div className='weather'>
        <div className="weather__content">
          <WeatherTitle/>
          <Location/>
        </div>
        <div className="weather__footer--glass" />
        <div className="weather__footer">
          <NowWeather weather={weather} week={week} img={img} temp={temp} winddirect={winddirect} />
          <DailyWeather data={daily}/>
        </div>
      </div>
    )
  }
}

export default Weather;
