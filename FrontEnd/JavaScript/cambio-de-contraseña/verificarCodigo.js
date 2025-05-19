export async function pedirCodigoVerificacion(apiBase) {
  const { value: code } = await Swal.fire({
    title: 'Verification code',
    input: 'text',
    inputLabel: 'Enter the code sent to your email',
    inputPlaceholder: 'Code',
    showCancelButton: true,
    confirmButtonText: 'Verify',
    allowOutsideClick: false,
    allowEscapeKey: false,
    preConfirm: async (code) => {
      if (!code) {
        Swal.showValidationMessage('You must enter a code');
        return false;
      }
      try {
        const res = await fetch(`${apiBase}/check_verification_code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        if (!res.ok) {
          Swal.showValidationMessage('Incorrect code');
          return false;
        }
        return code;
      } catch {
        Swal.showValidationMessage('Error verifying the code');
        return false;
      }
    }
  });

  return code;
}
