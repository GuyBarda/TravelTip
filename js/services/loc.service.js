import { utility } from "../utility.js";

export const locService = {
    getLocs,
    createLoc,
    createLocs,
    getLocById,
    deleteLoc,
    addLoc,
};

let locs = getDemoLocations();

function getLocs() {
    return new Promise((resolve, reject) =>
        setTimeout(() => resolve(locs), 1000)
    );
}

function createLocs() {
    // locs = loadFromStorage(locationsKey) || getDemoLocations();
}

function createLoc(position, name) {
    return {
        id: utility.makeId(),
        position,
        name,
        ts: Date.now(),
    };
}

function getLocById(locId) {
    return locs.find((loc) => loc.id === locId);
}

function addLoc(position, name) {
    const location = createLocation(position, name);
    locs.push(location);
}

function deleteLoc(locId) {
    locs = locs.filter((loc) => loc.id !== locId);
    console.log(locs);
}

function getDemoLocations() {
    return [
        createLoc(
            { lat: 31.78309673299283, lng: 34.628768380562775 },
            "GreatPlace"
        ),
        createLoc(
            { lat: 31.78309673299283, lng: 34.628768380562775 },
            "NeverAgain"
        ),
    ];
}
