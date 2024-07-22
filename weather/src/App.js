import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import './App.css';

function App() {
  const apiKey = "f56f24967aaf51182d1d4df628297c6d";
  const [inputCity, setInputCity] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);

  const getWeatherDetails = async (cityName) => {
    if (!cityName) return;
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(apiURL);
      setData(response.data);
    } catch (err) {
      setError("City not found or network error.");
    } finally {
      setLoading(false);
    }
  };

  const getCitySuggestions = async (input) => {
    if (!input) return;
    const geoAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`;

    try {
      const response = await axios.get(geoAPIURL);
      setCitySuggestions(response.data);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
    }
  };

  const handleChangeInput = (e) => {
    const value = e.target.value;
    setInputCity(value);
    getCitySuggestions(value);
  };

  const handleSelectCity = (cityName) => {
    setInputCity(cityName);
    setCitySuggestions([]);
    getWeatherDetails(cityName);
  };

  const handleSearch = () => {
    getWeatherDetails(inputCity);
  };

  return (
    <div className="col-md-12">
      <div className="weatherBg">
        <h1 className="heading">Weather App</h1>
        <div className="d-grid gap-3 col-4 mt-4">
          <input
            type="text"
            className="form-control"
            value={inputCity}
            onChange={handleChangeInput}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {citySuggestions.length > 0 && (
          <div className="suggestions-box">
            <ul className="list-group">
              {citySuggestions.map((city) => (
                <li
                  key={city.name}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSelectCity(city.name)}
                >
                  {city.name}, {city.country}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {loading && <div className="text-center mt-4">Loading...</div>}

      {error && <div className="text-center mt-4 text-danger">{error}</div>}

      {Object.keys(data).length > 0 && !loading && (
        <div className="col-md-12 text-center mt-5">
          <div className="shadow rounded weatherResultBox">
            <img
              className="weatherIcon"
              src="https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png"
              alt="Weather Icon"
            />
            <h5 className="weatherCity">{data?.name}</h5>
            <h6 className="weatherTemp">
              {((data?.main?.temp) - 273.15).toFixed(2)}°C
            </h6>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
