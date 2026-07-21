import { feedState } from './feedState.js';
import Swal from 'sweetalert2';

export function exportReportToPDF() {
  const currentRange = feedState.showingThreeDays ? 'Últimos 3 días' : 'Últimos 30 días';
  const activeIncidents = document.getElementById('stats-active-incidents')?.textContent || '28';
  const responseTime = document.getElementById('stats-response-time')?.textContent || '4m 12s';
  const trend = document.getElementById('stats-trend-percent')?.textContent || '+12.4% vs mes anterior';
  
  const secNorte = document.getElementById('stats-sector-norte-count')?.textContent || '42';
  const secCentral = document.getElementById('stats-sector-central-count')?.textContent || '29';
  const secIndustrial = document.getElementById('stats-sector-industrial-count')?.textContent || '64';

  let tableRowsHtml = '';
  feedState.listReportesFeed.forEach(r => {
    tableRowsHtml += `
      <tr style="border-bottom: 1px solid #e4e4e7;">
        <td style="padding: 10px 0; font-family: monospace; font-weight: bold; color: #18181b;">${r.id}</td>
        <td style="padding: 10px 0; color: #27272a;">${r.tipo}</td>
        <td style="padding: 10px 0; color: #71717a;">${r.reportadoPor}</td>
        <td style="padding: 10px 0; color: #71717a;">${r.fecha}</td>
        <td style="padding: 10px 0;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; border: 1px solid #e4e4e7;
            background: ${r.estado === 'Pendiente' ? '#fff7ed' : r.estado === 'En revisión' ? '#eff6ff' : '#f0fdf4'};
            color: ${r.estado === 'Pendiente' ? '#c2410c' : r.estado === 'En revisión' ? '#1d4ed8' : '#15803d'};">
            ${r.estado}
          </span>
        </td>
        <td style="padding: 10px 0; font-weight: 500; color: #3f3f46;">${r.accion}</td>
      </tr>
    `;
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    Swal.fire({
      icon: 'warning',
      title: '<h3 class="text-sm font-semibold text-zinc-900 text-left">Bloqueador de ventanas activado</h3>',
      html: '<p class="text-xs text-zinc-500 text-left">Por favor, permite las ventanas emergentes en tu navegador para poder generar el reporte PDF.</p>',
      showConfirmButton: true,
      buttonsStyling: false,
      customClass: { popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-xs w-full font-sans' }
    });
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Reporte de Seguridad Vecinal - Keeper</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #18181b;
            margin: 40px;
            font-size: 12px;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e4e4e7;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 20px;
            font-weight: 900;
            color: #ea580c;
            letter-spacing: -0.025em;
          }
          .meta {
            text-align: right;
            color: #71717a;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            margin-top: 0;
            color: #09090b;
          }
          .grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .card {
            border: 1px solid #e4e4e7;
            border-radius: 6px;
            padding: 20px;
            background: #fafafa;
          }
          .card-title {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: #71717a;
            letter-spacing: 0.05em;
            margin-top: 0;
            margin-bottom: 10px;
          }
          .large-number {
            font-size: 32px;
            font-weight: 900;
            color: #09090b;
            margin: 0;
          }
          .trend {
            font-size: 11px;
            color: #16a34a;
            font-weight: 600;
          }
          .table-title {
            font-size: 14px;
            font-weight: 700;
            margin-top: 30px;
            margin-bottom: 15px;
            color: #09090b;
            border-bottom: 1px solid #e4e4e7;
            padding-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            padding: 8px 0;
            border-bottom: 2px solid #e4e4e7;
            color: #71717a;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <span class="logo">KEEPER</span>
            <div style="font-size: 10px; color: #71717a; margin-top: 4px;">Red de Seguridad Vecinal Colaborativa</div>
          </div>
          <div class="meta">
            <div><strong>Filtro:</strong> ${currentRange}</div>
            <div><strong>Exportado el:</strong> ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <h1 class="title">Informe Ejecutivo de Seguridad</h1>
        <p style="color: #52525b; margin-top: -10px; margin-bottom: 30px; font-size: 13px;">Resumen del monitoreo de incidentes, índice de confianza y estado de atención a reportes vecinales en el cuadrante.</p>

        <div class="grid">
          <div class="card">
            <h3 class="card-title">Índice de Confianza</h3>
            <p class="large-number" style="color: #ea580c;">94%</p>
            <span class="trend">${trend}</span>
          </div>
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 class="card-title">Métricas de Atención</h3>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #71717a;">Incidentes Activos:</span>
                <strong style="color: #18181b;">${activeIncidents}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #71717a;">Tiempo de Respuesta Promedio:</span>
                <strong style="color: #18181b;">${responseTime}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom: 30px;">
          <h3 class="card-title">Incidentes por Sector</h3>
          <div style="display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 20px; text-align: center; margin-top: 10px;">
            <div>
              <div style="font-size: 11px; color: #71717a;">Sector Norte</div>
              <div style="font-size: 20px; font-weight: 800; color: #18181b; margin-top: 5px;">${secNorte}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #71717a;">Plaza Central</div>
              <div style="font-size: 20px; font-weight: 800; color: #18181b; margin-top: 5px;">${secCentral}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #71717a;">Zona Industrial</div>
              <div style="font-size: 20px; font-weight: 800; color: #ea580c; margin-top: 5px;">${secIndustrial}</div>
            </div>
          </div>
        </div>

        <div class="table-title">Cola de Moderación de Incidentes</div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Reportado Por</th>
              <th>Fecha/Hora</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div style="margin-top: 60px; border-top: 1px solid #e4e4e7; padding-top: 20px; text-align: center; color: #a1a1aa; font-size: 10px;">
          Este informe es confidencial y para uso exclusivo de la Red de Seguridad Keeper. Generado de forma automática por la consola de administración.
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
