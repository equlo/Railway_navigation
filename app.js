// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { getShortestPath } = require('./graph');

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/railway_navigation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Facility Schema
const Facility = mongoose.model('Facility', new mongoose.Schema({
  facility_id: String,
  name: String,
  coordinates: Array,
  description: String,
}));

// Path Schema
const Path = mongoose.model('Path', new mongoose.Schema({
  start: String,
  end: String,
  distance: Number,
  path_coordinates: Array,
}));

// Get all facilities
app.get('/facilities', async (req, res) => {
  const facilities = await Facility.find({});
  res.json(facilities);
});

// Calculate shortest path
app.post('/shortest-path', async (req, res) => {
  const { start, end } = req.body;
  const graph = await generateGraph();
  const { path, distance } = getShortestPath(graph, start, end);
  res.json({ path, distance });
});

// Generate graph from database
async function generateGraph() {
  const paths = await Path.find({});
  const graph = {};
  
  paths.forEach(path => {
    if (!graph[path.start]) graph[path.start] = {};
    graph[path.start][path.end] = path.distance;
  });
  
  return graph;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
