import Swal from 'sweetalert2';
import { createUser } from '../../services/endpoints/user.js';

export function initRegisterModal(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener('click', () => {
    Swal.fire({
      title: '<div class="text-left font-sans"><h3 class="text-base font-semibold text-zinc-900">Crear Cuenta</h3><p class="text-zinc-500 mt-1 text-xs leading-relaxed">Únete a la red colaborativa de seguridad ciudadana.</p></div>',
      html: `
        <form id="swal-register-form" class="space-y-4 mt-4 text-left font-sans">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Nombre</label>
              <input id="reg-nombre" type="text" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs transition-colors text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Ej. Juan">
            </div>
            <div>
              <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Apellido</label>
              <input id="reg-apellido" type="text" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs transition-colors text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Ej. Pérez">
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Cédula de Identidad</label>
            <input id="reg-cedula" type="text" inputmode="numeric" pattern="[0-9]*" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs transition-colors text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Número de cédula">
          </div>

          <div>
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Correo electrónico</label>
            <input id="reg-email" type="email" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs transition-colors text-zinc-800 placeholder-zinc-400 bg-white" placeholder="tu@email.com">
          </div>

          <div>
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Teléfono</label>
            <input id="reg-telefono" type="tel" inputmode="tel" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs transition-colors text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Ej. +57 320 530 22 45">
          </div>

          <div>
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Fecha de nacimiento</label>
            <input id="reg-fecha-nacimiento" type="date" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs transition-colors text-zinc-800 bg-white">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="relative">
              <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Contraseña</label>
              <input id="reg-password" type="password" class="w-full pl-3 pr-8 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs transition-colors text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Mínimo 8 caracteres">
              <button type="button" id="toggle-reg-password" class="absolute right-2.5 top-[23px] text-zinc-400 hover:text-zinc-650 transition-colors flex items-center justify-center h-6 w-6">
                <svg id="reg-eye-open-1" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg id="reg-eye-closed-1" class="h-4 w-4 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
            <div class="relative">
              <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Confirmar contraseña</label>
              <input id="reg-password-confirm" type="password" class="w-full pl-3 pr-8 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs transition-colors text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Repetir contraseña">
              <button type="button" id="toggle-reg-password-confirm" class="absolute right-2.5 top-[23px] text-zinc-400 hover:text-zinc-650 transition-colors flex items-center justify-center h-6 w-6">
                <svg id="reg-eye-open-2" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg id="reg-eye-closed-2" class="h-4 w-4 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <div id="reg-error" class="text-xs font-medium text-red-500 text-center"></div>

          <button id="reg-submit" class="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-medium py-2.5 rounded text-xs transition-colors mt-2 uppercase tracking-wider font-semibold">
            Crear cuenta
          </button>

          <p class="text-center text-xs text-zinc-500 mt-4">
            ¿Ya tienes cuenta? <a href="#" id="switch-to-login" class="text-[#ea580c] hover:underline font-semibold">Inicia sesión</a>
          </p>
          
          <p class="text-[9px] text-zinc-400 text-center mt-4 leading-relaxed">
            Al registrarte, aceptas nuestros <a href="#" class="underline hover:text-zinc-600">Términos de Servicio</a> y <a href="#" class="underline hover:text-zinc-600">Política de Privacidad</a>.
          </p>
        </form>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-md w-full font-sans',
      },
      didOpen: () => {
        const switchLink = document.getElementById('switch-to-login');
        if (switchLink) {
          switchLink.addEventListener('click', (event) => {
            event.preventDefault();
            Swal.close();
            document.getElementById('btn-login')?.click();
          });
        }

        // Control de visibilidad de contraseñas para Registro
        const toggleRegPassBtn1 = document.getElementById('toggle-reg-password');
        const regPassInput1 = document.getElementById('reg-password');
        const regEyeOpen1 = document.getElementById('reg-eye-open-1');
        const regEyeClosed1 = document.getElementById('reg-eye-closed-1');

        toggleRegPassBtn1?.addEventListener('click', () => {
          if (regPassInput1.type === 'password') {
            regPassInput1.type = 'text';
            regEyeOpen1.classList.add('hidden');
            regEyeClosed1.classList.remove('hidden');
          } else {
            regPassInput1.type = 'password';
            regEyeOpen1.classList.remove('hidden');
            regEyeClosed1.classList.add('hidden');
          }
        });

        const toggleRegPassBtn2 = document.getElementById('toggle-reg-password-confirm');
        const regPassInput2 = document.getElementById('reg-password-confirm');
        const regEyeOpen2 = document.getElementById('reg-eye-open-2');
        const regEyeClosed2 = document.getElementById('reg-eye-closed-2');

        toggleRegPassBtn2?.addEventListener('click', () => {
          if (regPassInput2.type === 'password') {
            regPassInput2.type = 'text';
            regEyeOpen2.classList.add('hidden');
            regEyeClosed2.classList.remove('hidden');
          } else {
            regPassInput2.type = 'password';
            regEyeOpen2.classList.remove('hidden');
            regEyeClosed2.classList.add('hidden');
          }
        });

        const submitBtn = document.getElementById('reg-submit');
        const errEl = document.getElementById('reg-error');
        if (submitBtn) {
          submitBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            if (errEl) errEl.textContent = '';

            const nombre = document.getElementById('reg-nombre')?.value?.trim();
            const apellido = document.getElementById('reg-apellido')?.value?.trim();
            const cedula = document.getElementById('reg-cedula')?.value?.trim();
            const email = document.getElementById('reg-email')?.value?.trim();
            const telefono = document.getElementById('reg-telefono')?.value?.trim();
            const fechaNacimiento = document.getElementById('reg-fecha-nacimiento')?.value?.trim();
            const password = document.getElementById('reg-password')?.value || '';
            const passwordConfirm = document.getElementById('reg-password-confirm')?.value || '';

            if (!nombre || !apellido || !cedula || !email || !telefono || !fechaNacimiento || !password || !passwordConfirm) {
              if (errEl) errEl.textContent = 'Por favor completa todos los campos.';
              return;
            }
            if (password.length < 8) {
              if (errEl) errEl.textContent = 'La contraseña debe tener al menos 8 caracteres.';
              return;
            }
            if (password !== passwordConfirm) {
              if (errEl) errEl.textContent = 'Las contraseñas no coinciden.';
              return;
            }

            const newUser = {
              id_rol: 2, // 2 = Ciudadano
              nombres: nombre,
              apellidos: apellido,
              cedula: cedula,
              correo: email,
              telefono: telefono,
              fecha_nacimiento: fechaNacimiento,
              password_hash: password
            };

            Swal.fire({ title: 'Registrando...', text: 'Creando cuenta', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            createUser(newUser).then(() => {
                Swal.close();
                Swal.fire({
                  icon: 'success',
                  title: '<h3 class="text-sm font-semibold text-zinc-900 text-left">Registro completado</h3>',
                  html: '<p class="text-xs text-zinc-500 text-left">Tu cuenta ha sido creada. Ahora puedes iniciar sesión.</p>',
                  showConfirmButton: false,
                  timer: 2000,
                  buttonsStyling: false,
                  customClass: { popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-xs w-full' }
                });
            }).catch(err => {
                Swal.fire('Error', 'No se pudo crear el usuario: ' + (err.response?.data?.detail || err.message), 'error');
            });
          });
        }
      }
    });
  });
}
