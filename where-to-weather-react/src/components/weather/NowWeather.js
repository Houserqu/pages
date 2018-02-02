import React from 'react';

const NowWeather = ({ weather, week, img, temp }) => {
  return (
    <div className='weather__daily--now'>
      <div className='weather__daily--now-temp'>
        {temp}
      </div>
      <div className='weather__daily--now-icon'>
        <img src={`/weathericon/${img}.png`} className=''/>
      </div>
    </div>
  );
}

export default NowWeather;
