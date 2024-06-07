import React, { useState, useEffect } from 'react';
import apiKeys from './ApiKeys';
import Clock from 'react-live-clock';
import Forcast from './Forcast';
import ReactAnimatedWeather from 'react-animated-weather';

const dateBuilder = (d) => {
    let months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];

    let days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
    color: "white",
    size: 112,
    animate: true,
};

const WeatherIcon = ({ icon, color, size, animate }) => {
    color = color || "white";
    size = size || 112;
    animate = animate || true;

    return <ReactAnimatedWeather icon={icon} color={color} size={size} animate={animate} />;
};

const Weather = () => {
    const [state, setState] = useState({
        lat: undefined,
        lon: undefined,
        errorMessage: undefined,
        temperatureC: undefined,
        temperatureF: undefined,
        city: undefined,
        country: undefined,
        humidity: undefined,
        description: undefined,
        icon: 'CLEAR_DAY',
        weather: 'Cerah',
        sunrise: undefined,
        sunset: undefined,
        errorMsg: undefined,
    });

    useEffect(() => {
        const getPosition = () => {
            return new Promise(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        };

        const getWeather = async (lat, lon) => {
            try {
                const api_call = await fetch(
                    `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
                );
                const data = await api_call.json();
                setState(prevState => ({
                    ...prevState,
                    lat: lat,
                    lon: lon,
                    city: data.name,
                    temperatureC: Math.round(data.main.temp),
                    temperatureF: Math.round(data.main.temp * 1.8 + 32),
                    humidity: data.main.humidity,
                    main: data.weather[0].main,
                    country: data.sys.country,
                }));

                switch (data.weather[0].main) {
                    case "Haze":
                        setState(prevState => ({ ...prevState, icon: "CLEAR_DAY", weather: "Cerah" }));
                        break;
                    case "Clouds":
                        setState(prevState => ({ ...prevState, icon: "CLOUDY", weather: "Berawan" }));
                        break;
                    case "Rain":
                        setState(prevState => ({ ...prevState, icon: "RAIN", weather: "Hujan" }));
                        break;
                    case "Snow":
                        setState(prevState => ({ ...prevState, icon: "SNOW", weather: "Salju" }));
                        break;
                    case "Dust":
                        setState(prevState => ({ ...prevState, icon: "WIND", weather: "Debu" }));
                        break;
                    case "Drizzle":
                        setState(prevState => ({ ...prevState, icon: "SLEET", weather: "Gerimis" }));
                        break;
                    case "Fog":
                        setState(prevState => ({ ...prevState, icon: "FOG", weather: "Kabut" }));
                        break;
                    case "Smoke":
                        setState(prevState => ({ ...prevState, icon: "FOG", weather: "Asap" }));
                        break;
                    case "Tornado":
                        setState(prevState => ({ ...prevState, icon: "WIND", weather: "Tornado" }));
                        break;
                    default:
                        setState(prevState => ({ ...prevState, icon: "CLEAR_DAY", weather: "Cerah" }));
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
                setState(prevState => ({ ...prevState, errorMsg: "Error fetching weather data" }));
            }
        };

        if (navigator.geolocation) {
            getPosition()
                .then((position) => {
                    getWeather(position.coords.latitude, position.coords.longitude);
                })
                .catch((err) => {
                    console.error("Error getting location:", err);
                    getWeather(28.67, 77.22);
                    alert(
                        "Anda telah menonaktifkan layanan lokasi. Izinkan 'Aplikasi Ini' untuk mengakses lokasi Anda. Lokasi Anda saat ini akan digunakan untuk menghitung cuaca waktu nyata."
                    );
                });
        } else {
            alert('Geolocation not available');
        }

        const timerID = setInterval(
            () => getWeather(state.lat, state.lon),
            600000
        );

        return () => {
            clearInterval(timerID);
        };
    }, [state.lat, state.lon]);

    return state.temperatureC ?
        (
            <React.Fragment>
                <div className="flex justify-center items-center md:h-1/2">
                    <div className="w-screen md:w-1/2 flex justify-center items-center">
                        <div className="w-screen md:w-auto m-0 text-white rounded shadow-md block md:flex items-center justify-between">

                            <div className="py-8 background-city w-full md:w-96 min-h-screen md:h-72 flex flex-col justify-between relative">
                                <div className="bg-gray-950 bg-opacity-30 inset-0 absolute"></div>
                                <div className="relative z-10 flex justify-between pt-24 md:pt-4 p-4">
                                    <div>
                                        <WeatherIcon
                                            icon={state.icon ? state.icon : 'CLEAR_DAY'}
                                            color={defaults.color}
                                            size={defaults.size}
                                            animate={defaults.animate}
                                        />
                                        <h3 className="text-center text-4xl text-gray-50">{state.weather}</h3>
                                    </div>
                                    <div className="title text-right">
                                        <h2 className="text-2xl font-bold">{state.city}</h2>
                                        <h3 className="text-xl font-bold">{state.country === 'ID' ? 'Indonesia' : state.country}</h3>
                                    </div>
                                </div>
                                <div className="relative z-10 flex justify-between items-center pb-24 md:pb-4 p-4">
                                    <div className="date-time">
                                        <div className="current-time text-2xl">
                                            <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                                        </div>
                                        <div className="dmy">
                                            <div id="txt"></div>
                                            <div className="current-date text-xl">{dateBuilder(new Date())}</div>
                                        </div>
                                    </div>
                                    <div className="temperature flex justify-center">
                                        <p className="text-6xl">
                                            {state.temperatureC}°<span className="text-4xl">C</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Forcast icon={state.icon} weather={state.weather} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        ) : (
            <React.Fragment>
                <div className="min-h-svh flex items-center justify-center">
                    <div className="block md:flex justify-evenly items-center relative min-h-svh md:min-h-72">
                        <div className="bg-gray-950 bg-opacity-60 rounded-md absolute inset-0"></div>
                        <div className="flex justify-center items-center">
                            <img src="images/WeatherIcons.gif" className="relative z-10 w-72 h-72" alt="loader" />
                        </div>
                        <div className="relative z-10 md:pb-0 pb-16 px-4">
                            <h3 className="text-white text-center font-bold text-2xl mt-4">Detecting your location</h3>
                            <h3 className="text-white text-center mt-2">
                                Your current location will be displayed on the App <br /> & used for calculating Real time weather.
                            </h3>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
}


export default Weather;