import { Router } from 'express';
import axios from 'axios';
const router = Router();
const fs = require('fs');


import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  const { cityName } = req.body; 
  const apiKey = '44d2d0805e94aab8779421a723061684'; 
},
  // TODO: GET weather data from city name
  router.get('/api/weather/:city', async (req, res) => {
    const cityName = req.params.city;
    const apiKey = '44d2d0805e94aab8779421a723061684'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(url);
      res.json(response.data); 
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching weather data' });
  }
});
  // TODO: save city to search history
});
router.post('/api/weather/history', (req, res) => {
  const newCity = req.body.city; 
  fs.readFile('searchHistory.json', 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ error: 'Error reading search history' });
      }

      const history = JSON.parse(data);
      
      if (!history.includes(newCity)) {
          history.push(newCity); 
      }

      fs.writeFile('searchHistory.json', JSON.stringify(history), (err) => {
          if (err) {
              return res.status(500).json({ error: 'Error saving to search history' });
          }
          res.json(history); // Return the updated history
      });
  });
});

// TODO: GET search history
router.get('/history', async (req, res) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
