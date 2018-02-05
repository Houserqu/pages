import React from 'react';

const NowWeather = ({ weather, week, img, temp, winddirect }) => {
  return (
    <div className='w-daily__now'>
      <div className='w-daily__now--temp'>
        <div className='temp'>
          {temp}
        </div>
        <div className='day'>
          星期天
        </div>
      </div>
      <div className='w-daily__now--icon'>
        <img src={`/weathericon/${img}.png`} className=''/>
        <div className="wind">
          {winddirect}
        </div>
      </div>
    </div>
  );
}

export default NowWeather;
