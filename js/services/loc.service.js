import { utility } from "../utility.js";
import { storageService } from "../storage-service.js";

export const locService = {
    getLocs,
    createLoc,
    getLocById,
    deleteLoc,
    addLoc,
};

const STORAGE_KEY = "locDB";
let locs = storageService.load(STORAGE_KEY) || getDemoLocations();

function getLocs() {
    return new Promise((resolve) => setTimeout(() => resolve(locs), 1000));
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
    const location = createLoc(position, name);
    locs.unshift(location);
    storageService.save(STORAGE_KEY, locs);
}

function deleteLoc(locId) {
    locs = locs.filter((loc) => loc.id !== locId);
    storageService.save(STORAGE_KEY, locs);
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
