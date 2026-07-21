import Chart from 'chart.js/auto';
import Swal from "sweetalert2";
import { getDashboardTemplate } from "../../ui/templateBomberos.js";
import { findAddress } from "../../services/findAddress.js";
import { inicializarMapaVea, actualizarMarcadoresEnMapa, mapMarkers } from "../../controllers/mapReport.controller.js";
import { getMap } from "../../controllers/mapManager.controller.js";

import { getAllReports, updateReport } from "../../services/endpoints/reports.js";
let BOMBERO_LOGUEADO = { nombre: "Bombero", rango: "Activo" };

let reportes = [];
let bomberoLogueado = BOMBERO_LOGUEADO;

async function cargarReportesDesdeAPI() {
    try {
        const data = await getAllReports();
        reportes = (data || [])
            .filter((r) => [4, 5].includes(r.id_categoria))
            .map((r) => ({
                ...r,
                id: r.id_reporte || r.id,
                kpId: r.id_reporte || r.id,
                tipo: r.categoria_nombre || r.tipo || "General",
                descripcion: r.descripcion,
                fecha: new Date(r.fecha_reporte || r.fecha_hora_creacion || r.fecha || Date.now()),
                ubicacion: (r.titulo || r.ubicacion_geografica || "Desconocida").replace(/.*? en /, ''),
                estadoCaso: r.nombre_estado || r.estado || "Pendiente",
                gravedad: r.gravedad || "Media",
                lat: parseFloat(r.latitud || r.lat) || 0,
                lng: parseFloat(r.longitud || r.lng) || 0,
                reportadoPor: r.usuario_nombre || "Desconocido"
            }));
    } catch (e) {
        console.error("Error cargando reportes reales:", e);
        reportes = [];
    }
}

let incidentesChartInstance = null;
let tabActivo = "Estadisticas";

let filtroHistorialTiempo = "todo";
let filtroHistorialCategoria = "todos";
let ordenHistorialGravedad = "gravedad-desc";

let filtroEstadisticasTiempo = "3dias";

let casoModalId = null;

