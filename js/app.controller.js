import { locService } from "./services/loc.service.js";
import { mapService } from "./services/map.service.js";

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
    mapService
        .initMap()
        .then(() => {
            console.log("Map is ready");
        })
        .catch(() => console.log("Error: cannot init map"));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log("Getting Pos");
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker() {
    console.log("Adding a marker");
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        console.log("Locations:", locs);
        let strHTMLs = locs.map(({ name, ts, id }) => {
            let minute = new Date(ts).getMinutes();
            let hour = new Date(ts).getHours();
            let date = new Date(ts).getDate();
            let month = new Date(ts).getMonth();
            let year = new Date(ts).getFullYear();
            return `<article class="location-preview">
            <div class="location-text">    
                <h1>${name}</h1>
                <h2>${date}/${month}/${year}, ${hour}:${minute}</h2>
            </div>
            <div class="location-buttons">   
                <button onclick="onCenter('${id}')"><i class="fa fa-location-arrow"></i></button>
                <button onclick="onDeleteLocation('${id}')"><i class="fa fa-trash"></i></button>
            </div>
        </article>`;
        });
        document.querySelector(".location-list").innerText = strHTMLs;
    });
}

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            console.log("User position is:", pos.coords);
            document.querySelector(
                ".user-pos"
            ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
        })
        .catch((err) => {
            console.log("err!!!", err);
        });
}

function onPanTo() {
    console.log("Panning the Map");
    mapService.panTo(35.6895, 139.6917);
}
