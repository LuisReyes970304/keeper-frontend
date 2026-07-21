import Swal from 'sweetalert2';
import { authenticateLogin } from '../../services/endpoints/auth';

export async function initLoginModal(buttonId, onSuccess) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener('click', async () => {
    Swal.fire({
      title: '<h3 class="text-base font-semibold text-zinc-900 tracking-tight text-left">Iniciar Sesión</h3>',
      html: `
        <p class="text-xs text-zinc-500 mb-4 leading-relaxed text-left">
          Ingresa a tu cuenta de <strong class="text-zinc-800 font-semibold">keepeR</strong> para ver alertas y reportes en tiempo real.
        </p>
        <div class="space-y-4 text-left font-sans">
          <div>
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
            <input id="swal-login-email" type="email" class="w-full px-3 py-2 rounded border border-zinc-200 focus:outline-none focus:border-zinc-400 text-xs transition-colors text-zinc-800 placeholder-zinc-400 bg-white" placeholder="tucorreo@ejemplo.com" autocomplete="email">
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Contraseña</label>
              <a href="#" class="text-[10px] text-[#ea580c] hover:underline font-medium">¿Olvidaste tu contraseña?</a>
            </div>
            <input id="swal-login-password" type="password" class="w-full px-3 py-2 rounded border border-zinc-200 focus:outline-none focus:border-zinc-400 text-xs transition-colors text-zinc-800 placeholder-zinc-400 bg-white" placeholder="••••••••" autocomplete="current-password">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Entrar a mi cuenta',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      buttonsStyling: false, 
      customClass: {
        popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-md w-full font-sans',
        title: 'p-0 mb-2',
        htmlContainer: 'm-0 p-0',
        actions: 'mt-6 flex justify-end space-x-2 w-full',
        confirmButton: 'bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded transition-colors',
        cancelButton: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-4 py-2 rounded transition-colors'
      },
      didOpen: async() => {
        const emailInput = document.getElementById('swal-login-email');
        const passInput = document.getElementById('swal-login-password');
        
        const handleEnter = (e) => {
          if (e.key === 'Enter') {
            Swal.clickConfirm();
          }
        };
        
        emailInput?.addEventListener('keypress', handleEnter);
        passInput?.addEventListener('keypress', handleEnter);
      },
      preConfirm: async () => {
        const email = document.getElementById('swal-login-email').value;
        const password = document.getElementById('swal-login-password').value;

        try {
            const respuesta = await authenticateLogin({
                correo: email,
                contrasena: password
            });

            return respuesta; // Login exitoso

        } catch (error) {
            Swal.showValidationMessage(
                error.response?.data?.detail || "Ocurrió un error al iniciar sesión."
            );

            return false; // Evita que el modal se cierre
        }

      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: '<h3 class="text-sm font-semibold text-zinc-900 text-left">Sesión Iniciada</h3>',
          html: `<p class="text-xs text-zinc-500 text-left">Bienvenido de nuevo. Accediendo al panel...</p>`,
          timer: 1500,
          showConfirmButton: false,
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-xs w-full font-sans'
          }
        }).then(() => {
          if (typeof onSuccess === 'function') {
            onSuccess(result.value);
          }
        });
      }
    });
  });
}