export async function inicializarDashboard() {
    const app = document.getElementById("app");
    if (!app) return;

    await cargarReportesDesdeAPI();

    const sessionUser = JSON.parse(sessionStorage.getItem("usuarioLogueado"));
    if (sessionUser) {
        bomberoLogueado = {
            nombre: `${sessionUser.nombres} ${sessionUser.apellidos || ''}`.trim(),
            rango: sessionUser.rol || "Bombero",
            placa: sessionUser.cedula || "N/A",
            foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(sessionUser.nombres)}&background=dc2626&color=fff`
        };
    }

    app.innerHTML = getDashboardTemplate(bomberoLogueado);

    inicializarMapaVea(reportes);

    const mapSearchInput = document.getElementById("map-search-input");
    if (mapSearchInput) {
        findAddress(mapSearchInput);
    }

    actualizarEstadisticasVisuales();
    renderizarTablaHistorial();
    renderizarTablaModeracion();
    renderizarAlertasRecientes();
    enlazarEventosAcciones();
}

function actualizarEstadisticasVisuales() {
    const activeValEl = document.getElementById("val-incidentes-activos");
    if (!activeValEl) return;

    const activosTotales = reportes.filter(
        (r) => r.estadoCaso !== "Caso cerrado" && r.estadoCaso !== "Completado"
    ).length;
    activeValEl.textContent = `${activosTotales}`;

    const ahora = new Date();
    const reportesFiltrados = reportes.filter(r => {
        const msDiferencia = ahora - r.fecha;
        const diasTranscurridos = msDiferencia / (1000 * 60 * 60 * 24);
        if (filtroEstadisticasTiempo === "semana") return diasTranscurridos <= 7;
        if (filtroEstadisticasTiempo === "mes") return diasTranscurridos <= 30;
        return diasTranscurridos <= 3;
    });

    const valoresDias = { lun: 0, mar: 0, mie: 0, jue: 0, vie: 0, sab: 0, dom: 0 };
    const mapaDias = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
    reportesFiltrados.forEach(r => {
        if (r.fecha) {
            const diaStr = mapaDias[r.fecha.getDay()];
            valoresDias[diaStr]++;
        }
    });

    const numericData = [
        valoresDias.lun, valoresDias.mar, valoresDias.mie,
        valoresDias.jue, valoresDias.vie, valoresDias.sab, valoresDias.dom
    ];
    
    const ctx = document.getElementById('incidentesChart');
    if (ctx) {
        if (!incidentesChartInstance) {
            incidentesChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Incidentes',
                        data: numericData,
                        backgroundColor: '#dc2626',
                        borderRadius: 4,
                        hoverBackgroundColor: '#b91c1c'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#f4f4f5' },
                            border: { dash: [4, 4] }
                        },
                        x: {
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        } else {
            incidentesChartInstance.data.datasets[0].data = numericData;
            incidentesChartInstance.update();
        }
    }

    let secNorte = 0, secCentral = 0, secIndustrial = 0;
    reportesFiltrados.forEach(r => {
        const ubi = (r.ubicacion || "").toLowerCase() + " " + (r.barrio || "").toLowerCase();
        if (ubi.includes('norte')) {
            secNorte++;
        } else if (ubi.includes('industrial') || ubi.includes('zona i')) {
            secIndustrial++;
        } else {
            secCentral++;
        }
    });

    const totalSectores = secNorte + secCentral + secIndustrial;

    const nEl = document.getElementById("sector-norte-val");
    const nBar = document.getElementById("sector-norte-bar");
    if (nEl && nBar) {
        nEl.textContent = secNorte;
        nBar.style.width = `${totalSectores > 0 ? (secNorte / totalSectores) * 100 : 0}%`;
    }

    const cEl = document.getElementById("sector-central-val");
    const cBar = document.getElementById("sector-central-bar");
    if (cEl && cBar) {
        cEl.textContent = secCentral;
        cBar.style.width = `${totalSectores > 0 ? (secCentral / totalSectores) * 100 : 0}%`;
    }

    const iEl = document.getElementById("sector-industrial-val");
    const iBar = document.getElementById("sector-industrial-bar");
    if (iEl && iBar) {
        iEl.textContent = secIndustrial;
        iBar.style.width = `${totalSectores > 0 ? (secIndustrial / totalSectores) * 100 : 0}%`;
    }
}

function renderizarAlertasRecientes() {
    const contenedorListado = document.getElementById(
        "lista-alertas-recientes",
    );
    const contadorAlertas = document.getElementById("contador-alertas");
    if (!contenedorListado) return;

    if (contadorAlertas) {
        contadorAlertas.textContent = `${reportes.length} Incidentes`;
    }

    contenedorListado.innerHTML = reportes
        .slice()
        .sort((a, b) => b.fecha - a.fecha)
        .map((rep) => {
            let colorEtiqueta = "text-[#dc2626]";
            let textoEtiqueta = "Urgente";

            if (rep.gravedad === "Alta") {
                colorEtiqueta = "text-red-655 font-bold";
                textoEtiqueta = "Crítico";
            } else if (rep.gravedad === "Baja") {
                colorEtiqueta = "text-[#10b981]";
                textoEtiqueta = "Normal";
            }

            const minutos = Math.floor((new Date() - rep.fecha) / (1000 * 60));
            let tiempoTexto = "Hace instantes";

            if (minutos >= 60 * 24) {
                const dias = Math.floor(minutos / (60 * 24));
                tiempoTexto = `${dias} d`;
            } else if (minutos >= 60) {
                const horas = Math.floor(minutos / 60);
                tiempoTexto = `${horas} h`;
            } else if (minutos > 0) {
                tiempoTexto = `${minutos} min`;
            }

            return `
      <div data-id="${rep.id}" class="item-alerta p-3 rounded-md hover:bg-zinc-50 border border-zinc-150 transition-all duration-150 cursor-pointer flex justify-between items-start gap-4">
        <div>
          <h4 class="text-xs font-bold text-zinc-950">${rep.ubicacion}</h4>
          <p class="text-[10px] text-zinc-500 mt-0.5 whitespace-normal break-words">${rep.descripcion}</p>
          <span class="text-[9px] text-zinc-400 font-mono mt-1 inline-block">${tiempoTexto} • <strong class="text-zinc-600 font-semibold uppercase font-mono text-[9px]">${rep.estadoCaso}</strong></span>
        </div>
        <div class="text-[9px] uppercase font-bold font-mono tracking-wider text-right shrink-0 ${colorEtiqueta}">
          ${textoEtiqueta}
        </div>
      </div>
    `;
        })
        .join("");

    document.querySelectorAll(".item-alerta").forEach((item) => {
        item.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.getAttribute("data-id"));
            const rep = reportes.find((r) => r.id === id);
            if (rep && rep.lat && rep.lng) {
                const map = getMap();
                const marker = mapMarkers.find((m) => {
                    const latlng = m.getLngLat();
                    return (
                        Math.abs(latlng.lat - rep.lat) < 0.0001 &&
                        Math.abs(latlng.lng - rep.lng) < 0.0001
                    );
                });

                if (marker) {
                    if (typeof marker.togglePopup === "function") {
                        marker.togglePopup();
                    } else if (typeof marker.openPopup === "function") {
                        marker.openPopup();
                    }
                }
            }
        });
    });
}

function renderizarTablaModeracion() {
    const tbody = document.getElementById("tabla-moderacion-cuerpo");
    if (!tbody) return;

    const recientes = reportes
        .slice()
        .sort((a, b) => b.fecha - a.fecha)
        .slice(0, 3);

    tbody.innerHTML = recientes
        .map((rep) => {
            const nombreTipo = rep.subtipo || rep.tipo;

            let colorSelectClass =
                "bg-[#fffbeb] text-amber-800 border-amber-200";
            if (
                rep.estadoCaso === "Caso cerrado" ||
                rep.estadoCaso === "Completado"
            ) {
                colorSelectClass =
                    "bg-[#f0fdf4] text-emerald-800 border-[#bbf7d0]";
            } else if (rep.estadoCaso === "En revisión") {
                colorSelectClass =
                    "bg-[#eff6ff] text-blue-800 border-[#bfdbfe]";
            } else if (rep.estadoCaso === "visto") {
                colorSelectClass = "bg-[#f4f4f5] text-zinc-700 border-zinc-200";
            }

            const selectEstadoHtml = `
      <div class="relative inline-block w-32">
        <select data-id="${rep.id}" class="select-estado-inline-mod appearance-none w-full ${colorSelectClass} border font-bold font-mono text-[9px] uppercase px-2 py-1 pr-6 rounded-md focus:outline-none cursor-pointer transition-colors duration-150">
          <option value="Pendiente" ${rep.estadoCaso === "Pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="visto" ${rep.estadoCaso === "visto" ? "selected" : ""}>Visto</option>
          <option value="En revisión" ${rep.estadoCaso === "En revisión" ? "selected" : ""}>En revisión</option>
          <option value="Caso cerrado" ${rep.estadoCaso === "Caso cerrado" || rep.estadoCaso === "Completado" ? "selected" : ""}>Completado</option>
        </select>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 text-current pointer-events-none">
          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </div>
    `;

            const accionTexto = rep.accionPolicia || "—";
            const reportante = rep.ciudadano
                ? rep.ciudadano.nombre.split(" ")[0] +
                  " " +
                  (rep.ciudadano.nombre.split(" ")[1]
                      ? rep.ciudadano.nombre.split(" ")[1][0] + "."
                      : "")
                : "Ciudadano";

            const minutos = Math.floor((new Date() - rep.fecha) / (1000 * 60));
            let tiempoTexto = "Hace instantes";
            if (minutos >= 60) {
                const horas = Math.floor(minutos / 60);
                tiempoTexto = `Hace ${horas} h`;
            } else if (minutos > 0) {
                tiempoTexto = `Hace ${minutos} min`;
            }

            return `
      <tr class="hover:bg-zinc-50/50 transition-colors border-b border-zinc-100">
        <td class="px-5 py-3 font-mono font-bold text-zinc-950">#${rep.kpId}</td>
        <td class="px-4 py-3">${nombreTipo}</td>
        <td class="px-4 py-3 text-zinc-555 font-medium">${reportante}</td>
        <td class="px-4 py-3 text-zinc-400 font-normal">${tiempoTexto}</td>
        <td class="px-4 py-3">${selectEstadoHtml}</td>
        <td class="px-4 py-3 text-zinc-800 font-bold font-sans">${accionTexto}</td>
      </tr>
    `;
        })
        .join("");

    document.querySelectorAll(".select-estado-inline-mod").forEach((select) => {
        select.addEventListener("change", (e) => {
            const id = parseInt(e.target.getAttribute("data-id"));
            const nuevoEstado = e.target.value;
            actualizarEstadoCasoDirecto(id, nuevoEstado);
        });
    });
}

function renderizarTablaHistorial() {
    const tbody = document.getElementById("tabla-reportes-cuerpo");
    const histContadorTotal = document.getElementById("hist-contador-total");
    if (!tbody) return;

    const filtrados = obtenerReportesHistorialFiltrados();

    if (histContadorTotal) {
        histContadorTotal.textContent = `${filtrados.length} ${filtrados.length === 1 ? "Incidente Registrado" : "Incidentes Registrados"}`;
    }

    if (filtrados.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-12 text-center text-zinc-450 text-xs font-semibold">
          No se encontraron reportes que coincidan con los filtros de búsqueda establecidos.
        </td>
      </tr>
    `;
        return;
    }

    tbody.innerHTML = filtrados
        .map((rep) => {
            let badgeTipoClase = "bg-zinc-100 text-zinc-700 border-zinc-200";
            if (rep.tipo === "Incendio") {
                badgeTipoClase = "bg-red-50 text-red-700 border-red-200";
            } else if (rep.tipo === "Fugas y Derrames") {
                badgeTipoClase =
                    "bg-orange-50 text-orange-700 border-orange-200";
            } else if (rep.tipo === "Rescate y Emergencias") {
                badgeTipoClase = "bg-blue-50 text-blue-700 border-blue-200";
            }

            let colorSelectClass =
                "bg-[#fffbeb] text-amber-800 border-amber-200";
            if (
                rep.estadoCaso === "Caso cerrado" ||
                rep.estadoCaso === "Completado"
            ) {
                colorSelectClass =
                    "bg-[#f0fdf4] text-emerald-800 border-[#bbf7d0]";
            } else if (rep.estadoCaso === "En revisión") {
                colorSelectClass =
                    "bg-[#eff6ff] text-blue-800 border-[#bfdbfe]";
            } else if (rep.estadoCaso === "visto") {
                colorSelectClass = "bg-[#f4f4f5] text-zinc-700 border-zinc-200";
            }

            const selectEstadoHtml = `
      <div class="relative inline-block w-36">
        <select data-id="${rep.id}" class="select-estado-inline-hist appearance-none w-full ${colorSelectClass} border font-bold font-mono text-[9px] uppercase px-2.5 py-1.5 pr-7 rounded-md focus:outline-none cursor-pointer transition-colors duration-150">
          <option value="Pendiente" ${rep.estadoCaso === "Pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="visto" ${rep.estadoCaso === "visto" ? "selected" : ""}>Visto</option>
          <option value="En revisión" ${rep.estadoCaso === "En revisión" ? "selected" : ""}>En revisión</option>
          <option value="Caso cerrado" ${rep.estadoCaso === "Caso cerrado" || rep.estadoCaso === "Completado" ? "selected" : ""}>Caso cerrado</option>
        </select>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 text-current pointer-events-none">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </div>
    `;

            const accionTexto = rep.accionPolicia || "—";

            let evidenciaHtml =
                '<span class="text-zinc-300 font-mono">—</span>';
            if (rep.evidencia && rep.fotoEvidencia) {
                evidenciaHtml = `<button data-id="${rep.id}" class="btn-ver-evidencia text-[#dc2626] hover:text-[#b91c1c] font-bold text-xs cursor-pointer bg-transparent border-none p-0">Ver adjunto</button>`;
            }

            const minutes = Math.floor((new Date() - rep.fecha) / (1000 * 60));
            let tiempoTexto = "Hace instantes";
            if (minutes >= 60 * 24) {
                const dias = Math.floor(minutes / (60 * 24));
                tiempoTexto = `Hace ${dias} d`;
            } else if (minutes >= 60) {
                const horas = Math.floor(minutes / 60);
                tiempoTexto = `Hace ${horas} h`;
            } else if (minutes > 0) {
                tiempoTexto = `Hace ${minutes} min`;
            }

            return `
      <tr class="hover:bg-zinc-50/50 transition-colors">
        <td class="px-5 py-3.5 text-xs font-bold text-zinc-950 font-mono tracking-tight">${rep.kpId}</td>
        
        <td class="px-4 py-3.5 text-xs font-bold">
          <span class="px-2.5 py-0.5 rounded border ${badgeTipoClase} inline-flex items-center font-semibold text-[10px]">
            <span>${rep.tipo}</span>
          </span>
        </td>

        <td class="px-4 py-3.5 text-xs text-zinc-650 font-normal max-w-[280px] whitespace-normal break-words">${rep.descripcion}</td>
        <td class="px-4 py-3.5 text-xs text-zinc-650 font-medium">${rep.ubicacion} (${rep.barrio})</td>
        <td class="px-4 py-3.5 text-xs text-zinc-500 font-medium">${tiempoTexto}</td>
        
        <!-- ESTADO (Actualizar ahí mismo) -->
        <td class="px-4 py-3.5">
          ${selectEstadoHtml}
        </td>
        
        <!-- ACCIÓN (Nombre del que cambia los estados) -->
        <td class="px-4 py-3.5 text-xs text-zinc-800 font-bold font-sans">${accionTexto}</td>
        
        <!-- EVIDENCIAS -->
        <td class="px-6 py-3.5 text-center font-bold">
          ${evidenciaHtml}
        </td>
      </tr>
    `;
        })
        .join("");

    document
        .querySelectorAll(".select-estado-inline-hist")
        .forEach((select) => {
            select.addEventListener("change", (e) => {
                const id = parseInt(e.target.getAttribute("data-id"));
                const nuevoEstado = e.target.value;
                actualizarEstadoCasoDirecto(id, nuevoEstado);
            });
        });

    document.querySelectorAll(".btn-ver-evidencia").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.currentTarget.getAttribute("data-id"));
            abrirModalEvidencia(id);
        });
    });
}

