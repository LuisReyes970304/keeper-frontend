import {
    initMap,
    getMap,
    startRealTimeTracking,
} from "./mapManager.controller";
import { createReportMarker } from "../components/mapComponent/mapView.js";
import { formatearFechaHumana } from "../utils/helpers.js";

let map = null;
export let mapMarkers = [];

export async function inicializarMapaVea(reportes, containerId = "map") {
    await initMap(containerId);
    actualizarMarcadoresEnMapa(reportes);
}

export function actualizarMarcadoresEnMapa(reportes) {
    const map = getMap();

    if (!map) return;

    mapMarkers.forEach((m) => m.remove());
    mapMarkers = [];

    reportes.forEach((rep) => {
        if (!rep.lat || !rep.lng) return;

        let colorClase = "bg-red-500"; // Rojo por defecto como pidió el usuario
        
        if (rep.tipo === "Robo" || rep.tipo === "Vandalismo") colorClase = "bg-red-700";
        else if (rep.tipo === "Altercado") colorClase = "bg-orange-600";
        else if (rep.tipo === "Incendio") colorClase = "bg-[#dc2626]"; // bg-red-600
        else if (rep.tipo && rep.tipo.includes("SOS")) colorClase = "bg-red-600 animate-pulse";
        else if (rep.tipo === "Accidente Tránsito") colorClase = "bg-yellow-500";
        else if (rep.tipo === "Urgencia Médica" || rep.tipo === "Solicitar Ambulancia") colorClase = "bg-emerald-500";
        else colorClase = "bg-red-500"; // Fallback siempre rojo

        const el = document.createElement("div");
        el.className = `w-6 h-6 rounded-full ${colorClase} border-2 border-white flex items-center justify-center shadow cursor-pointer`;
        el.style.width = "26px";
        el.style.height = "26px";
        el.innerHTML =
            '<span class="w-1.5 h-1.5 bg-white rounded-full"></span>';

        const popupHtml = `
            <div class="p-1 font-sans rounded text-zinc-900" style="min-width: 190px;">
                <div class="flex items-center justify-between border-b border-zinc-150 pb-1.5 mb-1.5">
                    <span class="font-bold text-xs uppercase text-[#ff5d00]">${rep.tipo}</span>
                    ${rep.gravedad ? `<span class="text-[9px] bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded font-mono font-bold">${rep.gravedad}</span>` : ""}
                </div>
                <p class="text-xs text-zinc-700 leading-tight mb-2 font-medium">${rep.descripcion}</p>
                <div class="text-[9px] text-zinc-400 font-mono space-y-0.5">
                    <div>Dir: ${rep.ubicacion} ${rep.barrio ? `(B. ${rep.barrio})` : ""}</div>
                    <div class="font-bold text-zinc-500">${rep.fecha instanceof Date ? formatearFechaHumana(rep.fecha) : (rep.fecha || "")}</div>
                </div>
            </div>
        `;

        mapMarkers.push(createReportMarker(map, [rep.lng, rep.lat], el, popupHtml));
    });

    // Center map on the most recent valid report
    const validReports = reportes.filter(r => r.lat && r.lng && (r.lat !== -90 || r.lng !== -180));
    if (validReports.length > 0) {
        const last = validReports[0];
        map.flyTo({ center: [last.lng, last.lat], zoom: 14 });
    }
}
