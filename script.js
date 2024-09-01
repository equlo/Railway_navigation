// frontend/script.js

let map = L.map('map').setView([22.5726, 88.3639], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markers = {};

function addMarker(facility) {
  const marker = L.marker(facility.coordinates).bindPopup(facility.name).addTo(map);
  markers[facility.facility_id] = marker;
}

function loadFacilities() {
  fetch('/facilities')
    .then(response => response.json())
    .then(data => {
      data.forEach(addMarker);
    })
    .catch(error => console.error('Error fetching facilities:', error));
}

function findPath() {
  const start = document.getElementById('start').value;
  const end = document.getElementById('destination').value;

  fetch('/shortest-path', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ start, end })
  })
  .then(response => response.json())
  .then(data => {
    const { path, distance } = data;
    displayPath(path);
    document.getElementById('path').innerText = `Distance: ${distance} meters`;
    speakDistance(distance);
  })
  .catch(error => console.error('Error:', error));
}

function displayPath(path) {
  map.eachLayer(layer => {
    if (layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });

  const latlngs = path.map(location => markers[location].getLatLng());

  if (latlngs.length > 1) {
    const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);
    map.fitBounds(polyline.getBounds());
  }
}

function speakDistance(distance) {
  const message = `The distance to your destination is ${distance} meters.`;
  const speech = new SpeechSynthesisUtterance(message);
  window.speechSynthesis.speak(speech);
}

loadFacilities();