function obtenerReportesHistorialFiltrados() {
    const ahora = new Date();

    return reportes
        .filter((r) => {
            if (
                filtroHistorialCategoria !== "todos" &&
                r.tipo !== filtroHistorialCategoria
            ) {
                return false;
            }

            const msDiferencia = ahora - r.fecha;
            const diasTranscurridos = msDiferencia / (1000 * 60 * 60 * 24);

            if (filtroHistorialTiempo === "dia") {
                return diasTranscurridos <= 1;
            } else if (filtroHistorialTiempo === "semana") {
                return diasTranscurridos <= 14;
            } else if (filtroHistorialTiempo === "mes") {
                return diasTranscurridos <= 30;
            }

            return true;
        })
        .sort((a, b) => {
            if (ordenHistorialGravedad === "gravedad-desc") {
                const gravedadVals = { Alta: 3, Media: 2, Baja: 1 };
                return (
                    (gravedadVals[b.gravedad] || 0) -
                    (gravedadVals[a.gravedad] || 0)
                );
            } else if (ordenHistorialGravedad === "gravedad-asc") {
                const gravedadVals = { Alta: 3, Media: 2, Baja: 1 };
                return (
                    (gravedadVals[a.gravedad] || 0) -
                    (gravedadVals[b.gravedad] || 0)
                );
            } else if (ordenHistorialGravedad === "fecha-desc") {
                return b.fecha - a.fecha;
            } else if (ordenHistorialGravedad === "fecha-asc") {
                return a.fecha - b.fecha;
            }
            return 0;
        });
}

