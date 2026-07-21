import {
    get_location,
    locationDefault,
    geolocator,
} from "../models/locationModel.js";

import {
    renderMap,
    pointer,
    pointerTarget,
    updateMapPosition,
    destroyMapInstance,
} from "../components/mapComponent/mapView.js";

const state = {
    map: null,
    currentMarker: null,
    targetMarker: null,
    watchId: null,
};

const TRACKING_OPTIONS = {
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: 10000,
};

// Inicializa el mapa con la ubicación actual del usuario o una ubicación predeterminada
export async function initMap(containerId = "map") {
    cleanupMap()
    let coords = locationDefault;

    try {
        const { lon, lat } = await get_location();
        coords = [lon, lat];
    } catch (error) {
        console.error(error);
    }

    state.map = renderMap(coords, containerId);
    state.currentMarker = pointer(state.map, coords);

    // Observer para forzar la actualización del canvas cuando la pantalla o la pestaña cambia
    const mapDiv = document.getElementById(containerId);
    if (mapDiv) {
        const resizeObserver = new ResizeObserver(() => {
            if (state.map) {
                state.map.resize();
            }
        });
        resizeObserver.observe(mapDiv);
        // Guardamos el observer si queremos limpiarlo después (opcional, pero buena práctica)
        state.resizeObserver = resizeObserver;
    }

    state.map.doubleClickZoom.disable();

    state.map.on("dblclick", ({ lngLat }) => {
        moveToSearchedLocation(lngLat.lng, lngLat.lat);
    });
}

// Actualiza la posición del marcador y centra el mapa en la nueva ubicación
export function startRealTimeTracking() {
    if (!geolocator) return;

    if (state.watchId !== null) {
        geolocator.clearWatch(state.watchId);
    }

    state.watchId = geolocator.watchPosition(
        ({ coords }) => {
            if (!state.map || !state.currentMarker) return;

            updateMapPosition(
                state.map,
                state.currentMarker,
                [coords.longitude, coords.latitude]
            );
        },
        ({ message }) => {
            console.error(
                "Error leyendo el movimiento en tiempo real:",
                message
            );
        },
        TRACKING_OPTIONS
    );
}

// Detiene el seguimiento en tiempo real y limpia los recursos del mapa
export function cleanupMap() {
    if (state.watchId !== null && geolocator) {
        geolocator.clearWatch(state.watchId);
        state.watchId = null;
    }

    if (state.targetMarker) {
        state.targetMarker.remove();
        state.targetMarker = null;
    }

    destroyMapInstance(state.map, state.currentMarker);

    if (state.resizeObserver) {
        state.resizeObserver.disconnect();
        state.resizeObserver = null;
    }

    state.map = null;
    state.currentMarker = null;

    console.log("Sistema de mapas y GPS apagado y limpiado completamente.");
}

// Mueve el mapa a la ubicación buscada y coloca un marcador rojo en esa posición
export function moveToSearchedLocation(lon, lat) {
    if (!state.map) {
        console.warn("El mapa aún no está listo para moverse.");
        return;
    }

    const coords = [lon, lat];

    if (!state.targetMarker) {
        state.targetMarker = pointerTarget(state.map, coords);
    }

    updateMapPosition(state.map, state.targetMarker, coords);
}

// Devuelve la ubicación del marcador rojo si existe, de lo contrario devuelve null
export function getTargetLocation() {
    if (!state.targetMarker) return null;

    const { lng, lat } = state.targetMarker.getLngLat();

    return {
        lon: lng,
        lat,
    };
}

export function getMap(){
    return state.map;
}