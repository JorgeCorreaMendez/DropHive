export async function enviarCodigo(email, apiBase) {
  const res = await fetch(`${apiBase}/send_verification_code?mail=${email}`);
  if (!res.ok) throw new Error("No se pudo enviar el correo");
}