async function actualizarEstadoCasoDirecto(id, nuevoEstado) {
    const caso = reportes.find((r) => r.id === id);
    if (!caso) return;

    let id_estado = 1;
    if (nuevoEstado.toLowerCase() === "visto") id_estado = 2;
    if (nuevoEstado === "En revisión") id_estado = 3;
    if (nuevoEstado === "Caso cerrado" || nuevoEstado === "Completado") id_estado = 4;

    const nombre = bomberoLogueado ? bomberoLogueado.nombre : "Bombero";
    let nuevaDesc = caso.descripcion || "";

    if (id_estado === 4) {
        if (!nuevaDesc.includes(`[Completado por:`)) {
            nuevaDesc += `\n\n[Completado por: ${nombre}]`;
        }
    } else if (id_estado === 3) {
        if (!nuevaDesc.includes(`[En revisión por:`)) {
            nuevaDesc += `\n\n[En revisión por: ${nombre}]`;
        }
    }

    try {
        const numericId = typeof caso.id === 'string' ? parseInt(caso.id.replace("KP-", ""), 10) : caso.id;
        await updateReport(numericId, {
            id_estado: id_estado,
            descripcion: nuevaDesc
        });

        caso.estadoCaso = nuevoEstado;
        caso.descripcion = nuevaDesc;

        if (nuevoEstado !== "Pendiente") {
            caso.accionPolicia = nombre;
        } else {
            caso.accionPolicia = "—";
        }

        Swal.fire({
            title: "¡Estado Actualizado!",
            text: `El caso ${caso.kpId} ha sido modificado a "${nuevoEstado}" en la base de datos.`,
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#dc2626",
            background: "#ffffff",
            color: "#09090b",
            customClass: {
                popup: "border border-zinc-200 rounded-md shadow-none",
            },
        });

        renderizarTablaHistorial();
        renderizarTablaModeracion();
        renderizarAlertasRecientes();
        actualizarEstadisticasVisuales();
        actualizarMarcadoresEnMapa(reportes);
    } catch(e) {
        console.error("Error al actualizar estado en bd:", e);
        Swal.fire("Error", "No se pudo actualizar el estado en el servidor", "error");
    }
}

