import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { ThunkDispatch } from "redux-thunk";
import { fetchWeatherData } from "../Redux/weatherSlice";
import "./Main.css";

interface WeatherDay {
  ob_time: string;
  valid_date: string;
  temp: number;
  app_min_temp: number;
  app_max_temp: number;
  weather: {
    description: string;
    icon: string;
  };
}

const Main: React.FunctionComponent = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [city, setCity] = useState<string>("");
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
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
    const formattedDate = new Date(datetime).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate === "Invalid Date" ? datetime : formattedDate;
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <>
      <div
        className="d-flex flex-column vh-100 justify-content-center align-items-center"
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#C1CFEA",
        }}
      >
        <div className="p-3 bg-transparent">
          <div className="input-group mb-3">
            <span className="input-group-text">Right now in,</span>
            <input
              type="text"
              className="form-control rounded"
              placeholder="Enter city name"
              value={city}
              onChange={handleCityChange}
              style={{ height: "40px" }}
            />
            <span className="input-group-text">and it's forecast</span>
          </div>
        </div>

        <div className="position-absolute top-0 end-0 m-3">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {weatherData && weatherData.data && (
          <div className="d-flex justify-content-center align-items-center flex-column">
            <div
              className="card p-3 mb-3 bg-transparent"
              style={{ width: "400px" }}
            >
              <h5 className="card-title">Current Weather</h5>
              <p className="card-text">City: {selectedCity}</p>
              <p className="card-text">
                Temperature: {weatherData.data[0].temp}°C
              </p>
              <p className="card-text">
                Min Temperature: {weatherData.data[0].app_min_temp}°C | Max
                Temperature: {weatherData.data[0].app_max_temp}°C
              </p>
              <p className="card-text">
                Weather Description: {weatherData.data[0].weather.description}
              </p>

              <img
                src={`https://www.weatherbit.io/static/img/icons/${weatherData.data[0].weather.icon}.png`}
                alt="Current Weather Icon"
                style={{
                  width: "50px",
                  height: "50px",
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                }}
              />
            </div>

            <div className="d-flex justify-content-between">
              {weatherData.data.slice(1, 7).map((day: WeatherDay) => (
                <div
                  key={day.ob_time}
                  className="card p-3 mb-3 bg-transparent mt-3 ml-3"
                  style={{
                    width: "200px",
                    margin: "0 10px",
                    position: "relative",
                  }}
                >
                  <h6 className="card-title">{formatDate(day.valid_date)}</h6>
                  <p className="card-text">Temperature: {day.temp}°C</p>
                  <p className="card-text">
                    Min Temperature: {day.app_min_temp}°C
                  </p>
                  <p className="card-text">
                    Max Temperature: {day.app_max_temp}°C
                  </p>
                  <p className="card-text">
                    Weather: {day.weather.description}
                  </p>
                  <img
                    src={`https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`}
                    alt={`${day.weather.description} Icon`}
                    style={{
                      width: "50px",
                      height: "50px",
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
