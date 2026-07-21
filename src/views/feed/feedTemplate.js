import { renderFeedSidebar } from '../sidebar.js';

export function renderFeed() {
  return `
    <section class="min-h-screen bg-[#f9fafb] text-zinc-900 font-sans">
      <div class="flex min-h-screen flex-col lg:flex-row">
        <!-- Backdrop para móvil -->
        <div id="sidebar-backdrop" class="fixed inset-0 bg-black/40 z-40 hidden lg:hidden backdrop-blur-sm transition-opacity duration-300"></div>

        ${renderFeedSidebar()}

        <!-- Contenedor del contenido principal + Header Móvil -->
        <div class="flex-1 flex flex-col min-w-0">
          <!-- Header Móvil -->
          <header class="w-full bg-[#09090b] text-white px-4 sm:px-6 py-4 flex items-center justify-between lg:hidden border-b border-zinc-850 shrink-0 select-none sticky top-0 z-30">
            <div class="flex items-center gap-3">
              <div class="bg-[#ea580c] text-white p-1 rounded font-bold w-8 h-8 flex items-center justify-center text-sm shrink-0">K</div>
              <span class="text-sm font-bold tracking-tight mt-0.5">keepeR</span>
            </div>
            <button id="btn-toggle-sidebar" class="p-1.5 hover:bg-zinc-900 rounded transition-colors text-zinc-400 hover:text-white focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>

          <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          <div class="w-full">
            
            <!-- CONTENIDO TAB: ESTADÍSTICAS (El feed que tenemos actualmente) -->
            <div id="tab-content-estadisticas" class="hidden space-y-6">
              
              <!-- Header Section -->
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                  <p class="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">Monitoreo</p>
                  <h1 class="text-lg sm:text-xl font-bold text-zinc-900 mt-1">Resumen Estratégico</h1>
                  <p class="text-xs text-zinc-500 mt-1">Seguimiento de incidentes en tiempo real y métricas de seguridad vecinal.</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button id="btn-toggle-days" class="rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">Últimos 3 días</button>
                  <button id="btn-export-report" class="rounded bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors">Exportar reporte</button>
                </div>
              </div>

              <!-- Stats Grid -->
              <div class="grid gap-6 lg:grid-cols-3">
                
                <!-- Graph Card -->
                <div class="lg:col-span-2 bg-white border border-zinc-200 rounded-md p-4 sm:p-6">
                  <div class="mb-6 flex flex-wrap items-center justify-between gap-2">
                    <p class="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">Índice de Confianza Semanal</p>
                    <span id="stats-trend-percent" class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">+12.4% vs mes anterior</span>
                  </div>
                  
                  <div class="relative h-40 sm:h-48 pt-4 w-full">
                    <canvas id="confianzaChart" class="w-full h-full"></canvas>
                  </div>
                </div>

                <!-- Indicators Sidecard -->
                <div class="flex flex-col gap-6">
                  
                  <!-- Dark Sidecard -->
                  <div class="bg-zinc-950 border border-zinc-800 rounded-md p-4 sm:p-6 text-white flex flex-col justify-between">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <p class="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">Incidentes Activos</p>
                        <p id="stats-active-incidents" class="text-3xl sm:text-4xl font-bold mt-2">28</p>
                      </div>
                      <span class="inline-flex items-center gap-1.5 rounded bg-orange-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shrink-0">
                        <span class="relative flex h-1.5 w-1.5">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </span>
                        En vivo
                      </span>
                    </div>
                    
                    <div class="mt-6 pt-4 border-t border-zinc-800">
                      <p class="text-[9px] font-semibold uppercase tracking-wider text-zinc-500">Tiempo medio de respuesta</p>
                      <p id="stats-response-time" class="text-sm font-semibold mt-1">4m 12s</p>
                    </div>
                  </div>

                  <!-- Sector List Sidecard -->
                  <div class="bg-white border border-zinc-200 rounded-md p-4 sm:p-6">
                    <p class="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 mb-4">Incidentes por Sector</p>
                    <div class="space-y-3">
                      <div>
                        <div class="flex justify-between text-xs font-medium text-zinc-700 mb-1">
                          <span>Sector Norte</span>
                          <span id="stats-sector-norte-count">42</span>
                        </div>
                        <div class="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                          <div id="stats-sector-norte-bar" class="h-full bg-zinc-850 rounded-full transition-all duration-500" style="width: 42%"></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-xs font-medium text-zinc-700 mb-1">
                          <span>Plaza Central</span>
                          <span id="stats-sector-central-count">29</span>
                        </div>
                        <div class="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                          <div id="stats-sector-central-bar" class="h-full bg-zinc-850 rounded-full transition-all duration-500" style="width: 29%"></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-xs font-medium text-zinc-700 mb-1">
                          <span>Zona Industrial</span>
                          <span id="stats-sector-industrial-count" class="text-orange-600">64</span>
                        </div>
                        <div class="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                          <div id="stats-sector-industrial-bar" class="h-full bg-[#ea580c] rounded-full transition-all duration-500" style="width: 64%"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Moderation Table Section -->
              <div class="bg-white border border-zinc-200 rounded-md p-4 sm:p-6">
                <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 class="text-sm font-bold text-zinc-900">Cola de Moderación</h3>
                    <p class="text-xs text-zinc-500 mt-1">Filtrar y verificar reportes entrantes.</p>
                  </div>
                  <button id="btn-ver-historial" class="text-xs font-semibold text-[#ea580c] hover:underline transition-all">Ver todo el historial →</button>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full min-w-[720px] text-left text-xs text-zinc-700 border-collapse">
                    <thead>
                      <tr class="border-b border-zinc-200 text-zinc-400 font-semibold uppercase tracking-wider text-[9px] pb-2">
                        <th class="pb-3 pr-4">ID</th>
                        <th class="pb-3 pr-4">Tipo</th>
                        <th class="pb-3 pr-4">Reportado Por</th>
                        <th class="pb-3 pr-4">Fecha/Hora</th>
                        <th class="pb-3 pr-4">Estado</th>
                        <th class="pb-3 pr-4">Acción</th>
                        <th class="pb-3 text-right">Opciones</th>
                      </tr>
                    </thead>
                    <tbody id="reportes-feed-table-body" class="divide-y divide-zinc-100">
                      <!-- Renderizado Dinámico de la Cola de Moderación -->
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <!-- CONTENIDO TAB: USUARIOS -->
            <div id="tab-content-usuarios" class="hidden space-y-6">
              <!-- Header Section -->
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                  <p class="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">Comunidad</p>
                  <h1 class="text-lg sm:text-xl font-bold text-zinc-900 mt-1">Gestión de Usuarios</h1>
                  <p class="text-xs text-zinc-500 mt-1">Administra los miembros de la red colaborativa de seguridad.</p>
                </div>
                <div>
                  <button id="btn-create-user" class="rounded bg-zinc-950 hover:bg-zinc-850 px-3 py-1.5 text-xs font-semibold text-white transition-colors">Nuevo Usuario</button>
                </div>
              </div>

              <!-- Users Table Card -->
              <div class="bg-white border border-zinc-200 rounded-md p-4 sm:p-6">
                <div class="overflow-x-auto">
                  <table class="w-full min-w-[820px] text-left text-xs text-zinc-700 border-collapse">
                    <thead>
                      <tr class="border-b border-zinc-200 text-zinc-400 font-semibold uppercase tracking-wider text-[9px] pb-2">
                        <th class="pb-3 pr-4">Nombre y Apellido</th>
                        <th class="pb-3 pr-4">Cédula</th>
                        <th class="pb-3 pr-4">Correo Electrónico</th>
                        <th class="pb-3 pr-4">Teléfono</th>
                        <th class="pb-3 pr-4">F. Nacimiento</th>
                        <th class="pb-3 pr-4">Rol</th>
                        <th class="pb-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody id="users-table-body" class="divide-y divide-zinc-100">
                      <!-- Renderizado Dinámico del CRUD -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- CONTENIDO TAB: REPORTES -->
            <div id="tab-content-reportes" class="hidden space-y-6">
              <!-- Header Section -->
              <div class="mb-2">
                <p class="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">Seguridad</p>
                <h1 class="text-lg sm:text-xl font-bold text-zinc-900 mt-1">Historial de Reportes</h1>
                <p class="text-xs text-zinc-500 mt-1">Listado completo de incidentes y problemas informados en el sector.</p>
              </div>

              <!-- Reports Table Card -->
              <div class="bg-white border border-zinc-200 rounded-md p-4 sm:p-6">
                <div class="overflow-x-auto">
                  <table class="w-full min-w-[900px] text-left text-xs text-zinc-700 border-collapse">
                    <thead>
                      <tr class="border-b border-zinc-200 text-zinc-400 font-semibold uppercase tracking-wider text-[9px] pb-2">
                        <th class="pb-3 pr-4">ID</th>
                        <th class="pb-3 pr-4">Tipo de Incidente</th>
                        <th class="pb-3 pr-4">Descripción</th>
                        <th class="pb-3 pr-4">Ubicación</th>
                        <th class="pb-3 pr-4">Fecha</th>
                        <th class="pb-3 pr-4">Estado</th>
                        <th class="pb-3 pr-4">Acción</th>
                        <th class="pb-3 pr-4 text-right">Opciones</th>
                      </tr>
                    </thead>
                    <tbody id="historial-reportes-table-body" class="divide-y divide-zinc-100">
                      <!-- Renderizado Dinámico del Historial de Reportes -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- CONTENIDO TAB: MAPA -->
            <div id="tab-content-mapa" class="space-y-6">
              <!-- Header Section -->
              <div class="mb-2">
                <p class="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">Seguridad Vecinal</p>
                <h1 class="text-lg sm:text-xl font-bold text-zinc-900 mt-1">Centro de Control y Monitoreo</h1>
                <p class="text-xs text-zinc-500 mt-1">Visualiza patrullas, reportes y geocercas en tiempo real sobre el mapa del sector.</p>
              </div>

              <!-- Map Container -->
              <div id="map" class="relative w-full h-[380px] sm:h-[480px] lg:h-[600px] rounded-lg border border-zinc-200 bg-zinc-950 overflow-hidden shadow-sm">
                
                <div id="feed-map-container" class="absolute inset-0 z-0 w-full h-full bg-zinc-950"></div>

                <!-- Barra de búsqueda superior flotante -->
                <div class="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-96 z-10 flex gap-2">
                  <div class="relative w-full">
                    <input id="map-search-input" type="text" placeholder="Buscar dirección, cuadrante o patrulla..." class="w-full pl-9 pr-4 py-2 border border-zinc-800 bg-zinc-900/95 text-white rounded text-xs focus:outline-none focus:border-orange-500 shadow-lg backdrop-blur-sm placeholder-zinc-500">
                    <svg class="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>


                <!-- Indicador de señal / Estado de conexión en la parte inferior izquierda -->
                <div class="absolute bottom-4 left-4 right-4 sm:right-auto z-10 bg-zinc-950/90 border border-zinc-800 rounded px-2.5 py-1 flex items-center gap-2 text-white shadow-lg backdrop-blur-sm w-fit">
                  <span class="relative flex h-2 w-2 shrink-0">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span class="text-[9px] font-bold tracking-wide uppercase text-zinc-300 truncate">Conexión Live: GPS Activo</span>
                </div>

              </div>
            </div>

          </div>
        </main>
        </div>
      </div>
    </section>
  `;
}