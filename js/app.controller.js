import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
export const controller = {
  onGetLocs,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onCenter = onCenter
window.onDeleteLoc = onDeleteLoc
window.onSearch = onSearch

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
    })
    .catch(() => console.log('Error: cannot init map'))
  onGetLocs()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onSearch(value) {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyB9MyL0ZCqbXp1l4x0XnTRj-8ihybmUFCY`
  return axios
    .get(URL)
    .then((res) => res)
    .then((res) => mapService.panTo(res.data.results[0].geometry.location))
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs)
    let strHTMLs = locs.map(({ name, ts, id }) => {
      let minute = new Date(ts).getMinutes()
      console.log(minute)
      let hour = new Date(ts).getHours()
      let date = new Date(ts).getDate()
      let month = new Date(ts).getMonth()
      let year = new Date(ts).getFullYear()
      return `<article class="location-preview">
            <div class="location-text">    
                <h1>${name}</h1>
                <h2>${date}/${month}/${year}, ${hour}:${minute}</h2>
            </div>
            <div class="location-buttons">   
                <button onclick="onCenter('${id}')">Center</button>
                <button onclick="onDeleteLoc('${id}')">Delete</button>
            </div>
        </article>`
    })
    document.querySelector('.location-list').innerHTML = strHTMLs.join('')
  })
}

function onGetUserPos() {
  getPosition()
    .then(({ coords }) => {
      console.log('User position is:', coords)
      //prettier-ignore
      // document.querySelector(".user-pos").innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
      mapService.panTo({lat: coords.latitude,lng: coords.longitude});
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}

function onPanTo() {
  console.log('Panning the Map')
  mapService.panTo({ lat: 35.6895, lng: 139.6917 })
}

function onCenter(id) {
  let loc = locService.getLocById(id)
  console.log(loc)
  mapService.panTo(loc.position)
}

function onDeleteLoc(id) {
  locService.deleteLoc(id)
  onGetLocs()
}
