import { locService } from "./services/loc.service.js";
import { mapService } from "./services/map.service.js";
export const controller = {
    onGetLocs,
};

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onCenter = onCenter;
window.onDeleteLoc = onDeleteLoc;
window.onSearch = onSearch;
window.onCopyLink = onCopyLink;

function onInit() {
    let position = centerByQueryStringParams();
    mapService.initMap(position?.lat, position?.lng);
    onGetLocs();
}

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker() {
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onSearch(value) {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyB9MyL0ZCqbXp1l4x0XnTRj-8ihybmUFCY`;
    return axios
        .get(URL)
        .then()
        .then((res) => mapService.panTo(res.data.results[0].geometry.location));
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        let strHTMLs = locs.map(({ name, ts, id }) => {
            let minute = new Date(ts).getMinutes();
            let hour = new Date(ts).getHours();
            let date = new Date(ts).getDate();
            let month = new Date(ts).getMonth();
            let year = new Date(ts).getFullYear();
            return `
            <article class="location-preview">
                <div class="location-text">    
                    <h1>${name}</h1>
                    <h2>${date}/${month}/${year}, ${hour}:${minute}</h2>
                </div>
                <div class="location-buttons">   
                    <button onclick="onCenter('${id}')">Center</button>
                    <button onclick="onDeleteLoc('${id}')">Delete</button>
                    <button onclick="onCopyLink('${id}')">Copy link</button>
                </div>
            </article>`;
        });
        document.querySelector(".location-list").innerHTML = strHTMLs.join("");
    });
}

function onGetUserPos() {
    getPosition()
        .then(({ coords }) => {
            console.log("User position is:", coords);
            //prettier-ignore
            // document.querySelector(".user-pos").innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
            mapService.panTo({lat: coords.latitude,lng: coords.longitude});
        })
        .catch((err) => {
            console.log("err!!!", err);
        });
}

function onCopyLink(id) {
    let { position } = locService.getLocById(id);
    const queryStringParams = `?lat=${position.lat}&lng=${position.lng}`;
    const newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        queryStringParams;
    // window.history.pushState({ path: newUrl }, "", newUrl);
    navigator.clipboard.writeText(newUrl);
    console.log(newUrl);
}

function onPanTo() {
    console.log("Panning the Map");
    mapService.panTo({ lat: 35.6895, lng: 139.6917 });
}

function onCenter(id) {
    let loc = locService.getLocById(id);
    console.log(loc);
    mapService.panTo(loc.position);
}

function onDeleteLoc(id) {
    locService.deleteLoc(id);
    onGetLocs();
}

function centerByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search);
    const position = {
        lat: +queryStringParams.get("lat") || 0,
        lng: +queryStringParams.get("lng") || 0,
    };

    if (!position.lat && !position.lng) return;

    return position;
}
