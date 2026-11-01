document.addEventListener("DOMContentLoaded", function () {

    const map = L.map("map").setView(
        [-26.2041, 28.0473],
        13
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    L.marker([-26.2041, 28.0473])
        .addTo(map)
        .bindPopup("SaveMore Supermarket")
        .openPopup();
});