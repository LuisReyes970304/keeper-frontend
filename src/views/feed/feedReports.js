import { feedState } from './feedState.js';
import Swal from 'sweetalert2';
import { deleteReport } from '../../services/endpoints/reports.js';

export function renderReportesFeedTable() {
  const tbody = document.getElementById('reportes-feed-table-body');
  if (!tbody) return;

  tbody.innerHTML = feedState.listReportesFeed.map(report => `
    <tr class="hover:bg-zinc-50/50 transition-colors">
      <td class="py-4 pr-4 font-semibold text-zinc-955">${report.id}</td>
      <td class="py-4 pr-4 text-zinc-800 font-medium">
        <span class="inline-flex items-center gap-1.5 rounded bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-755 border border-zinc-200">
            ${report.tipo}
        </span>
      </td>
      <td class="py-4 pr-4 text-zinc-500">${report.reportadoPor}</td>
      <td class="py-4 pr-4 text-zinc-500">${report.fecha}</td>
      <td class="py-4 pr-4">
        <select data-id="${report.id}" class="select-report-estado text-[10px] font-semibold border rounded px-2 py-0.5 cursor-pointer focus:outline-none ${
          report.estado === 'Pendiente' ? 'bg-orange-50 text-orange-700 border-orange-200' :
          report.estado === 'En revisión' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          'bg-emerald-50 text-emerald-700 border-emerald-200'
        }">
          <option value="Pendiente" ${report.estado === 'Pendiente' ? 'selected' : ''} class="bg-white text-zinc-800">Pendiente</option>
          <option value="En revisión" ${report.estado === 'En revisión' ? 'selected' : ''} class="bg-white text-zinc-800">En revisión</option>
          <option value="Completado" ${report.estado === 'Completado' ? 'selected' : ''} class="bg-white text-zinc-800">Completado</option>
        </select>
      </td>
      <td class="py-4 font-medium ${report.accion !== '?' ? 'text-zinc-855 font-semibold' : 'text-zinc-400'}">${report.accion}</td>
      <td class="py-4 text-right flex justify-end gap-2">
        <button data-id="${report.id}" class="btn-report-view inline-flex items-center gap-1 rounded border border-blue-200 hover:bg-blue-50 text-blue-600 px-2 py-1 text-[10px] font-bold transition-colors">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver
        </button>
        <button data-id="${report.id}" class="btn-report-delete inline-flex items-center gap-1 rounded border border-red-200 hover:bg-red-50 text-red-600 px-2 py-1 text-[10px] font-bold transition-colors">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar
        </button>
      </td>
    </tr>
  `).join('');

  attachReportListeners();
}

export function renderHistorialReportesTable() {
  const tbody = document.getElementById('historial-reportes-table-body');
  if (!tbody) return;

  tbody.innerHTML = feedState.listHistorialReportes.map(report => `
    <tr class="hover:bg-zinc-50/50 transition-colors">
      <td class="py-4 pr-4 font-semibold text-zinc-955">${report.id}</td>
      <td class="py-4 pr-4 text-zinc-800 font-medium">
        <span class="inline-flex items-center gap-1.5 rounded bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-755 border border-zinc-200">
            ${report.tipo}
        </span>
      </td>
      <td class="py-4 pr-4 text-zinc-650 max-w-xs truncate font-medium" title="${report.descripcion || '?' }">${report.descripcion || '?' }</td>
      <td class="py-4 pr-4 text-zinc-500">${report.ubicacion}</td>
      <td class="py-4 pr-4 text-zinc-500">${report.fecha}</td>
      <td class="py-4 pr-4">
        <select data-id="${report.id}" class="select-historial-estado text-[10px] font-semibold border rounded px-2 py-0.5 cursor-pointer focus:outline-none ${
          report.estado === 'Pendiente' ? 'bg-orange-50 text-orange-700 border-orange-200' :
          report.estado === 'En revisión' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          'bg-emerald-50 text-emerald-700 border-emerald-200'
        }">
          <option value="Pendiente" ${report.estado === 'Pendiente' ? 'selected' : ''} class="bg-white text-zinc-800">Pendiente</option>
          <option value="En revisión" ${report.estado === 'En revisión' ? 'selected' : ''} class="bg-white text-zinc-800">En revisión</option>
          <option value="Completado" ${report.estado === 'Completado' ? 'selected' : ''} class="bg-white text-zinc-800">Completado</option>
        </select>
      </td>
      <td class="py-4 font-medium ${report.accion !== '?' ? 'text-zinc-855 font-semibold' : 'text-zinc-400'}">${report.accion}</td>
      <td class="py-4 text-right flex justify-end gap-2">
        <button data-id="${report.id}" class="btn-report-view inline-flex items-center gap-1 rounded border border-blue-200 hover:bg-blue-50 text-blue-600 px-2 py-1 text-[10px] font-bold transition-colors">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver
        </button>
        <button data-id="${report.id}" class="btn-report-delete inline-flex items-center gap-1 rounded border border-red-200 hover:bg-red-50 text-red-600 px-2 py-1 text-[10px] font-bold transition-colors">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar
        </button>
      </td>
    </tr>
  `).join('');

  attachReportListeners();
}

