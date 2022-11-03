import { locService } from "./loc.service.js";

export const mapService = {
    initMap,
    addMarker,
    panTo,
};

// Var that is used throughout this Module (not global)
var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi().then(() => {
        gMap = new google.maps.Map(document.querySelector("#map"), {
            center: { lat, lng },
            zoom: 15,
        });

        //prettier-ignore
        locService.getLocs().then((data) =>data.forEach(({ position }) => addMarker(position)));
        return gMap;
    });
}

function addMarker(position) {
    var marker = new google.maps.Marker({
        position,
        map: gMap,
        title: "Hello World!",
    });
    return marker;
}

function panTo({ lat, lng }) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve();
    const API_KEY = "AIzaSyB9MyL0ZCqbXp1l4x0XnTRj-8ihybmUFCY";
    var elGoogleApi = document.createElement("script");
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject("Google script failed to load");
    });
}
