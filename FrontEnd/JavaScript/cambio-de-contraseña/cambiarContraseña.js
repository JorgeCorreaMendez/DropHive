export async function solicitarNuevaContrasena() {
  const { value } = await Swal.fire({
    title: 'Change your password',
    html:
      '<input id="swal-password" type="password" class="swal2-input" placeholder="New password">' +
      '<input id="swal-confirm" type="password" class="swal2-input" placeholder="Confirm password">',
    focusConfirm: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonText: 'Save',
    preConfirm: () => {
      const password = document.getElementById('swal-password').value;
      const confirm = document.getElementById('swal-confirm').value;

      if (!password || !confirm) {
        Swal.showValidationMessage('Both fields are required');
        return false;
      }
      if (password !== confirm) {
        Swal.showValidationMessage('Passwords do not match');
        return false;
      }
      if (password.length < 8) {
        Swal.showValidationMessage('Password must be at least 8 characters long');
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
  if (!res.ok) throw new Error("Password could not be changed");
}
