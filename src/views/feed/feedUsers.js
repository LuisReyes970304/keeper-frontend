import { feedState } from './feedState.js';
import Swal from 'sweetalert2';
import { createUser, getAllUsers, deleteUser, updateUser } from '../../services/endpoints/user.js';

export function renderUsersTable() {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  if (feedState.listUsers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-8 text-center text-zinc-400 font-medium">No hay usuarios registrados.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = feedState.listUsers.map(user => `
    <tr class="hover:bg-zinc-50/50 transition-colors">
      <td class="py-4 pr-4 font-semibold text-zinc-900">${user.nombre} ${user.apellido}</td>
      <td class="py-4 pr-4 text-zinc-500 font-mono">${user.cedula}</td>
      <td class="py-4 pr-4 text-zinc-500">${user.email}</td>
      <td class="py-4 pr-4 text-zinc-500">${user.telefono}</td>
      <td class="py-4 pr-4 text-zinc-500">${user.fechaNacimiento}</td>
      <td class="py-4 pr-4">
        <select data-id="${user.id}" class="select-user-rol-inline text-[10px] font-semibold border rounded px-2.5 py-1 cursor-pointer focus:outline-none ${
          user.rol === 'Administrador' ? 'bg-purple-50 text-purple-750 border-purple-200' :
          user.rol === 'Bombero' ? 'bg-red-50 text-red-700 border-red-200' :
          user.rol === 'Policia' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          user.rol === 'Ambulancia' ? 'bg-emerald-50 text-emerald-750 border-emerald-200' :
          'bg-zinc-50 text-zinc-650 border-zinc-200'
        }">
          <option value="Usuario" ${user.rol === 'Usuario' ? 'selected' : ''} class="bg-white text-zinc-800">Usuario</option>
          <option value="Bombero" ${user.rol === 'Bombero' ? 'selected' : ''} class="bg-white text-zinc-800">Bombero</option>
          <option value="Policia" ${user.rol === 'Policia' ? 'selected' : ''} class="bg-white text-zinc-800">Policia</option>
          <option value="Ambulancia" ${user.rol === 'Ambulancia' ? 'selected' : ''} class="bg-white text-zinc-800">Ambulancia</option>
          <option value="Administrador" ${user.rol === 'Administrador' ? 'selected' : ''} class="bg-white text-zinc-800">Administrador</option>
        </select>
      </td>
      <td class="py-4 text-right space-x-2 font-bold text-[11px] whitespace-nowrap">
        <button data-id="${user.id}" class="btn-user-edit inline-flex items-center gap-1 rounded border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-2.5 py-1 text-[10px] font-bold transition-colors">
          <svg class="h-3 w-3 text-zinc-450" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Actualizar</span>
        </button>
        <button data-id="${user.id}" class="btn-user-delete inline-flex items-center gap-1 rounded border border-red-100 hover:bg-red-50 text-red-650 px-2.5 py-1 text-[10px] font-bold transition-colors">
          <svg class="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Eliminar</span>
        </button>
      </td>
    </tr>
  `).join('');

  attachUserActions();
}

export function attachUserActions() {
  // Manejo de cambio de rol inline directamente desde la tabla
  document.querySelectorAll('.select-user-rol-inline').forEach(select => {
    select.addEventListener('change', (e) => {
      const id = parseInt(select.dataset.id);
      const user = feedState.listUsers.find(u => u.id === id);
        if (user) {
          const newRol = e.target.value;
          let id_rol = 2; // Ciudadano
          if (newRol === 'Policia') id_rol = 3;
          else if (newRol === 'Bombero') id_rol = 4;
          else if (newRol === 'Ambulancia') id_rol = 5;
          else if (newRol === 'Administrador') id_rol = 1;

          updateUser(id, { id_rol: id_rol }).then(() => {
              user.rol = newRol;
              renderUsersTable(); // Refrescar para actualizar clases de color del select

              Swal.fire({
                icon: 'success',
                title: '<h3 class="text-xs font-semibold text-zinc-900 text-left">Rol Modificado</h3>',
                html: `<p class="text-[11px] text-zinc-500 text-left">El rol de <strong>${user.nombre}</strong> ahora es <strong>${newRol}</strong> en la base de datos real.</p>`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                customClass: { popup: 'rounded-md p-4 border border-zinc-200 bg-white max-w-xs' }
              });
          }).catch(err => {
              console.error("Error actualizando rol:", err);
              Swal.fire('Error', 'No se pudo actualizar el rol.', 'error');
              renderUsersTable(); // Revert
          });
        }
      });
    });

    // Abrir modal de edicion
    document.querySelectorAll('.btn-user-edit').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const user = feedState.listUsers.find(u => u.id === id);
      if (user) openUserFormModal(user);
    });
  });

  document.querySelectorAll('.btn-user-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const user = feedState.listUsers.find(u => u.id === id);
      if (!user) return;

      Swal.fire({
        title: '<h3 class="text-sm font-semibold text-zinc-900 text-left">Confirmar Eliminación</h3>',
        html: `<p class="text-xs text-zinc-500 text-left">¿Estás seguro de que deseas eliminar permanentemente a <strong>${user.nombre} ${user.apellido}</strong> de la red vecinal?</p>`,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-xs w-full font-sans',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors mr-2',
          cancelButton: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold px-3 py-1.5 rounded transition-colors'
        }
        }).then(async result => {
          if (result.isConfirmed) {
            try {
                await deleteUser(id);
                feedState.listUsers = feedState.listUsers.filter(u => u.id !== id);
                renderUsersTable();
                Swal.fire({
                  icon: 'success',
                  title: '<h3 class="text-xs font-semibold text-zinc-900 text-left">Usuario Eliminado</h3>',
                  html: `<p class="text-[11px] text-zinc-500 text-left"><strong>${user.nombre} ${user.apellido}</strong> ha sido eliminado del sistema.</p>`,
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 2000,
                  customClass: { popup: 'rounded-md p-4 border border-zinc-200 bg-white max-w-xs' }
                });
            } catch (err) {
                console.error("Error eliminando usuario:", err);
                Swal.fire('Error', 'No se pudo eliminar el usuario de la base de datos real.', 'error');
            }
          }
        });
    });
  });
}

export function openUserFormModal(user = null) {
  Swal.fire({
    title: `<div class="text-left font-sans"><h3 class="text-base font-semibold text-zinc-900">${user ? 'Editar Usuario' : 'Nuevo Usuario'}</h3><p class="text-zinc-500 mt-1 text-xs leading-relaxed">Completa todos los campos requeridos del registro.</p></div>`,
    html: `
      <form id="swal-user-crud-form" class="space-y-4 mt-4 text-left font-sans">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Nombre</label>
            <input id="user-nombre" type="text" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Ej. Juan" value="${user ? user.nombre : ''}">
          </div>
          <div>
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Apellido</label>
            <input id="user-apellido" type="text" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Ej. Pérez" value="${user ? user.apellido : ''}">
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Cédula de Identidad</label>
          <input id="user-cedula" type="text" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Número de cédula" value="${user ? user.cedula : ''}">
        </div>

        <div>
          <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Correo electrónico</label>
          <input id="user-email" type="email" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 placeholder-zinc-400 bg-white" placeholder="tu@email.com" value="${user ? user.email : ''}">
        </div>

        <div>
          <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Teléfono</label>
          <input id="user-telefono" type="tel" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Ej. +57 320 530 22 45" value="${user ? user.telefono : ''}">
        </div>

        <div>
          <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Fecha de nacimiento</label>
          <input id="user-fecha-nacimiento" type="date" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 bg-white" value="${user ? user.fechaNacimiento : ''}">
        </div>

        <div>
          <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Rol</label>
          <select id="user-rol" class="w-full px-3 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 bg-white">
            <option value="Usuario" ${user && user.rol === 'Usuario' ? 'selected' : ''}>Usuario</option>
            <option value="Bombero" ${user && user.rol === 'Bombero' ? 'selected' : ''}>Bombero</option>
            <option value="Policia" ${user && user.rol === 'Policia' ? 'selected' : ''}>Policia</option>
            <option value="Ambulancia" ${user && user.rol === 'Ambulancia' ? 'selected' : ''}>Ambulancia</option>
            <option value="Administrador" ${user && user.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
          </select>
        </div>

        ${!user ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="relative">
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Contraseña</label>
            <input id="user-password" type="password" class="w-full pl-3 pr-8 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Mínimo 8 caracteres">
            <button type="button" id="toggle-user-password" class="absolute right-2.5 top-[23px] text-zinc-400 hover:text-zinc-600 transition-colors flex items-center justify-center h-6 w-6">
              <svg id="eye-open-1" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg id="eye-closed-1" class="h-4 w-4 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
          <div class="relative">
            <label class="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Confirmar contraseña</label>
            <input id="user-password-confirm" type="password" class="w-full pl-3 pr-8 py-2 border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-xs text-zinc-800 placeholder-zinc-400 bg-white" placeholder="Repetir contraseña">
            <button type="button" id="toggle-user-password-confirm" class="absolute right-2.5 top-[23px] text-zinc-400 hover:text-zinc-600 transition-colors flex items-center justify-center h-6 w-6">
              <svg id="eye-open-2" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg id="eye-closed-2" class="h-4 w-4 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
        </div>
        ` : ''}

        <div id="user-modal-error" class="text-xs font-semibold text-red-500 text-center"></div>

        <button id="user-modal-submit" type="button" class="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-medium py-2.5 rounded text-xs transition-colors mt-2 uppercase tracking-wider font-semibold">
          ${user ? 'Guardar Cambios' : 'Crear Usuario'}
        </button>
      </form>
    `,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-md w-full font-sans',
      cancelButton: 'w-full mt-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold py-2 rounded transition-colors text-center'
    },
    didOpen: () => {
      const submitBtn = document.getElementById('user-modal-submit');
      const errorEl = document.getElementById('user-modal-error');

      // Control de visibilidad de contraseñas
      const togglePassBtn1 = document.getElementById('toggle-user-password');
      const passInput1 = document.getElementById('user-password');
      const eyeOpen1 = document.getElementById('eye-open-1');
      const eyeClosed1 = document.getElementById('eye-closed-1');

      togglePassBtn1?.addEventListener('click', () => {
        if (passInput1.type === 'password') {
          passInput1.type = 'text';
          eyeOpen1.classList.add('hidden');
          eyeClosed1.classList.remove('hidden');
        } else {
          passInput1.type = 'password';
          eyeOpen1.classList.remove('hidden');
          eyeClosed1.classList.add('hidden');
        }
      });

      const togglePassBtn2 = document.getElementById('toggle-user-password-confirm');
      const passInput2 = document.getElementById('user-password-confirm');
      const eyeOpen2 = document.getElementById('eye-open-2');
      const eyeClosed2 = document.getElementById('eye-closed-2');

      togglePassBtn2?.addEventListener('click', () => {
        if (passInput2.type === 'password') {
          passInput2.type = 'text';
          eyeOpen2.classList.add('hidden');
          eyeClosed2.classList.remove('hidden');
        } else {
          passInput2.type = 'password';
          eyeOpen2.classList.remove('hidden');
          eyeClosed2.classList.add('hidden');
        }
      });

      submitBtn.addEventListener('click', () => {
        const nombre = document.getElementById('user-nombre').value.trim();
        const apellido = document.getElementById('user-apellido').value.trim();
        const cedula = document.getElementById('user-cedula').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const telefono = document.getElementById('user-telefono').value.trim();
        const fechaNacimiento = document.getElementById('user-fecha-nacimiento').value;
        const rol = document.getElementById('user-rol').value;

        if (!nombre || !apellido || !cedula || !email || !telefono || !fechaNacimiento) {
          errorEl.textContent = 'Por favor, complete todos los campos.';
          return;
        }

        if (!user) {
          const password = document.getElementById('user-password').value;
          const confirmPassword = document.getElementById('user-password-confirm').value;

          if (password.length < 8) {
            errorEl.textContent = 'La contraseña debe tener al menos 8 caracteres.';
            return;
          }
          if (password !== confirmPassword) {
            errorEl.textContent = 'Las contraseñas no coinciden.';
            return;
          }
        }


        
        let id_rol = 2; // Ciudadano
        if (rol === 'Policia') id_rol = 3;
        else if (rol === 'Bombero') id_rol = 4;
        else if (rol === 'Ambulancia') id_rol = 5;
        else if (rol === 'Administrador') id_rol = 1;


        if (user) {
          // Update user in DB
          Swal.fire({ title: 'Actualizando...', text: 'Guardando en la base de datos', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
          
          updateUser(user.id, {
            nombres: nombre,
            apellidos: apellido,
            cedula: cedula,
            correo: email,
            telefono: telefono,
            fecha_nacimiento: fechaNacimiento,
            id_rol: id_rol
          }).then(() => {
              user.nombre = nombre;
              user.apellido = apellido;
              user.cedula = cedula;
              user.email = email;
              user.telefono = telefono;
              user.fechaNacimiento = fechaNacimiento;
              user.rol = rol;
              renderUsersTable();
              Swal.close();
              Swal.fire({
                icon: 'success',
                title: `<h3 class="text-sm font-semibold text-zinc-900 text-left">Usuario Actualizado</h3>`,
                html: `<p class="text-xs text-zinc-500 text-left">El miembro ha sido modificado exitosamente.</p>`,
                showConfirmButton: false, timer: 2000, buttonsStyling: false,
                customClass: { popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-xs w-full' }
              });
          }).catch(err => {
              Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
          });
        } else {
          // Create real user in DB
          const newUser = {
            id_rol: id_rol,
            nombres: nombre,
            apellidos: apellido,
            cedula: cedula,
            correo: email,
            telefono: telefono,
            fecha_nacimiento: fechaNacimiento,
            password_hash: document.getElementById('user-password').value
          };
          
          Swal.fire({ title: 'Creando...', text: 'Guardando en la base de datos', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
          
          createUser(newUser).then(() => {
             // Refresh list from DB if possible, or just add locally for now
             feedState.listUsers.push({
                id: Date.now(), nombre, apellido, cedula, email, telefono, fechaNacimiento, rol
             });
             renderUsersTable();
             Swal.close();
             Swal.fire({
               icon: 'success',
               title: `<h3 class="text-sm font-semibold text-zinc-900 text-left">Usuario Creado</h3>`,
               html: `<p class="text-xs text-zinc-500 text-left">El miembro ha sido añadido exitosamente a la base de datos real.</p>`,
               showConfirmButton: false, timer: 2000, buttonsStyling: false,
               customClass: { popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-xs w-full' }
             });
          }).catch(err => {
             Swal.fire('Error', 'No se pudo crear el usuario: ' + (err.response?.data?.detail || err.message), 'error');
          });
          return;
        }


        Swal.fire({
          icon: 'success',
          title: `<h3 class="text-sm font-semibold text-zinc-900 text-left">${user ? 'Usuario Actualizado' : 'Usuario Creado'}</h3>`,
          html: `<p class="text-xs text-zinc-500 text-left">El miembro ha sido ${user ? 'modificado' : 'añadido'} exitosamente.</p>`,
          showConfirmButton: false,
          timer: 2000,
          buttonsStyling: false,
          customClass: { popup: 'rounded-md p-6 border border-zinc-200 bg-white max-w-xs w-full' }
        });
      });
    }
  });
}
