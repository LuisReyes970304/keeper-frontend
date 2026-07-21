import { renderFeed } from './feed/feedTemplate.js';
import { feedState } from './feed/feedState.js';
import { renderUsersTable, openUserFormModal } from './feed/feedUsers.js';
import { renderReportesFeedTable, renderHistorialReportesTable } from './feed/feedReports.js';
import { exportReportToPDF } from './feed/feedPdf.js';
import { findAddress } from '../services/findAddress.js';
import Swal from 'sweetalert2';
import { actualizarMarcadoresEnMapa } from '../controllers/mapReport.controller.js';
import { getAllReports } from '../services/endpoints/reports.js';
import { getAllUsers } from '../services/endpoints/user.js';
import Chart from 'chart.js/auto';

let confianzaChartInstance = null;

export { renderFeed };

// -------------------------------------------------------------
// CONTROLADOR DE PESTAÑAS (TABS) & MAPAS
// -------------------------------------------------------------
export async function initFeed() {
  const btnUsuarios = document.getElementById('sidebar-btn-usuarios');
  const btnReportes = document.getElementById('sidebar-btn-reportes');
  const btnEstadisticas = document.getElementById('sidebar-btn-estadisticas');
  const btnMapa = document.getElementById('sidebar-btn-mapa');

  const tabEstadisticas = document.getElementById('tab-content-estadisticas');
  const tabUsuarios = document.getElementById('tab-content-usuarios');
  const tabReportes = document.getElementById('tab-content-reportes');
  const tabMapa = document.getElementById('tab-content-mapa');


  // Fetch data from backend
  try {
      const data = await getAllReports();
      const adapted = (data || []).map(r => ({
          id: `KP-${r.id_reporte || r.id}`,
          tipo: r.categoria_nombre || r.tipo || "General",
          descripcion: r.descripcion,
          evidencias: r.evidencias || [],
          ubicacion: (r.titulo || r.ubicacion_geografica || "").replace(/.*? en /, '') || "Desconocida",
          fecha: new Date(r.fecha_hora_creacion || r.fecha_reporte || r.fecha || Date.now()).toLocaleString(),
          estado: r.nombre_estado || r.estado || "Pendiente",
          lat: parseFloat(r.latitud || r.lat) || 0,
          lng: parseFloat(r.longitud || r.lng) || 0,
          reportadoPor: r.usuario_nombre || "Desconocido",
          accion: '?'
      }));
      
      // Calcular métricas reales
      const reportCounts30 = [0, 0, 0, 0, 0, 0, 0];
      const reportCounts3 = [0, 0, 0, 0, 0, 0, 0];
      const now = new Date();
      (data || []).forEach(r => {
          const d = new Date(r.fecha_hora_creacion || r.fecha_reporte || r.fecha || Date.now());
          const diffDays = Math.ceil(Math.abs(now - d) / (1000 * 60 * 60 * 24));
          let dayIdx = d.getDay() - 1;
          if (dayIdx === -1) dayIdx = 6;
          
          if (diffDays <= 30) reportCounts30[dayIdx]++;
          if (diffDays <= 3) reportCounts3[dayIdx]++;
      });
      
      feedState.data30Days.bars = reportCounts30.map(count => Math.max(20, 100 - (count * 6)));
      feedState.data3Days.bars = reportCounts3.map(count => Math.max(20, 100 - (count * 6)));
      
      const activosCount = (data || []).filter(r => String(r.id_estado) === "1" || String(r.estado).toLowerCase() === "pendiente").length;
      feedState.data30Days.active = activosCount.toString();
      feedState.data3Days.active = activosCount.toString();

      feedState.listHistorialReportes = [...adapted];
      feedState.listReportesFeed = adapted.slice(0, 5); // top 5 recent
      feedState.data30Days.reports = adapted.slice(0, 5);
      feedState.data3Days.reports = adapted.slice(0, 5);
  } catch (e) {
      console.error("Error cargando reportes en admin feed:", e);
  }
  try {
      const usersData = await getAllUsers();
      const mappedUsers = (usersData || []).map(u => {
          let roleName = "Usuario";
          if (u.id_rol === 1) roleName = "Administrador";
          else if (u.id_rol === 2) roleName = "Usuario";
          else if (u.id_rol === 3) roleName = "Policia";
          else if (u.id_rol === 4) roleName = "Bombero";
          else if (u.id_rol === 5) roleName = "Ambulancia";
          
          return {
              id: u.id_usuario,
              nombre: u.nombres || "Sin nombre",
              apellido: u.apellidos || "",
              cedula: u.cedula || "N/A",
              email: u.correo || "N/A",
              telefono: u.telefono || "N/A",
              fechaNacimiento: u.fecha_nacimiento || "N/A",
              rol: roleName
          };
      });
      feedState.listUsers = [...mappedUsers];
  } catch (e) {
      console.error("Error cargando usuarios en admin feed:", e);
  }

  // Inicializar renderizado de tablas
  renderUsersTable();
  renderReportesFeedTable();
  renderHistorialReportesTable();

  // Inicializar Chart.js
  const ctx = document.getElementById('confianzaChart');
  if (ctx && !confianzaChartInstance) {
    const initialData = feedState.showingThreeDays ? feedState.data3Days.bars : feedState.data30Days.bars;
    const numericData = initialData.map(val => parseInt(val, 10));
    confianzaChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Índice de Confianza (%)',
          data: numericData,
          backgroundColor: '#ea580c',
          borderRadius: 4,
          hoverBackgroundColor: '#c2410c'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
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
  }

  // Conectar botones de creación de cabeceras
  const createBtn = document.getElementById('btn-create-user');
  if (createBtn) {
    createBtn.addEventListener('click', () => openUserFormModal());
  }

  // Conectar botón "Ver todo el historial" en Estadísticas
  const btnVerHistorial = document.getElementById('btn-ver-historial');
  if (btnVerHistorial) {
    btnVerHistorial.addEventListener('click', () => {
      switchTab(btnReportes, tabReportes);
    });
  }

  // Conectar botón de alternancia Últimos 3 días / 30 días
  const btnToggleDays = document.getElementById('btn-toggle-days');
  btnToggleDays?.addEventListener('click', () => {
    feedState.showingThreeDays = !feedState.showingThreeDays;
    const currentData = feedState.showingThreeDays ? feedState.data3Days : feedState.data30Days;
    
    // Cambiar texto del botón
    btnToggleDays.textContent = feedState.showingThreeDays ? 'Últimos 30 días' : 'Últimos 3 días';
    
    // Actualizar tendencia
    const trendEl = document.getElementById('stats-trend-percent');
    if (trendEl) trendEl.textContent = currentData.trend;
    
    // Actualizar incidentes activos y tiempo de respuesta
    const activeEl = document.getElementById('stats-active-incidents');
    if (activeEl) activeEl.textContent = currentData.active;
    
    const responseEl = document.getElementById('stats-response-time');
    if (responseEl) responseEl.textContent = currentData.responseTime;
    
    // Actualizar barras del gráfico semanal con Chart.js
    if (confianzaChartInstance) {
      confianzaChartInstance.data.datasets[0].data = currentData.bars.map(val => parseInt(val, 10));
      confianzaChartInstance.update();
    }
    
    // Actualizar sectores
    const norteCount = document.getElementById('stats-sector-norte-count');
    const norteBar = document.getElementById('stats-sector-norte-bar');
    if (norteCount && norteBar) {
      norteCount.textContent = currentData.sectores.norte;
      norteBar.style.width = `${currentData.sectores.norte}%`;
    }
    
    const centralCount = document.getElementById('stats-sector-central-count');
    const centralBar = document.getElementById('stats-sector-central-bar');
    if (centralCount && centralBar) {
      centralCount.textContent = currentData.sectores.central;
      centralBar.style.width = `${currentData.sectores.central}%`;
    }
    
    const industrialCount = document.getElementById('stats-sector-industrial-count');
    const industrialBar = document.getElementById('stats-sector-industrial-bar');
    if (industrialCount && industrialBar) {
      industrialCount.textContent = currentData.sectores.industrial;
      industrialBar.style.width = `${currentData.sectores.industrial}%`;
    }
    
    // Actualizar cola de moderación
    feedState.listReportesFeed = JSON.parse(JSON.stringify(currentData.reports));
    renderReportesFeedTable();

    // Notificación toast informativa
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: `Visualizando datos de los ${feedState.showingThreeDays ? 'últimos 3 días' : 'últimos 30 días'}`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: { popup: 'rounded border border-zinc-200 bg-white font-sans text-xs' }
    });
  });

  // Conectar botón de exportar reporte
  const btnExportReport = document.getElementById('btn-export-report');
  if (btnExportReport) {
    btnExportReport.addEventListener('click', () => {
      exportReportToPDF();
    });
  }

  const buttons = [
    { btn: btnUsuarios, tab: tabUsuarios },
    { btn: btnReportes, tab: tabReportes },
    { btn: btnEstadisticas, tab: tabEstadisticas },
    { btn: btnMapa, tab: tabMapa }
  ];

  function switchTab(activeBtn, activeTab) {
    buttons.forEach(item => {
      if (item.btn && item.tab) {
        if (item.btn === activeBtn) {
          item.btn.className = "sidebar-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium bg-zinc-900 text-white border border-zinc-800";
          const icon = item.btn.querySelector('svg');
          if (icon) {
            icon.classList.remove('text-zinc-550', 'text-zinc-500');
            icon.classList.add('text-zinc-400');
          }
          item.tab.classList.remove('hidden');
        } else {
          item.btn.className = "sidebar-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50";
          const icon = item.btn.querySelector('svg');
          if (icon) {
            icon.classList.remove('text-zinc-400');
            icon.classList.add('text-zinc-550');
          }
          item.tab.classList.add('hidden');
        }
      }
    });
  }

  if (btnUsuarios) btnUsuarios.addEventListener('click', () => switchTab(btnUsuarios, tabUsuarios));
  if (btnReportes) btnReportes.addEventListener('click', () => switchTab(btnReportes, tabReportes));
  if (btnEstadisticas) btnEstadisticas.addEventListener('click', () => switchTab(btnEstadisticas, tabEstadisticas));
  if (btnMapa) btnMapa.addEventListener('click', () => switchTab(btnMapa, tabMapa));

  // Buscador de direcciones en el mapa usando el servicio findAddress de Luis
  const mapSearchInput = document.getElementById('map-search-input');
  if (mapSearchInput) {
    findAddress(mapSearchInput);
  }
}

