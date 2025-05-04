export async function pedirCodigoVerificacion(apiBase) {
  const { value: code } = await Swal.fire({
    title: 'Código de verificación',
    input: 'text',
    inputLabel: 'Introduce el código enviado a tu correo',
    inputPlaceholder: 'Código',
    showCancelButton: true,
    confirmButtonText: 'Verificar',
    allowOutsideClick: false,
    allowEscapeKey: false,
    preConfirm: async (code) => {
      if (!code) {
        Swal.showValidationMessage('Debes ingresar un código');
        return false;
      }
      try {
        const res = await fetch(`${apiBase}/check_verification_code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        if (!res.ok) {
          Swal.showValidationMessage('Código incorrecto');
          return false;
        }
        return code;
      } catch {
        Swal.showValidationMessage('Error al verificar el código');
        return false;
      }
    }
  });

  return code;
}
