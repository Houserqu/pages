import React from 'react';

const WeatherItem = ({data}) => {
  const { day, night, week } = data
  return (
    <div className='weather__daily--item'>
      <p>
        {week}
        </p>
      <img src={`/weathericon/${day.img}.png`} className=''/>
      <p>
        {day.temphigh} ~ {night.templow}
      </p>
    </div>
  );
}

export default WeatherItem;
