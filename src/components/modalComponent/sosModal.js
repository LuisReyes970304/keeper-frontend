import Swal from 'sweetalert2';
import { get_location } from '../../models/locationModel.js';
import { findMailingAddress } from '../../services/findMailingAddress.js';
import { createReport } from '../../services/endpoints/reports.js';
import { createSos } from '../../services/endpoints/sos.js';
import { getTargetLocation } from '../../controllers/mapManager.controller.js';

export function initSOSModal(buttonId, onSOSCallback) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener('click', () => {
    Swal.fire({
      title: '',
      html: `
        <div class="text-left font-sans space-y-4">
          
          <!-- Header (Target y Localizacion) -->
          <div class="flex flex-col items-center text-center pb-2 border-b border-zinc-100">
            <!-- Target Concentrico Naranja -->
            <div class="relative flex h-8 w-8 items-center justify-center mb-1.5">
              <div class="h-6 w-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
                <div class="h-2.5 w-2.5 rounded-full bg-orange-500"></div>
              </div>
            </div>
            <span class="text-[10px] font-bold text-orange-600 tracking-wider uppercase">Localización en Tiempo Real</span>
            <span id="sos-current-address" class="text-xs font-medium text-zinc-500 mt-0.5">Obteniendo ubicación...</span>
          </div>

          <!-- Servicios de Emergencia (Tarjetas oscuras) -->
          <div class="grid gap-2">
            
            <!-- Policía -->
            <button id="sos-btn-policia" type="button" class="w-full text-left p-3.5 rounded-md bg-zinc-900 border border-zinc-950 flex items-center justify-between text-white transition-all hover:bg-zinc-800 active:scale-[0.98] select-none">
              <div class="flex items-center gap-3">
                <div class="sos-check-circle h-4 w-4 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-800 transition-colors">
                  <svg class="h-2.5 w-2.5 text-white scale-0 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold tracking-wide">POLICÍA</div>
                  <div class="text-[10px] text-zinc-400 mt-0.5">112 / 091</div>
                </div>
              </div>
              <div class="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-white transition-colors">
                <svg class="h-4 w-4 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </button>

            <!-- Ambulancia -->
            <button id="sos-btn-ambulancia" type="button" class="w-full text-left p-3.5 rounded-md bg-zinc-900 border border-zinc-950 flex items-center justify-between text-white transition-all hover:bg-zinc-800 active:scale-[0.98] select-none">
              <div class="flex items-center gap-3">
                <div class="sos-check-circle h-4 w-4 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-800 transition-colors">
                  <svg class="h-2.5 w-2.5 text-white scale-0 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold tracking-wide">AMBULANCIA</div>
                  <div class="text-[10px] text-zinc-400 mt-0.5">112 / 061</div>
                </div>
              </div>
              <div class="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-white transition-colors">
                <svg class="h-4 w-4 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  <path d="M12 11v5m-2.5-2.5h5" />
                </svg>
              </div>
            </button>

            <!-- Bomberos -->
            <button id="sos-btn-bomberos" type="button" class="w-full text-left p-3.5 rounded-md bg-zinc-900 border border-zinc-950 flex items-center justify-between text-white transition-all hover:bg-zinc-800 active:scale-[0.98] select-none">
              <div class="flex items-center gap-3">
                <div class="sos-check-circle h-4 w-4 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-800 transition-colors">
                  <svg class="h-2.5 w-2.5 text-white scale-0 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-bold tracking-wide">BOMBEROS</div>
                  <div class="text-[10px] text-zinc-400 mt-0.5">112 / 080</div>
                </div>
              </div>
              <div class="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-white transition-colors">
                <svg class="h-4 w-4 text-zinc-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="14" height="11" rx="1" />
                  <rect x="16" y="9" width="6" height="9" rx="1" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="17" cy="18" r="2" />
                  <path d="M9 7V4m6 3V3M2 11h14" />
                </svg>
              </div>
            </button>

          </div>

          <!-- Contactos de confianza (Barra oscura con toggle naranja) -->
          <div class="p-3.5 rounded-md bg-zinc-900 border border-zinc-950 flex items-center justify-between text-white">
            <div class="flex items-center gap-3">
              <svg class="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div>
                <div class="text-xs font-bold">Contactos de Confianza</div>
                <div class="text-[10px] text-zinc-400 mt-0.5">Se enviará un SMS con tu ubicación</div>
              </div>
            </div>
            <!-- Custom Orange Toggle -->
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input id="sos-contacts-toggle" type="checkbox" checked class="sr-only peer">
              <div class="w-9 h-5 bg-zinc-800 rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
            </label>
          </div>

          <!-- CONTENEDOR DE UBICACIONES CON DISEÑO IDÉNTICO -->
          <div class="flex flex-col gap-2.5 border-t border-zinc-100 pt-3">
            <!-- Opción 1: GPS Actual -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 text-xs text-zinc-650 cursor-pointer">
                <input id="sos-use-location" type="checkbox" checked class="w-3.5 h-3.5 border-zinc-300 rounded text-zinc-900 focus:ring-0" />
                <span>Usar mi ubicación actual (GPS)</span>
              </label>
              <div id="sos-loc-status" class="text-[10px] text-zinc-400 font-medium max-w-[180px] text-right truncate">Obteniendo ubicación...</div>
            </div>

            <!-- Opción 2: Punto Objetivo del Mapa -->
            <div class="flex items-center justify-between">
              <label id="sos-use-target-label" class="flex items-center gap-2 text-xs text-zinc-400 cursor-not-allowed select-none">
                <input id="sos-use-target-location" type="checkbox" class="w-3.5 h-3.5 border-zinc-300 rounded text-zinc-900 focus:ring-0 disabled:opacity-50" disabled />
                <span>Usar punto seleccionado en el mapa</span>
              </label>
              <div id="sos-target-status" class="text-[10px] text-zinc-400 font-medium max-w-[180px] text-right truncate"></div>
            </div>
          </div>

          <!-- Boton SOS Principal Naranja -->
          <div class="pt-2">
            <div id="sos-progress" class="w-full h-1 bg-zinc-100 rounded-full overflow-hidden mb-2" style="display:none;"></div>
            
            <button id="sos-button" class="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-3 rounded text-xs transition-colors uppercase tracking-wider flex items-center justify-center gap-2">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Alerta Global SOS</span>
            </button>

            <div id="sos-hint" class="text-[9px] text-zinc-400 text-center mt-2 uppercase tracking-wider font-semibold">Mantén presionado para cancelar en 3s</div>
          </div>

        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-md w-full font-sans',
        closeButton: 'text-zinc-400 hover:text-zinc-900 transition-colors'
      },
      didOpen: () => {
        const sosBtn = document.getElementById('sos-button');
        const progress = document.getElementById('sos-progress');
        const btnPolicia = document.getElementById('sos-btn-policia');
        const btnAmbulancia = document.getElementById('sos-btn-ambulancia');
        const btnBomberos = document.getElementById('sos-btn-bomberos');
        let holdTimer = null;
        let startTs = null;
        let selectedServices = [];

        // Lógica de geolocalización GPS
        const chkGPS = document.getElementById("sos-use-location");
        const locStatus = document.getElementById("sos-loc-status");
        
        const chkTarget = document.getElementById("sos-use-target-location");
        const labelTarget = document.getElementById("sos-use-target-label");
        const targetStatus = document.getElementById("sos-target-status");

        const addressHeader = document.getElementById("sos-current-address");
        let currentCoords = null;
        let selectedTargetCoords = null;
        
        chkGPS.addEventListener("change", () => {
            if (chkGPS.checked && chkTarget) chkTarget.checked = false;
        });

        if (chkTarget) {
            chkTarget.addEventListener("change", () => {
                if (chkTarget.checked && chkGPS) chkGPS.checked = false;
            });
        }

        const updateGPSLocation = async () => {
          // Evaluar Target Coords primero
          selectedTargetCoords = getTargetLocation();
          if (selectedTargetCoords && chkTarget) {
              chkTarget.removeAttribute("disabled");
              labelTarget.className = "flex items-center gap-2 text-xs text-zinc-600 cursor-pointer";
              targetStatus.textContent = "Buscando dirección...";
              try {
                  const lng = selectedTargetCoords.lon ?? selectedTargetCoords.lng;
                  const addr = await findMailingAddress(selectedTargetCoords.lat, lng);
                  targetStatus.textContent = addr;
              } catch(e) {
                  targetStatus.textContent = "No disponible";
              }
          }

          if (!chkGPS.checked) {
            locStatus.textContent = "Ubicación desactivada";
            currentCoords = null;
            return;
          }

          locStatus.textContent = "Obteniendo ubicación...";
          
          try {
            const coords = await get_location();
            currentCoords = coords;
            locStatus.textContent = "Buscando dirección...";

            const address = await findMailingAddress(coords.lat, coords.lon);
            locStatus.textContent = address;
            if (addressHeader && !chkTarget?.checked) addressHeader.textContent = address;
          } catch (error) {
            console.error(error);
            locStatus.textContent = "Problemas obteniendo la dirección.";
            if (addressHeader && !chkTarget?.checked) addressHeader.textContent = "Ubicación no disponible";
            currentCoords = null;
          }
        };

        if (chkTarget) {
            chkTarget.addEventListener('change', () => {
                if (chkTarget.checked) {
                    addressHeader.textContent = targetStatus.textContent;
                } else {
                    addressHeader.textContent = locStatus.textContent;
                }
            });
        }

        chkGPS.addEventListener("change", () => {
            updateGPSLocation();
            if (chkGPS.checked) {
                addressHeader.textContent = locStatus.textContent;
            }
        });
        updateGPSLocation(); // Ejecución inicial al abrir

        const toggleService = (btn, serviceName) => {
          const index = selectedServices.indexOf(serviceName);
          const checkCircle = btn.querySelector('.sos-check-circle');
          const checkSvg = checkCircle?.querySelector('svg');
          const iconCircle = btn.querySelector('.h-9.w-9');
          
          if (index > -1) {
            selectedServices.splice(index, 1);
            // Inactivo
            btn.classList.add('bg-zinc-900', 'border-zinc-950');
            btn.classList.remove('bg-zinc-800', 'border-orange-500', 'ring-2', 'ring-orange-500/20');
            
            if (checkCircle) {
              checkCircle.classList.add('bg-zinc-800', 'border-zinc-700');
              checkCircle.classList.remove('bg-orange-500', 'border-orange-600');
            }
            if (checkSvg) {
              checkSvg.classList.add('scale-0');
              checkSvg.classList.remove('scale-100');
            }
            if (iconCircle) {
              iconCircle.classList.add('bg-zinc-800');
              iconCircle.classList.remove('bg-orange-600');
            }
          } else {
            selectedServices.push(serviceName);
            // Activo
            btn.classList.remove('bg-zinc-900', 'border-zinc-950');
            btn.classList.add('bg-zinc-800', 'border-orange-500', 'ring-2', 'ring-orange-500/20');
            
            if (checkCircle) {
              checkCircle.classList.remove('bg-zinc-800', 'border-zinc-700');
              checkCircle.classList.add('bg-orange-500', 'border-orange-600');
            }
            if (checkSvg) {
              checkSvg.classList.remove('scale-0');
              checkSvg.classList.add('scale-100');
            }
            if (iconCircle) {
              iconCircle.classList.remove('bg-zinc-800');
              iconCircle.classList.add('bg-orange-600');
            }
          }
        };

        btnPolicia?.addEventListener('click', () => toggleService(btnPolicia, 'Policía'));
        btnAmbulancia?.addEventListener('click', () => toggleService(btnAmbulancia, 'Ambulancia'));
        btnBomberos?.addEventListener('click', () => toggleService(btnBomberos, 'Bomberos'));

        async function triggerAlert() {
          let address = 'Dirección no identificada';
          
          let finalLat = null;
          let finalLng = null;

          if (chkGPS && chkGPS.checked) {
              if (!currentCoords) {
                  const btn = document.getElementById('sos-button');
                  if (btn) btn.innerHTML = 'Fijando ubicación...';
                  try {
                      currentCoords = await get_location();
                      address = await findMailingAddress(currentCoords.lat, currentCoords.lon);
                  } catch (e) {
                      address = 'Ubicación no disponible';
                  }
              } else {
                  address = locStatus.textContent;
              }
              if (currentCoords) {
                  finalLat = currentCoords.lat;
                  finalLng = currentCoords.lon;
              }
          } else if (chkTarget && chkTarget.checked) {
              address = targetStatus.textContent;
              if (selectedTargetCoords) {
                  finalLat = selectedTargetCoords.lat;
                  finalLng = selectedTargetCoords.lon ?? selectedTargetCoords.lng;
              }
          }
          
          if (address === 'Obteniendo ubicación...' || address === 'Buscando dirección...') {
              address = 'Ubicación detectada (Procesando)';
          }
          
          const servicesText = selectedServices.length > 0 ? selectedServices.join(', ') : 'Ninguno (Alerta General)';
          const reportType = selectedServices.length > 0 ? `SOS: ${selectedServices.join(' + ')}` : 'SOS Global';
          
          const sessionUser = JSON.parse(sessionStorage.getItem("usuarioLogueado")) || { nombres: "Yo" };
          const nombreCompleto = `${sessionUser.nombres} ${sessionUser.apellidos || ''}`.trim();

          const reportData = {
            id: `KP-${Math.floor(1000 + Math.random() * 9000)}`,
            tipo: reportType,
            descripcion: `ALERTA DE EMERGENCIA SOS: Solicitud de asistencia inmediata de: ${servicesText}.`,
            ubicacion: address,
            fecha: 'Hace un momento',
            estado: 'Pendiente',
            lat: finalLat,
            lng: finalLng,
            reportadoPor: nombreCompleto
          };

          if (onSOSCallback) {
            onSOSCallback(reportData);
          }

          // Guardar en backend asíncronamente
          let categoriasAEnviar = [];
          
          if (selectedServices.length === 0) {
              // Si no seleccionó nada (Alerta General), enviamos a los 3 perfiles
              categoriasAEnviar = [3, 5, 7]; 
          } else {
              // 3 = Altercado / SOS Policía
              // 5 = Ayuda Externa / SOS Bomberos
              // 7 = Urgencia Médica / SOS Ambulancia
              if (selectedServices.includes('Policía')) categoriasAEnviar.push(3);
              if (selectedServices.includes('Bomberos')) categoriasAEnviar.push(5);
              if (selectedServices.includes('Ambulancia')) categoriasAEnviar.push(7);
          }

          const promesasGuardado = categoriasAEnviar.map(catId => {
              const apiData = {
                  id_categoria: catId,
                  titulo: reportType + ' en ' + address,
                  descripcion: reportData.descripcion,
                  latitud: finalLat || 0,
                  longitud: finalLng || 0
              };
              return createReport(apiData).catch(e => console.error(`Error guardando SOS para cat ${catId}`, e));
          });
          
          let serviciosAEnviar = [];
          if (selectedServices.length === 0) {
              serviciosAEnviar = [1, 2, 3];
          } else {
              if (selectedServices.includes('Policía')) serviciosAEnviar.push(1);
              if (selectedServices.includes('Ambulancia')) serviciosAEnviar.push(2);
              if (selectedServices.includes('Bomberos')) serviciosAEnviar.push(3);
          }
          
          const promesasSOS = serviciosAEnviar.map(servId => {
              const sosData = {
                  id_servicio: servId,
                  latitud: finalLat || 0,
                  longitud: finalLng || 0,
                  estado: 'realizado'
              };
              return createSos(sosData).catch(e => console.error(`Error guardando SOS en tabla sos para servicio ${servId}`, e));
          });
          
          const todasLasPromesas = [...promesasGuardado, ...promesasSOS];
          
          Swal.fire({ title: 'Enviando...', text: 'Enviando alerta a centrales...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

          await Promise.all(todasLasPromesas);

          Swal.close();
          Swal.fire({
            icon: 'success',
            title: '<h3 class="text-sm font-semibold text-zinc-900 text-left">Alerta Global Enviada</h3>',
            html: `<p class="text-xs text-zinc-500 text-left">Se ha activado la alerta global. Se notificó a: <strong>${servicesText}</strong>. Tu ubicación (${address}) ha sido compartida.</p>`,
            showConfirmButton: false,
            timer: 3000,
            buttonsStyling: false,
            customClass: { popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-xs w-full font-sans' }
          });
        }

        function startHold() {
          if (!progress) return;
          progress.style.display = 'block';
          progress.innerHTML = '';
          startTs = Date.now();
          const bar = document.createElement('div');
          bar.style.height = '100%';
          bar.style.width = '0%';
          bar.style.background = '#ea580c';
          bar.style.transition = 'width 3s linear';
          progress.appendChild(bar);
          void bar.offsetWidth;
          bar.style.width = '100%';
          holdTimer = setTimeout(() => {
            triggerAlert();
          }, 3000);
        }

        sosBtn.addEventListener('mousedown', startHold);
        sosBtn.addEventListener('touchstart', startHold);
        
        const cancelHold = () => {
          if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
          }
          if (progress) {
            progress.style.display = 'none';
            progress.innerHTML = '';
          }
        };

        window.addEventListener('mouseup', cancelHold);
        window.addEventListener('touchend', cancelHold);

        sosBtn.addEventListener('click', (e) => {
          e.preventDefault();
          Swal.fire({
            title: '<h3 class="text-sm font-semibold text-zinc-900 text-left">Confirmar Alerta</h3>',
            html: '<p class="text-xs text-zinc-500 text-left">¿Desea enviar una alerta global ahora?</p>',
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            customClass: {
              popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-xs w-full',
              confirmButton: 'bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors mr-2',
              cancelButton: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-3 py-1.5 rounded transition-colors'
            },
            buttonsStyling: false
          }).then(result => {
            if (result.isConfirmed) triggerAlert();
          });
        });
      }
    });
  });
}

