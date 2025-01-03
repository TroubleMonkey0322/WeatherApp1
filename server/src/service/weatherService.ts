import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
    latitude: number;   
    longitude: number;  
}

// Define a class for the Weather object
class Weather {
    constructor(
        public temperature: number,
        public humidity: number,
        public windSpeed: number,
        public description: string
    ) {}
}

// Complete the WeatherService class
class WeatherService {
    private baseWeatherURL: string;
    private apiKey: string;
    private cityName: string;

    constructor(apiKey: string, cityName: string) {
        this.baseWeatherURL = 'https://api.openweathermap.org/data/2.5/weather';
        this.apiKey = apiKey; 
        this.cityName = cityName;
    }

    // Create fetchLocationData method
    async fetchLocationData(query: string): Promise<Coordinates> {
        try {
            const response = await axios.get(`${this.baseWeatherURL}?q=${this.cityName}&appid=${this.apiKey}`);
            const data = response.data;

            const coordinates: Coordinates = {
                latitude: data.coord.lat,
                longitude: data.coord.lon
            };

            return coordinates;
        } catch (error) {
            console.error('Error fetching location data:', error);
            throw new Error('Could not fetch location data.');
        }
    }

    // Create destructureLocationData method
    private destructureLocationData(data: any): Coordinates {
        const { coord: { lat: latitude, lon: longitude } } = data; 
        return { latitude, longitude }; 
    }

    // Create buildGeocodeQuery method
    private buildGeocodeQuery(): string {
        return `${this.baseWeatherURL}?q=${encodeURIComponent(this.cityName)}&appid=${this.apiKey}`;
    }

    // Create buildWeatherQuery method
    private buildWeatherQuery(coordinates: Coordinates): string {
        return `${this.baseWeatherURL}?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric`;
    }

    // Create fetchAndDestructureLocationData method
    private async fetchAndDestructureLocationData(): Promise<Coordinates> {
        try {
            const response = await axios.get(this.buildGeocodeQuery()); 
            return this.destructureLocationData(response.data);
        } catch (error) {
            console.error('Error fetching location data:', error);
            throw new Error('Could not fetch location data.');
        }
    }

    // Create fetchWeatherData method
    private async fetchWeatherData(coordinates: Coordinates): Promise<Weather> {
        const response = await axios.get(this.buildWeatherQuery(coordinates)); 
        return this.parseCurrentWeather(response.data);
    }

    private async fetchForecast(coordinates: Coordinates) {
      const response = await axios.get(this.buildWeatherQuery(coordinates));
      return this.parseCurrentWeather(response.data);
    }

    // Build parseCurrentWeather method
    private parseCurrentWeather(data: any): Weather {
        return new Weather(
            data.main.temp,         
            data.main.humidity,     
            data.wind.speed,        
            data.weather[0].description 
        );
    }

    // Complete get
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map(item => new Weather(
        item.main.temp,         
        item.main.humidity,    
        item.wind.speed,       
        item.weather[0].description 
    ));
}

// Complete getWeatherForCity method
async getWeatherForCity(city: string) {
    try {
        const coordinates = await this.fetchAndDestructureLocationData(); 
        const currentWeather = await this.fetchWeatherData(coordinates); 
        const forecastData = await this.fetchForecast(coordinates); 
        const forecast = this.buildForecastArray(forecastData); 

        return {
            currentWeather,
            forecast
        };
    } catch (error) {
        console.error('Error getting weather for city:', error);
        throw new Error('Could not get weather for city.');
    }
}}