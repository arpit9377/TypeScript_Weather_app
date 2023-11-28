import React, { useState, useEffect, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { fetchWeatherData } from '../Redux/weatherSlice';

const Main: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [city, setCity] = useState<string>('');
  const weatherData = useSelector((state: RootState) => state.weather.data);
  const selectedCity = useSelector((state: RootState) => state.weather.city);

  const handleCityChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newCity = e.currentTarget.value;
    setCity(newCity);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (city) {
        dispatch(fetchWeatherData(city));
      }
    }, 3500);

    return () => clearTimeout(delayDebounceFn);
  }, [city, dispatch]);

  const formatDate = (datetime: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const formattedDate = new Date(datetime).toLocaleDateString(undefined, options);
    return formattedDate === 'Invalid Date' ? datetime : formattedDate;
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="d-flex flex-column vh-100 justify-content-center align-items-center" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#C1CFEA' }}>
      <div className="p-3 bg-transparent">
        <div className="input-group mb-3">
          <span className="input-group-text">Right now in,</span>
          <input type="text" className="form-control rounded" placeholder="Enter city name" value={city} onChange={handleCityChange} style={{ height: '40px' }} />
          <span className="input-group-text">and it's forecast</span>
        </div>
      </div>

      <div className="position-absolute top-0 end-0 m-3">
        <button type="button" className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {weatherData && weatherData.temperature && (
        <div className="d-flex justify-content-center align-items-center flex-column">
          <div className="card p-3 mb-3 bg-transparent" style={{ width: '400px' }}>
            <h5 className="card-title">Current Weather</h5>
            <p className="card-text">City: {selectedCity}</p>
            <p className="card-text">Temperature: {weatherData.temperature}°C</p>
            <p className="card-text">
              Min Temperature: {weatherData.minTemperature}°C | Max Temperature: {weatherData.maxTemperature}°C
            </p>
            <p className="card-text">Weather Description: {weatherData.weatherDescription}</p>

            <img
              src={`https://www.weatherbit.io/static/img/icons/${weatherData.weatherIcon}.png`}
              alt="Current Weather Icon"
              style={{ width: '50px', height: '50px', position: 'absolute', top: '5px', right: '5px' }}
            />
          </div>

          
        </div>
      )}
    </div>
  );
};

export default Main;
