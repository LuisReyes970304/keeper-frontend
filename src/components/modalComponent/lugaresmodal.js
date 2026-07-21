import Swal from 'sweetalert2';
import { get_location } from '../../models/locationModel.js';
import { findMailingAddress } from '../../services/findMailingAddress.js';
import { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export function openLugarFormModal(lugar = null, onSaveCallback) {
  Swal.fire({
    title: `<div class="text-left font-sans"><h3 class="text-base font-semibold text-zinc-900">${lugar ? 'Editar Lugar Seguro' : 'Nuevo Lugar Seguro'}</h3><p class="text-zinc-500 mt-1 text-xs leading-relaxed">Configura perímetros de seguridad para geolocalización.</p></div>`,
    html: `
      <form id="swal-lugar-crud-form" class="space-y-4 mt-4 text-left font-sans">
        <div>
          <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Nombre del Lugar</label>
          <input id="lugar-nombre" type="text" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Ej. Mi Casa" value="${lugar ? lugar.nombre : ''}">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Tipo</label>
            <select id="lugar-tipo" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 bg-white">
              <option value="Casa" ${lugar && lugar.tipo === 'Casa' ? 'selected' : ''}>Casa</option>
              <option value="Trabajo" ${lugar && lugar.tipo === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
              <option value="Otro" ${lugar && lugar.tipo === 'Otro' ? 'selected' : ''}>Otro</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Rango (metros)</label>
            <input id="lugar-metros" type="number" min="10" max="2000" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Ej. 100" value="${lugar ? lugar.metros : '100'}">
          </div>
        </div>

        <!-- Área de Mapa para Geolocalización Real -->
        <div class="rounded border border-zinc-200 bg-zinc-50 p-3 mt-2 flex flex-col gap-1.5">
          <div class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ubicar en el Mapa</div>
          
          <!-- Buscador de Direcciones Flotante del Modal -->
          <div class="relative w-full mb-1">
            <input id="lugar-map-search-input" type="text" placeholder="Buscar dirección o lugar..." class="w-full pl-9 pr-4 py-2 border border-zinc-200 bg-white text-zinc-800 rounded text-xs focus:outline-none focus:border-orange-500 shadow-sm placeholder-zinc-400">
            <svg class="h-3.5 w-3.5 text-zinc-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Contenedor del Mapa Real -->
          <div id="lugar-map-container" class="relative h-44 w-full bg-zinc-950 border border-zinc-200 rounded overflow-hidden shadow-inner"></div>

          <!-- Geolocalización Manual y GPS -->
          <div class="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/50">
            <button type="button" id="lugar-btn-gps" class="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer focus:outline-none">
              <span class="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              Usar mi ubicación actual (GPS)
            </button>
            <div id="lugar-loc-status" class="text-[10px] text-zinc-500 font-medium max-w-[200px] truncate text-right">Cargando mapa...</div>
          </div>
        </div>

        <div id="lugar-modal-error" class="text-xs font-semibold text-red-500 text-center"></div>

        <button id="lugar-modal-submit" type="button" class="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-medium py-2.5 rounded text-xs transition-colors mt-2 uppercase tracking-wider font-semibold">
          ${lugar ? 'Guardar Cambios' : 'Registrar Lugar'}
        </button>
      </form>
    `,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-md w-full font-sans',
      cancelButton: 'w-full mt-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold py-2 rounded transition-colors text-center'
    },
    didOpen: async () => {
      const submitBtn = document.getElementById('lugar-modal-submit');
      const errorEl = document.getElementById('lugar-modal-error');
      const locStatus = document.getElementById('lugar-loc-status');
      const gpsBtn = document.getElementById('lugar-btn-gps');
      const searchInput = document.getElementById('lugar-map-search-input');

      // Coordenadas por defecto iniciales (Bogotá)
      let selectedLat = lugar && lugar.lat ? lugar.lat : 4.60971;
      let selectedLng = lugar && lugar.lng ? lugar.lng : -74.08175;

      // Obtener dirección textual de coordenadas
      const geocodeCoords = async (lat, lon) => {
        locStatus.textContent = "Obteniendo dirección...";
        try {
          const address = await findMailingAddress(lat, lon);
          locStatus.textContent = address;
        } catch (e) {
          locStatus.textContent = `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° W`;
        }
      };

      // Si es un lugar nuevo y el navegador tiene GPS, intentar centrar inicialmente en su GPS
      if (!lugar) {
        try {
          const loc = await get_location();
          selectedLat = loc.lat;
          selectedLng = loc.lon;
        } catch (e) {
          console.warn("No se pudo autodetectar GPS al inicio, usando default:", e);
        }
      }

      // Inicializar Mapa
      const lugarMap = new Map({
        container: 'lugar-map-container',
        style: MAP_STYLE,
        center: [selectedLng, selectedLat],
        zoom: 15
      });

      // Crear Marcador Naranja
      const currentMarker = new Marker({ color: '#ea580c' })
        .setLngLat([selectedLng, selectedLat])
        .addTo(lugarMap);

      // Obtener dirección del punto de partida
      geocodeCoords(selectedLat, selectedLng);

      // Forzar resize para evitar contenedor 0x0
      setTimeout(() => {
        lugarMap.resize();
      }, 150);

      // Evento de clic en el mapa para ubicar manualmente
      lugarMap.on('click', async (e) => {
        const { lng, lat } = e.lngLat;
        selectedLat = lat;
        selectedLng = lng;
        currentMarker.setLngLat([lng, lat]);
        await geocodeCoords(lat, lng);
      });

      // Evento de clic en el botón GPS
      gpsBtn.addEventListener('click', async () => {
        locStatus.textContent = "Obteniendo GPS...";
        try {
          const loc = await get_location();
          selectedLat = loc.lat;
          selectedLng = loc.lon;
          currentMarker.setLngLat([loc.lon, loc.lat]);
          lugarMap.flyTo({ center: [loc.lon, loc.lat], zoom: 15 });
          await geocodeCoords(loc.lat, loc.lon);
        } catch (e) {
          console.error(e);
          locStatus.textContent = "GPS no disponible";
        }
      });

      // Evento del buscador por texto
      searchInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = e.target.value.trim();
          if (!query) return;

          locStatus.textContent = "Buscando...";
          try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
            const response = await fetch(url).then(r => r.json());
            if (response && response.length > 0) {
              const { lat, lon, display_name } = response[0];
              const latNum = parseFloat(lat);
              const lonNum = parseFloat(lon);
              selectedLat = latNum;
              selectedLng = lonNum;

              currentMarker.setLngLat([lonNum, latNum]);
              lugarMap.flyTo({ center: [lonNum, latNum], zoom: 15 });
              locStatus.textContent = display_name;
            } else {
              locStatus.textContent = "Dirección no encontrada";
            }
          } catch (err) {
            console.error(err);
            locStatus.textContent = "Error al buscar";
          }
        }
      });

      // Submit del modal
      submitBtn.addEventListener('click', () => {
        const nombre = document.getElementById('lugar-nombre').value.trim();
        const tipo = document.getElementById('lugar-tipo').value;
        const metros = parseInt(document.getElementById('lugar-metros').value.trim());

        if (!nombre || !tipo || isNaN(metros) || metros <= 0) {
          errorEl.textContent = 'Por favor, complete todos los campos.';
          return;
        }

        const coordinatesText = locStatus.textContent || `${selectedLat.toFixed(4)}° N, ${selectedLng.toFixed(4)}° W`;

        onSaveCallback(nombre, tipo, metros, coordinatesText, selectedLat, selectedLng);
        Swal.close();
      });
    }
  });
}
