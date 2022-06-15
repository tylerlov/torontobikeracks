const campground = require("../../models/campground");

    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: campground.geometry.coordinates,
        zoom: 8 // starting zoom
    });

    new mapboxgl.Marker().setLngLat(75,40).addTo(map)