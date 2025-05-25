// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Load cities data
const citiesByState = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf-8'));

app.get('/api/states', (req, res) => {
	const states = Object.keys(citiesByState);
	const sortedStates = states.sort();
	res.json({ states: sortedStates });
});

// Route to get cities by state name
app.get('/api/cities', (req, res) => {
	const state = req.query.state;
	if (!state) {
		return res.status(400).json({ error: 'State query parameter is required' });
	}

	const cities = citiesByState[state];
	if (!cities) {
		return res.status(404).json({ error: `No cities found for state: ${state}` });
	}

	res.json({ state, cities });
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
