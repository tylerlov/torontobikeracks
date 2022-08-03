mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: bikerack.geometry.coordinates, // starting position [lng, lat]
    zoom: 15 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(bikerack.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h2>${bikerack.title}</h2>
                <h4>${bikerack.location}</h4>`
            )
    )
    .addTo(map)

