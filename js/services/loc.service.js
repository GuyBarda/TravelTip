export const locService = {
    getLocs,
    createLoc,
    createLocs,
};

const locs = [
    { name: "Greatplace", lat: 32.047104, lng: 34.832384 },
    { name: "Neveragain", lat: 32.047201, lng: 34.832581 },
];

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000);
    });
}

function createLocs() {
    gLocations = loadFromStorage(locationsKey) || _getDemoLocations();
}

function createLoc(position, name) {
    return {
        id: makeId(),
        position,
        name,
        ts: Date.now(),
    };
}

function _getDemoLocations() {
    return [
        createLocation(
            { lat: 31.78309673299283, lng: 34.628768380562775 },
            "My Home"
        ),
    ];
}
