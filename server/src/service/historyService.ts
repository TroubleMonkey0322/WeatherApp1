const fs = require('fs');
const path = require('path');

// TODO: Define a City class with name and id properties
class City {
  private id: string;
  private name: string
  constructor(id, name) {
      this.id = id;      
      this.name = name;  
  }

  // Method to display city information
  displayInfo() {
      return `City ID: ${this.id}, City Name: ${this.name}`;
  }
}

// TODO: Complete the HistoryService class

class HistoryService {
  private historyFilePath: string;
  constructor() {
          this.historyFilePath = path.join(__dirname, 'searchHistory.json');
  }

  // Load history from the JSON file
  loadHistory() {
      if (fs.existsSync(this.historyFilePath)) {
          const data = fs.readFileSync(this.historyFilePath, 'utf8');
          return JSON.parse(data);
      }
      return [];
  }

  // Define a read method that reads from the searchHistory.json file
  async read() {
      return this.loadHistory(); // Reusing loadHistory for simplicity
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
      async write(cities) {
      if (!Array.isArray(cities)) {
          throw new Error('The provided data is not an array.');
      }
      fs.writeFileSync(this.historyFilePath, JSON.stringify(cities, null, 2));
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
      const history = await this.read();
      return history.map(item => new City(item.id, item.name));
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city) {
      const cities = await this.getCities();
      cities.push(city);
      await this.write(cities);
  }

  // BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id) {
      let history = await this.loadHistory();
      // Filter out the city with the specified id
      history = history.filter(item => item.id !== id);
      await this.write(history);
  }
}

export default new HistoryService();
