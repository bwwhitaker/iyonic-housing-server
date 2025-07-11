const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const aduCalculator = require('./Routes/ADUCalculator');

// Enable CORS and JSON body parsing
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); // <- Needed for parsing POST JSON bodies

// Landing Page
app.get('/', (req, res) => {
	res.send('Welcome to the Iyonic Housing API.');
});

// Load cities data
const citiesByState = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf-8'));

app.get('/api/states', (req, res) => {
	const states = Object.keys(citiesByState);
	const sortedStates = states.sort();
	res.json({ states: sortedStates });
});

app.get('/api/cities', (req, res) => {
	const state = req.query.state;
	if (!state) {
		return res.status(400).json({ error: 'State query parameter is required' });
	}

	const cities = citiesByState[state];
	if (!cities) {
		return res.status(404).json({ error: `No cities found for state: ${state}` });
	}
	const sortedCities = cities.sort();

	res.json({ cities: sortedCities });
});

app.get('/api/statePrices', (req, res) => {});

// Mount calculator API
app.use('/api/aduCalculator', aduCalculator);
app.use('/api/aduCalculator/prices', aduCalculator);
app.use('/api/aduCalculator/pricesByState', aduCalculator);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
