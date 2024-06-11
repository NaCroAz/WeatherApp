const { useState, useEffect } = React;

const apiKey = '71d16f15a85fec5c4c188d747a468cfe';

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [fetchCitiesSearch, setFetchCitiesSearch] = useState([]);
    const [error, setError] = useState("");

    const cities = ['Tucuman', 'Salta', 'Catamarca', 'Santiago del Estero', 'Chaco', 'La Rioja', 'Cordoba'];

    const fetchWeather = async (cityName) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=es`);
            if (!response.ok) {
                throw new Error("Fallo de la búsqueda");
            }
            const data = await response.json();
            setWeatherData(data);
            setError('');
            await saveSearch(cityName);
            fetchRecentSearches();
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchWeatherNoSave = async (cityName) => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=es`);
        const data = await response.json();
        setWeatherData(data);
    };

    const saveSearch = async (cityName) => {
        try {
            await fetch('/api/busquedas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ciudad: cityName }),
            });
        } catch (error) {
            console.error('Error saving search:', error);
        }
    };

    const fetchRecentSearches = async () => {
        try {
            const response = await fetch('/api/busquedas');
            const data = await response.json();
            setFetchCitiesSearch(data.map(search => search.ciudad));
        } catch (error) {
            console.error('Error fetching recent searches:', error);
        }
    };

    useEffect(() => {
        fetchWeather('');
        fetchRecentSearches();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (city) {
            fetchWeather(city.charAt(0).toUpperCase() + city.slice(1));
        }
    };

    return (
        <div className="conteinerGrandDad">
            {/* Parte del Clima */}
            <div>
                {weatherData && (
                    <div className="panelClima">
                        <h2>{weatherData.name}</h2>
                        <div className="icono">
                            <img src={`/iconos/${weatherData.weather[0].icon}.svg`} alt="weather icon" />
                        </div>
                        <div className="infoWeather">
                            <h1>{weatherData.main.temp.toFixed(1)} °C</h1>
                            <div className="temperaturaMinMax">
                                <p><img src={`/weather/thermometer-colder.svg`} alt="thermometer-colder" />{weatherData.main.temp_min.toFixed(1)} °C</p>
                                <p>-</p>
                                <p><img src={`/weather/thermometer-warmer.svg`} alt="thermometer-warmer" />{weatherData.main.temp_max.toFixed(1)} °C</p>
                            </div>
                        </div>
                        <div className="infoWeatherBelow">
                            <div className="infoWeatherBelowCards">
                                <img src={weatherData.wind.speed.toFixed(0) === 0 ?
                                    `/beaufort/wind-beaufort-${weatherData.wind.speed.toFixed(0)}.svg` :
                                    `/beaufort/wind-beaufort-${weatherData.wind.speed.toFixed(0) - 1}.svg`}
                                    alt="beaufort icon" />
                                <p>{weatherData.wind.speed} Km.</p>
                            </div>
                            <div className="infoWeatherBelowCards">
                                <p>Humedad: {weatherData.main.humidity}</p>
                                <img src={`/weather/humidity.svg`} alt="humidity icon" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Parte de las búsquedas regionales o recientes */}
            <div>
                <form onSubmit={handleSearch}>
                    <input
                        type="search"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Buscar una ciudad o país"
                        aria-label="Search"
                    />
                </form>
                <div className="cabecera">
                    <h1>Algunas Búsquedas Regionales</h1>
                    <div>
                        {cities.map((cityName) => (
                            <button key={cityName} onClick={() => fetchWeather(cityName)}>
                                {cityName}
                            </button>
                        ))}
                    </div>
                    <h1>Búsquedas Recientes</h1>
                    <div>
                        {fetchCitiesSearch.map((cityName, index) => (
                            <button key={index} onClick={() => fetchWeatherNoSave(cityName)}>
                                {cityName}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(<WeatherApp />, document.getElementById('root'));
