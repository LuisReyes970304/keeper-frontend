import { Map, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

const createMarker = (map, location, options = {}) =>
    new Marker(options)
        .setLngLat(location)
        .addTo(map);

export const renderMap = (location, containerId = "map") =>
    new Map({
        style: MAP_STYLE,
        center: location,
        zoom: 16,
        container: containerId,
    });

export const pointer = (map, location) =>
    createMarker(map, location);

export const pointerTarget = (map, location) =>
    createMarker(map, location, {
        color: "#ef4444",
    });

export const updateMapPosition = (map, marker, location) => {
    marker.setLngLat(location);

    map.flyTo({
        center: location,
        speed: 1.2,
    });
};

export const createReportMarker = (map, location, element, popupHtml) => {
    const popup = new Popup({ offset: 15, closeButton: false })
        .setHTML(popupHtml);
    return new Marker({ element })
        .setLngLat(location)
        .setPopup(popup)
        .addTo(map);
};

export const destroyMapInstance = (map, marker) => {
    marker?.remove();
    map?.remove();
};