function abrirModalEvidencia(id) {
    const caso = reportes.find((r) => r.id === id);
    if (!caso) return;

    casoModalId = id;

    document.getElementById("modal-titulo-caso").innerHTML =
        `<span class="text-[#dc2626] font-mono font-bold">EVIDENCIA ${caso.kpId}</span>`;

    const imgEvidencia = document.getElementById("modal-foto-evidencia");
    const labelArchivo = document.getElementById("modal-label-archivo");

    if (imgEvidencia && caso.fotoEvidencia) {
        imgEvidencia.src = caso.fotoEvidencia;
    }
    if (labelArchivo) {
        labelArchivo.textContent = `Evidencia_Caso_${caso.kpId}.jpg`;
    }

    const modal = document.getElementById("modal-detalle-caso");
    if (modal) {
        modal.classList.remove("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.remove("scale-95");
        modal.querySelector("div").classList.add("scale-100");
    }
}

function cerrarModalEvidencia() {
    const modal = document.getElementById("modal-detalle-caso");
    if (modal) {
        modal.classList.add("opacity-0", "pointer-events-none");
        modal.querySelector("div").classList.remove("scale-100");
        modal.querySelector("div").classList.add("scale-95");
    }
    casoModalId = null;
}

function enlazarEventosAcciones() {
    const navItems = document.querySelectorAll("#sidebar-navigation .nav-item");
    navItems.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            navItems.forEach((item) => {
                item.classList.remove(
                    "bg-[#1a1a1a]",
                    "text-white",
                    "border",
                    "border-zinc-800",
                );
                item.classList.add(
                    "text-zinc-400",
                    "hover:text-zinc-200",
                    "hover:bg-[#18181b]/50",
                );
            });

            const clickedBtn = e.currentTarget;
            clickedBtn.classList.remove(
                "text-zinc-400",
                "hover:text-zinc-200",
                "hover:bg-[#18181b]/50",
            );
            clickedBtn.classList.add(
                "bg-[#1a1a1a]",
                "text-white",
                "border",
                "border-zinc-800",
            );

            tabActivo = clickedBtn.getAttribute("data-tab");

            const viewEstadisticas =
                document.getElementById("view-estadisticas");
            const viewHistorial = document.getElementById("view-historial");
            const viewMapa = document.getElementById("view-mapa");

            if (tabActivo === "Estadisticas") {
                if (viewEstadisticas)
                    viewEstadisticas.classList.remove("hidden");
                if (viewHistorial) viewHistorial.classList.add("hidden");
                if (viewMapa) viewMapa.classList.add("hidden");

                actualizarEstadisticasVisuales();
                renderizarTablaModeracion();
            } else if (tabActivo === "Historial") {
                if (viewEstadisticas) viewEstadisticas.classList.add("hidden");
                if (viewHistorial) viewHistorial.classList.remove("hidden");
                if (viewMapa) viewMapa.classList.add("hidden");

                renderizarTablaHistorial();
            } else if (tabActivo === "Mapa") {
                if (viewEstadisticas) viewEstadisticas.classList.add("hidden");
                if (viewHistorial) viewHistorial.classList.add("hidden");
                if (viewMapa) viewMapa.classList.remove("hidden");

                renderizarAlertasRecientes();
                actualizarMarcadoresEnMapa(reportes);
            }
        });
    });

    const linkVerHistorial = document.getElementById("btn-ver-todo-historial");
    if (linkVerHistorial) {
        linkVerHistorial.addEventListener("click", () => {
            const btnHistorial = document.querySelector(
                '#sidebar-navigation button[data-tab="Historial"]',
            );
            if (btnHistorial) {
                btnHistorial.click();
            }
        });
    }

    const selectEstTiempo = document.getElementById("est-filtro-tiempo");
    if (selectEstTiempo) {
        selectEstTiempo.addEventListener("change", (e) => {
            filtroEstadisticasTiempo = e.target.value;
            actualizarEstadisticasVisuales();
        });
    }

    const btnExportar = document.getElementById("btn-exportar");
    if (btnExportar) {
        btnExportar.addEventListener("click", () => {
            Swal.fire({
                title: "Exportando Datos...",
                text: "Generando informe ejecutivo del cuadrante de bomberos en formato PDF.",
                icon: "info",
                timer: 1500,
                showConfirmButton: false,
                background: "#ffffff",
                color: "#09090b",
                customClass: {
                    popup: "border border-zinc-200 rounded-md shadow-none",
                },
            }).then(() => {
                Swal.fire({
                    title: "Informe Exportado",
                    text: "El reporte se ha descargado exitosamente.",
                    icon: "success",
                    confirmButtonColor: "#dc2626",
                    background: "#ffffff",
                    color: "#09090b",
                    customClass: {
                        popup: "border border-zinc-200 rounded-md shadow-none",
                    },
                });
            });
        });
    }

    const selectHistCat = document.getElementById("hist-filtro-categoria");
    if (selectHistCat) {
        selectHistCat.addEventListener("change", (e) => {
            filtroHistorialCategoria = e.target.value;
            renderizarTablaHistorial();
        });
    }

    const selectHistTiempo = document.getElementById("hist-filtro-tiempo");
    if (selectHistTiempo) {
        selectHistTiempo.addEventListener("change", (e) => {
            filtroHistorialTiempo = e.target.value;
            renderizarTablaHistorial();
        });
    }

    const selectHistOrden = document.getElementById("hist-orden-gravedad");
    if (selectHistOrden) {
        selectHistOrden.addEventListener("change", (e) => {
            ordenHistorialGravedad = e.target.value;
            renderizarTablaHistorial();
        });
    }

    const btnCerrarModal = document.getElementById("btn-cerrar-modal");
    const btnCancelarModal = document.getElementById("btn-cerrar-modal-accion");
    if (btnCerrarModal)
        btnCerrarModal.addEventListener("click", cerrarModalEvidencia);
    if (btnCancelarModal)
        btnCancelarModal.addEventListener("click", cerrarModalEvidencia);

    const modal = document.getElementById("modal-detalle-caso");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                cerrarModalEvidencia();
            }
        });
    }

    const btnSalir = document.getElementById("btn-salir");
    if (btnSalir) {
        btnSalir.addEventListener("click", () => {
            Swal.fire({
                title: "¿Confirmar Salida?",
                text: "¿Estás seguro que deseas cerrar sesión?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, salir",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#dc2626",
                cancelButtonColor: "#71717a",
                background: "#ffffff",
                color: "#09090b",
                customClass: {
                    popup: "rounded-md p-6 border border-zinc-200 bg-white max-w-sm w-full font-sans text-xs",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    if (typeof window.salirAlLogin === "function") {
                        window.salirAlLogin();
                    } else {
                        window.location.reload();
                    }
                }
            });
        });
    }
}

function formatearFechaHumana(fecha) {
    const coderAhora = new Date();
    const diffMs = coderAhora - fecha;
    const mins = Math.floor(diffMs / (1000 * 60));
    const horas = Math.floor(diffMs / (1000 * 60 * 60));

    if (mins < 1) return "Hace un momento";
    if (mins < 60) return `Hace ${mins} minutos`;
    if (horas < 24) return `Hace ${horas} ${horas === 1 ? "hora" : "horas"}`;
    return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
    });
}
