import { locService } from './loc.service.js'

export const mapService = {
  initMap,
  addMarker,
  panTo,
}

// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap')
  return _connectGoogleApi().then(() => {
    console.log('google available')
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })
    console.log('Map!', gMap)

    let infoWindow = new google.maps.InfoWindow({
      position: { lat, lng },
    })

    infoWindow.open(gMap)

    gMap.addListener('click', (ev) => {
      const lat = ev.latLng.lat()
      const lng = ev.latLng.lng()
      infoWindow = new google.maps.InfoWindow({
        position: ev.latLng,
      })
      console.log(JSON.stringify(_getGeoLocationApi(lat, lng), null, 2))
        infoWindow.setContent(_getGeoLocationApi(lat, lng))
      infoWindow.open(gMap)
    })
  })
}

function renderMarkers() {
  let locs = locService.getLocs()
  console.log(`give me pos ${locs[0].position}`)
  locs.forEach((loc) => {
    var marker = new google.maps.Marker({
      position: loc.position,
      map: gMap,
      title: loc.name,
    })
  })
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = 'AIzaSyB9MyL0ZCqbXp1l4x0XnTRj-8ihybmUFCY'
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

function _getGeoLocationApi(lat, lng) {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyB9MyL0ZCqbXp1l4x0XnTRj-8ihybmUFCY
    `
  return axios
    .get(URL)
    .then((res) => res)
    .then((res) => res.data.results[0].formatted_address)
}