function attachReportListeners() {
  document.querySelectorAll('.select-report-estado, .select-historial-estado').forEach(select => {
    // Evitar multiples listeners clonando el select
    const newSelect = select.cloneNode(true);
    select.parentNode.replaceChild(newSelect, select);
    
    newSelect.addEventListener('change', (e) => {
      const id = newSelect.dataset.id;
      const reportFeed = feedState.listReportesFeed.find(r => r.id === id);
      const reportHist = feedState.listHistorialReportes.find(r => r.id === id);
      
      const usuario = JSON.parse(sessionStorage.getItem("usuarioLogueado")) || { nombres: "Admin" };
      const nombreCompleto = `${usuario.nombres || 'Admin'}`.trim();

      if (reportFeed) {
          reportFeed.estado = e.target.value;
          reportFeed.accion = nombreCompleto;
      }
      if (reportHist) {
          reportHist.estado = e.target.value;
          reportHist.accion = nombreCompleto;
      }

      renderReportesFeedTable();
      renderHistorialReportesTable();

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Reporte ${id} actualizado por ${nombreCompleto}`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: { popup: 'rounded border border-zinc-200 bg-white font-sans text-xs' }
      });
    });
  });


  document.querySelectorAll('.btn-report-view').forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
      const id = newBtn.dataset.id;
      const report = feedState.listHistorialReportes.find(r => r.id === id) || feedState.listReportesFeed.find(r => r.id === id);
      
      if (!report || !report.evidencias || report.evidencias.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin imágenes',
          text: 'Este reporte no tiene evidencias adjuntas.'
        });
        return;
      }

      let imagesHtml = '<div class="flex overflow-x-auto gap-4 p-2 snap-x">';
      report.evidencias.forEach(ev => {
        imagesHtml += `<img src="http://127.0.0.1:8000${ev.url}" class="h-64 object-cover rounded shadow snap-center flex-shrink-0" alt="Evidencia">`;
      });
      imagesHtml += '</div>';

      Swal.fire({
        title: `Evidencias del Reporte ${id}`,
        html: imagesHtml,
        width: '600px',
        showCloseButton: true,
        showConfirmButton: false,
        customClass: { popup: 'rounded-xl border border-zinc-200 bg-white font-sans' }
      });
    });
  });

  document.querySelectorAll('.btn-report-delete').forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', async () => {
      const id = newBtn.dataset.id;
      const numericId = parseInt(id.replace("KP-", ""), 10);

      const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: "No podrás revertir esto. El reporte será eliminado.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
          try {
              await deleteReport(numericId);
              
              feedState.listReportesFeed = feedState.listReportesFeed.filter(r => r.id !== id);
              feedState.listHistorialReportes = feedState.listHistorialReportes.filter(r => r.id !== id);
              
              renderReportesFeedTable();
              renderHistorialReportesTable();

              Swal.fire({
                  icon: 'success',
                  title: 'Eliminado!',
                  text: 'El reporte ha sido eliminado de la base de datos.',
                  timer: 2000,
                  showConfirmButton: false
              });
          } catch (e) {
              console.error("Error eliminando reporte:", e);
              Swal.fire('Error', 'Hubo un problema al intentar eliminar el reporte.', 'error');
          }
      }
    });
  });
}
