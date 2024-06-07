import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./ApiKeys";
import ReactAnimatedWeather from "react-animated-weather";

const Forcast = (props) => {
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const [weather, setWeather] = useState({});
    const [state, setState] = useState({});

    const search = async (city) => {
        try {
            const response = await axios.get(
                `${apiKeys.base}weather?q=${city}&units=metric&APPID=${apiKeys.key}`
            );
            if (JSON.stringify(weather) !== JSON.stringify(response.data)) {
                setWeather(response.data);
                setQuery('');
            }
        } catch (error) {
            console.error(error);
            setError({ message: 'Not Found', query: query });
        }
    };

    const defaults = {
        color: "white",
        size: 112,
        animate: true,
    };

    useEffect(() => {
        if (weather.weather && weather.weather[0].main) {
            switch (weather.weather[0].main) {
                case "Haze":
                    setState({ icon: "CLEAR_DAY", weather: "Cerah" });
                    break;
                case "Clouds":
                    setState({ icon: "CLOUDY", weather: "Berawan" });
                    break;
                case "Rain":
                    setState({ icon: "RAIN", weather: "Hujan" });
                    break;
                case "Snow":
                    setState({ icon: "SNOW", weather: "Salju" });
                    break;
                case "Dust":
                    setState({ icon: "WIND", weather: "Debu" });
                    break;
                case "Drizzle":
                    setState({ icon: "SLEET", weather: "Gerimis" });
                    break;
                case "Fog":
                    setState({ icon: "FOG", weather: "Kabut" });
                    break;
                case "Smoke":
                    setState({ icon: "FOG", weather: "Asap" });
                    break;
                case "Tornado":
                    setState({ icon: "WIND", weather: "Tornado" });
                    break;
                default:
                    setState({ icon: "CLEAR_DAY", weather: "Cerah" });
            }
        }
    }, [weather])

    return (
        <div className="min-h-screen md:h-96 mx-auto shadow-md relative md:px-4">
            <div className="min-h-screen md:h-96 flex justify-center items-center">
                <div>
                    <div className="bg-gray-950 bg-opacity-60 absolute inset-0"></div>
                    <div className="relative z-10 flex justify-center items-center">
                        <ReactAnimatedWeather
                            icon={state.icon ? state.icon : props.icon ? props.icon : 'CLEAR_DAY'}
                            color={defaults.color}
                            size={defaults.size}
                            animate={defaults.animate}
                        />
                    </div>
                    <div className="relative z-10 today-weather">
                        <h3 className="text-center text-4xl border-b border-gray-100">{state.weather ? state.weather : props.weather ? props.weather : 'Cerah'}</h3>
                        <div className="search-box flex py-2">
                            <input
                                type="text"
                                className="search-bar bg-transparent px-3 py-2 border-b border-gray-100 focus:outline-none text-gray-50"
                                placeholder="Cari kota lain ..."
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                            />
                            <button
                                className="bg-gray-100 bg-opacity-30 py-2 px-3 rounded-2xl"
                                onClick={() => search(query)}
                            >
                                <img src='icons/search.svg' alt="search" className="h-6 w-6 relative z-20" />
                            </button>
                        </div>
                        <ul className="list-inside text-gray-100 font-medium border border-gray-100 list-none">
                            {typeof weather.main !== "undefined" ? (
                                <div>
                                    <li className="cityHead flex items-center justify-center border-b border-gray-100">
                                        <p>{weather.name}, {weather.sys.country === 'ID' ? 'Indonesia' : weather.sys.country}</p>
                                        <img
                                            className="temp mx-2"
                                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                                            alt="weather icon"
                                        />
                                    </li>
                                    <li className="flex justify-between border-b border-gray-100 py-1 px-2">
                                        Temperatur{" "}
                                        <span className="temp text-lg">
                                            {Math.round(weather.main.temp)}°C ({state.weather})
                                        </span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-100 py-1 px-2">
                                        Kelembaban{" "}
                                        <span className="temp text-lg">{Math.round(weather.main.humidity)}%</span>
                                    </li>
                                    <li className="flex justify-between border-b border-gray-100 py-1 px-2">
                                        Jarak pandang{" "}
                                        <span className="temp text-lg">{Math.round(weather.visibility)} mi</span>
                                    </li>
                                    <li className="flex justify-between py-1 px-2">
                                        Kecepatan Angin{" "}
                                        <span className="temp text-lg">{Math.round(weather.wind.speed)} Km/h</span>
                                    </li>
                                </div>
                            ) : (
                                <li>
                                    {error.query} {error.message}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Forcast;
