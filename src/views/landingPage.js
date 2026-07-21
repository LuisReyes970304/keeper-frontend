export const landingPage = `
    <!-- Navbar con Botón de Logueo -->
    <header class="w-full bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="src/assets/logo.png" alt="keepeR Logo" class="h-10 object-contain">
          <span class="text-lg font-bold text-slate-900">keepeR</span>
        </div>
        
        <!-- Enlaces de navegación - Desktop -->
        <nav class="hidden md:flex space-x-8 font-medium text-gray-650 items-center text-sm">
          <a href="#" class="hover:text-orange-600 transition-colors">Inicio</a>
          <a href="#caracteristicas" class="hover:text-orange-600 transition-colors">Características</a>
          <a href="#comunidad" class="hover:text-orange-600 transition-colors">Comunidad</a>
        </nav>

        <!-- Acciones del Navbar (Login) - Desktop -->
        <div class="hidden md:flex items-center">
          <button id="btn-login" class="text-xs font-bold text-slate-700 hover:text-orange-600 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-orange-50/50 transition-colors">
            Iniciar Sesión
          </button>
        </div>

        <!-- Boton Hamburguesa - Mobile -->
        <button id="btn-menu-toggle" type="button" class="md:hidden p-2 text-slate-600 hover:text-orange-600 focus:outline-none" aria-label="Toggle menu">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Menu Desplegable Mobile -->
      <div id="mobile-menu" class="hidden md:hidden border-b border-gray-200 bg-white/95 backdrop-blur-md absolute top-16 left-0 w-full z-30 shadow-md">
        <div class="px-6 py-4 flex flex-col space-y-3">
          <a href="#" class="mobile-menu-link text-sm font-medium text-gray-700 hover:text-orange-600 py-1 transition-colors">Inicio</a>
          <a href="#caracteristicas" class="mobile-menu-link text-sm font-medium text-gray-700 hover:text-orange-600 py-1 transition-colors">Características</a>
          <a href="#comunidad" class="mobile-menu-link text-sm font-medium text-gray-700 hover:text-orange-600 py-1 transition-colors">Comunidad</a>
          <div class="border-t border-gray-100 pt-3">
            <button id="btn-login-mobile" class="w-full text-center text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 px-4 py-2.5 rounded-lg transition-colors shadow-sm">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <span class="inline-block bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full font-semibold tracking-wide">
          ⚡ VIGILANCIA ACTIVA 24/7
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Tu Ciudad, <br>
          <span class="text-orange-600">Más Segura</span> <br>
          que Nunca
        </h1>
        <p class="text-lg text-slate-600 max-w-md leading-relaxed">
          Únete a la red colaborativa de seguridad ciudadana que está transformando comunidades. Tecnología de vanguardia para tu tranquilidad y la de los tuyos.
        </p>
        
        <div class="flex flex-wrap gap-3">
          <button id="btn-unirme" class="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-orange-600/20 transform hover:-translate-y-0.5 transition active:translate-y-0 text-lg">
            <span>Unirme Ahora</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Imagen Mockup Celular -->
      <div class="relative flex justify-center lg:justify-end hero-image">
        <div class="absolute inset-0 bg-linear-to-tr from-orange-400/10 to-transparent rounded-full filter blur-3xl -z-10 max-w-lg mx-auto"></div>
        <img src="/src/assets/hero.png" alt="keepeR App" class="w-[500%] max-w-none drop-shadow-2xl">
      </div>
    </main>

    <!-- SECCIÓN 2: Características -->
    <section id="caracteristicas" class="bg-white py-20 border-t border-slate-100">
      <div class="max-w-4xl mx-auto px-6 text-center mb-16">
        <h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">Por qué elegir keepeR</h2>
        <p class="mt-4 text-slate-500 text-base max-w-2xl mx-auto">
          Diseñado para la vida urbana moderna, donde la información es el arma más poderosa para la prevención.
        </p>
      </div>

      <div class="max-w-5xl mx-auto px-6 grid gap-8 md:grid-cols-3">
        <div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A2 2 0 013 15.485V6.764a2 2 0 011.118-1.789L9 2m0 18v-18m0 0l5.447-2.724A2 2 0 0116 2.515v8.722m3.882-1.448L21 10M17 14l3-3m0 0l3 3m-3-3v12" /></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Rutas Seguras</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-4">
            Nuestro algoritmo analiza reportes en tiempo real para sugerirte el camino más iluminado y transitado hacia tu destino.
          </p>
          <ul class="space-y-2 text-xs font-semibold text-slate-500">
            <li class="flex items-center space-x-2"><span class="text-orange-500">✓</span> <span>IA Predictiva</span></li>
            <li class="flex items-center space-x-2"><span class="text-orange-500">✓</span> <span>Mapas de calor</span></li>
          </ul>
        </div>

        <div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Alertas en Vivo</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-4">
            Recibe notificaciones instantáneas sobre incidentes cerca de tu ubicación actual o tus rutas frecuentes.
          </p>
          <ul class="space-y-2 text-xs font-semibold text-slate-500">
            <li class="flex items-center space-x-2"><span class="text-orange-500">✓</span> <span>Reportes inmediatos</span></li>
            <li class="flex items-center space-x-2"><span class="text-orange-500">✓</span> <span>Geofencing inteligente</span></li>
          </ul>
        </div>

        <div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Comunidad Activa</h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-4">
            Conéctate con tus vecinos y crea redes de apoyo locales para reportar situaciones sospechosas y cuidarse entre todos.
          </p>
          <ul class="space-y-2 text-xs font-semibold text-slate-500">
            <li class="flex items-center space-x-2"><span class="text-orange-500">✓</span> <span>Verificación de usuarios</span></li>
            <li class="flex items-center space-x-2"><span class="text-orange-500">✓</span> <span>Chat vecinal seguro</span></li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 3: Estadísticas y Testimonios -->
    <section id="comunidad" class="bg-slate-50 py-16 lg:py-24">
      <div class="max-w-4xl mx-auto px-6">
        <div class="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-900 space-y-12">
          <div class="space-y-4">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
              Llevamos la Vigilancia al Siguiente Nivel
            </h2>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
            <div>
              <p class="text-3xl sm:text-4xl font-black text-orange-500">98%</p>
              <p class="text-xs text-slate-400 mt-1 font-medium">Precisión en Reportes</p>
            </div>
            <div>
              <p class="text-3xl sm:text-4xl font-black text-orange-500">2.4m</p>
              <p class="text-xs text-slate-400 mt-1 font-medium">Reportes Validados</p>
            </div>
            <div>
              <p class="text-3xl sm:text-4xl font-black text-orange-500">15min</p>
              <p class="text-xs text-slate-400 mt-1 font-medium">Tiempo de Respuesta</p>
            </div>
            <div>
              <p class="text-3xl sm:text-4xl font-black text-orange-500">500+</p>
              <p class="text-xs text-slate-400 mt-1 font-medium">Ciudades Activas</p>
            </div>
          </div>

          <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg">
            <p class="text-slate-300 italic text-sm sm:text-base leading-relaxed">
              "Desde que usamos keepeR en el barrio, los incidentes han bajado un 40%. La tranquilidad no tiene precio."
            </p>
            <div class="flex items-center space-x-3 pt-2">
              <div class="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-xs text-white">
                CM
              </div>
              <div>
                <h4 class="text-sm font-bold text-white">Carlos Mendoza</h4>
                <p class="text-xs text-slate-400 font-medium">Presidente Junta Vecinal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 4: Call To Action Footer -->
    <footer class="bg-slate-50 text-center pb-20 pt-8 border-t border-slate-200/60">
      <div class="max-w-md mx-auto px-6 space-y-4">
        <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ¿Listo para transformar tu seguridad?
        </h3>
        <p class="text-sm text-slate-500 font-medium leading-relaxed">
          Comienza a utilizar keepeR hoy y forma parte de una comunidad comprometida con una ciudad más conectada y protegida..
        </p>
        <p class="text-xs text-slate-400 mt-4">
          © 2024 keepeR. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  `;
