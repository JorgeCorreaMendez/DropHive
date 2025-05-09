export async function solicitarNuevaContrasena() {
  const { value } = await Swal.fire({
    title: 'Cambia tu contraseña',
    html:
      '<input id="swal-password" type="password" class="swal2-input" placeholder="Nueva contraseña">' +
      '<input id="swal-confirm" type="password" class="swal2-input" placeholder="Confirmar contraseña">',
    focusConfirm: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: 'Guardar',
    preConfirm: () => {
      const password = document.getElementById('swal-password').value;
      const confirm = document.getElementById('swal-confirm').value;

      if (!password || !confirm) {
        Swal.showValidationMessage('Ambos campos son obligatorios');
        return false;
      }
      if (password !== confirm) {
        Swal.showValidationMessage('Las contraseñas no coinciden');
        return false;
      }
      if (password.length < 8) {
        Swal.showValidationMessage('La contraseña debe tener al menos 8 caracteres');
        return false;
      }
      return { password };
    }
  });

  return value;
}

export async function cambiarContrasena(email, password, apiBase) {
  const res = await fetch(`${apiBase}/change_password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mail: email, password })
  });
  if (!res.ok) throw new Error("No se pudo cambiar la contraseña");
}
