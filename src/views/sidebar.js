export function renderSidebar() {
  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogueado")) || { nombres: "Usuario", apellidos: "" };
  const nombreCompleto = `${usuario.nombres || 'Usuario'} ${usuario.apellidos || ''}`.trim();
  return `
<aside
  id="sidebar-aside"
  class="fixed top-0 left-0 h-screen w-72 bg-[#09090b] text-zinc-150 flex flex-col justify-between border-r border-zinc-850 z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 select-none font-sans px-6 py-8"> <!-- Botón cerrar móvil -->
      <div class="lg:hidden absolute top-4 right-4">
        <button id="btn-close-sidebar" class="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded focus:outline-none">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div>
        <!-- Logo -->
        <div class="flex items-center gap-3 pb-6 border-b border-zinc-850">
          <div class="flex h-8 w-8 items-center justify-center rounded bg-[#ea580c] text-xs font-bold text-white">K</div>
          <div>
            <p class="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Panel</p>
            <h2 class="text-sm font-semibold tracking-tight text-white">keepeR</h2>
          </div>
        </div>

        <!-- Usuario -->
        <div class="py-6 border-b border-zinc-850">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Usuario</p>
              <p class="mt-1 text-xs font-medium text-white">${nombreCompleto}</p>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400 border border-emerald-500/20">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Online
            </span>
          </div>
          <p class="mt-1 text-[10px] text-zinc-400">Monitoreo activo</p>
        </div>

        <!-- Navegacion Original (para Homepage) -->
        <nav class="mt-6 space-y-1">
          <button id="homepage-btn-inicio" class="homepage-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium bg-zinc-900 text-white border border-zinc-800">
            <svg class="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Inicio</span>
          </button>
          <button id="homepage-btn-rutas" class="homepage-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50">
            <svg class="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A2 2 0 013 15.485V6.764a2 2 0 011.118-1.789L9 2m0 18v-18m0 0l5.447-2.724A2 2 0 0116 2.515v8.722m3.882-1.448L21 10M17 14l3-3m0 0l3 3m-3-3v12" />
            </svg>
            <span>Rutas seguras</span>
          </button>

          <button id="homepage-btn-reportes"
              class="homepage-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50">
              <svg class="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Mis reportes</span>
          </button>

          <button id="homepage-btn-all-reportes"
              class="homepage-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50">
              <svg class="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Todos los reportes</span>
          </button>

          </button>
          <button id="homepage-btn-contactos" class="homepage-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50">
            <svg class="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Personas de Confianza</span>
          </button>
        </nav>
      </div>

      <!-- Salir -->
      <div class="pt-6 border-t border-zinc-850 mt-auto">
        <button id="homepage-btn-logout" class="flex w-full items-center justify-center gap-2 rounded border border-zinc-800 hover:bg-zinc-900 px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Salir del panel</span>
        </button>
      </div>
    </aside>
  `;
}
export function renderFeedSidebar() {
  const usuario = JSON.parse(sessionStorage.getItem("usuarioLogueado")) || { nombres: "Usuario", apellidos: "" };
  const nombreCompleto = `${usuario.nombres || 'Usuario'} ${usuario.apellidos || ''}`.trim();
  return `
    <aside id="sidebar-aside" class="w-72 max-w-[85vw] bg-[#09090b] text-zinc-150 flex flex-col justify-between border-r border-zinc-850 z-50 fixed inset-y-0 left-0 -translate-x-full transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shrink-0 select-none font-sans px-6 py-8">
      <!-- Botón cerrar móvil -->
      <div class="lg:hidden absolute top-4 right-4">
        <button id="btn-close-sidebar" class="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded focus:outline-none">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <!-- Logo -->
        <div class="flex items-center gap-3 pb-6 border-b border-zinc-850">
          <div class="flex h-8 w-8 items-center justify-center rounded bg-[#ea580c] text-xs font-bold text-white shrink-0">K</div>
          <div class="min-w-0">
            <p class="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Panel</p>
            <h2 class="text-sm font-semibold tracking-tight text-white">keepeR</h2>
          </div>
        </div>

        <!-- Usuario -->
        <div class="py-6 border-b border-zinc-850">
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Usuario</p>
              <p class="mt-1 text-xs font-medium text-white truncate">${nombreCompleto}</p>
            </div>
            <span class="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400 border border-emerald-500/20 shrink-0">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Online
            </span>
          </div>
          <p class="mt-1 text-[10px] text-zinc-400">Monitoreo activo</p>
        </div>

        <!-- Navegacion Dashboard -->
        <nav class="mt-6 space-y-1">
          <button id="sidebar-btn-usuarios" class="sidebar-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50">
            <svg class="h-4 w-4 text-zinc-550 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Usuarios</span>
          </button>
          
          <button id="sidebar-btn-reportes" class="sidebar-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50">
            <svg class="h-4 w-4 text-zinc-550 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Reportes</span>
          </button>

          <button id="sidebar-btn-estadisticas" class="sidebar-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50">
            <svg class="h-4 w-4 text-zinc-550 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            <span>Estadísticas</span>
          </button>
          
          <button id="sidebar-btn-mapa" class="sidebar-nav-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-medium bg-zinc-900 text-white border border-zinc-800">
            <svg class="h-4 w-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A2 2 0 013 15.485V6.764a2 2 0 011.118-1.789L9 2m0 18v-18m0 0l5.447-2.724A2 2 0 0116 2.515v8.722m3.882-1.448L21 10M17 14l3-3m0 0l3 3m-3-3v12" />
            </svg>
            <span>Mapa</span>
          </button>
        </nav>
      </div>

      <!-- Salir -->
      <div class="pt-6 border-t border-zinc-850 shrink-0">
        <button id="feed-btn-logout" class="flex w-full items-center justify-center gap-2 rounded border border-zinc-800 hover:bg-zinc-900 px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Salir del panel</span>
        </button>
      </div>
    </aside>
  `;
}


export function initFeedSidebarResponsive() {
  if (document.__feedSidebarResponsiveInit) return;
  document.__feedSidebarResponsiveInit = true;

  const getEls = () => ({
    sidebar: document.getElementById('sidebar-aside'),
    backdrop: document.getElementById('sidebar-backdrop'),
  });

  const abrirMenu = () => {
    const { sidebar, backdrop } = getEls();
    if (!sidebar || !backdrop) {
      console.warn('[sidebar-feed] No se encontró #sidebar-aside o #sidebar-backdrop en el DOM.');
      return;
    }
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.remove('hidden');
  };

  const cerrarMenu = () => {
    const { sidebar, backdrop } = getEls();
    if (!sidebar || !backdrop) return;
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  };

  const toggleMenu = () => {
    const { sidebar } = getEls();
    if (!sidebar) return;
    if (sidebar.classList.contains('-translate-x-full')) {
      abrirMenu();
    } else {
      cerrarMenu();
    }
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-toggle-sidebar')) {
      toggleMenu();
      return;
    }
    if (e.target.closest('#btn-close-sidebar')) {
      cerrarMenu();
      return;
    }
    if (e.target.id === 'sidebar-backdrop') {
      cerrarMenu();
      return;
    }
    if (e.target.closest('.sidebar-nav-btn') && window.innerWidth < 1024) {
      cerrarMenu();
    }
  });

  // Si la ventana pasa a tamaño desktop (lg) con el menú móvil abierto,
  // asegura que el backdrop quede oculto.
  window.addEventListener('resize', () => {
    const { backdrop } = getEls();
    if (window.innerWidth >= 1024 && backdrop) {
      backdrop.classList.add('hidden');
    }
  });
}

initFeedSidebarResponsive();