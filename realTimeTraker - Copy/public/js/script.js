const socket = io(); // Initializing socket.io client

if (navigator.geolocation) {
    // Checking if Geolocation is supported by the browser
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Sending the latitude and longitude to the server
        socket.emit('send-location', { latitude, longitude });
    }, (error) => {
        // Handling any errors while getting location
        console.error('Error getting location:', error);
    }, {
        enableHighAccuracy: true, // Enabling high accuracy mode
        timeout: 5000, // Timeout after 5 seconds
        maximumAge: 0, // No cache for location
    });
} else {
    // Geolocation is not supported by this browser
    console.log('Geolocation is not supported by this browser.');
}

// Initializing the map
const map = L.map("map").setView([0, 0], 10); // Setting initial view to coordinates [0, 0] with zoom level 10
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "shital karek project" // Attribution text for the map tiles
}).addTo(map); // Adding the tile layer to the map

// Object to store markers
const markers = {};

// Handling incoming location data
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data; // Extracting ID, latitude, and longitude from the received data

    // Optionally, center the map on the new position
    map.setView([latitude, longitude], 10);
    
    if (markers[id]) {
        // If a marker already exists for this ID, update its position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // If no marker exists for this ID, create a new marker
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Handling user disconnection
socket.on("user-disconnected", ({ id }) => {
    if (markers[id]) {
        // If a marker exists for the disconnected user, remove it from the map
        map.removeLayer(markers[id]);
        delete markers[id]; // Remove the marker from the markers object
    }
});
