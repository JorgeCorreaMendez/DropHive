import { enviarCodigo } from './enviarCorreo.js';
import { pedirCodigoVerificacion } from './verificarCodigo.js';
import { solicitarNuevaContrasena, cambiarContrasena } from './cambiarContraseña.js';

const apiBase = 'http://127.0.0.1:4000';

async function checkIfMailExists(email) {
  const res = await fetch(`${apiBase}/check_mail?mail=${email}`);
  if (!res.ok) return null;
  return res.json();
}

export async function mandarCorreo() {
  const modal = document.getElementById('loadingModal');
  const email = document.getElementById("mail").value;

  try {
    const data = await checkIfMailExists(email);
    if (!data) {
      await Swal.fire({
        icon: 'error',
        title: 'Correo no encontrado',
        text: 'Te redirigiremos para registrarte.',
        confirmButtonText: 'Aceptar'
      });
      window.location.href = `${apiBase}/register`;
      return;
    }

    localStorage.setItem("db_name", data.dbname);

    modal.classList.remove('hidden');
    await enviarCodigo(email, apiBase);
    modal.classList.add('hidden');

    const code = await pedirCodigoVerificacion(apiBase);
    if (!code) return;

    const passwordData = await solicitarNuevaContrasena();
    if (!passwordData) return;

    await cambiarContrasena(email, passwordData.password, apiBase);

    await Swal.fire({
      icon: 'success',
      title: 'Contraseña actualizada',
      text: 'Ya puedes iniciar sesión con tu nueva contraseña.',
      timer: 3000,
      showConfirmButton: false
    });

    window.location.href = `${apiBase}/login`;

  } catch (e) {
    modal.classList.add('hidden');
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: e.message || 'Inténtalo de nuevo más tarde.'
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('enviarCorreoBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Evita el envío del formulario si está dentro de uno
      mandarCorreo();
    });
  }
});