// -------------------------------------------------------------
// ENTRADA DE REPORTES DESDE EXTERNOS (HOMEPAGE / SOS)
// -------------------------------------------------------------
export function addFeedReport(report) {
  // Aseguramos que la cola de moderación reciba el reporte
  const feedReport = {
    id: report.id.startsWith('#') ? report.id : `#${report.id}`,
    tipo: report.tipo,
    reportadoPor: 'Vecino Anónimo',
    fecha: report.fecha || 'Hace un momento',
    estado: report.estado || 'Pendiente',
    accion: '—'
  };
  feedState.listReportesFeed.unshift(feedReport);

  // Aseguramos que el historial completo reciba el reporte
  const historyReport = {
    id: report.id.startsWith('#') ? report.id : `#${report.id}`,
    tipo: report.tipo,
    descripcion: report.descripcion || '—',
    ubicacion: report.ubicacion || 'Ubicación Manual',
    fecha: report.fecha || 'Hace un momento',
    estado: report.estado || 'Pendiente',
    evidencia: null,
    accion: '—',
    lat: report.lat || null,
    lng: report.lng || null
  };
  feedState.listHistorialReportes.unshift(historyReport);

  // Si las tablas están actualmente dibujadas en el DOM, las refrescamos
  renderReportesFeedTable();
  renderHistorialReportesTable();
  actualizarMarcadoresEnMapa(feedState.listHistorialReportes);
}
