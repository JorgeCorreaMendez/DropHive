/* global Swal */

function getFormData() {
    return {
        name: document.getElementById('company').value.trim(),
        mail: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirm_password: document.getElementById('confirm-password').value,
        phone: document.getElementById('phone').value.trim() || null,
        description: document.getElementById('descripcion').value.trim() || null,
        address: document.getElementById('direccion').value.trim() || null
    };
}

///TODO. Reutilizar modales, crear nuevos modelos
function showErrorAlert(title, errors) {
    return Swal.fire({
        icon: 'error',
        title: title,
        html: Array.isArray(errors) ? errors.join('<br>') : errors,
        confirmButtonText: 'Entendido'
    });
}

function showOkAlert(title, text) {
    return Swal.fire({
        icon: 'success',
        title: title,
        html: Array.isArray(text) ? text.join('<br>') : text,
        confirmButtonText: 'Entendido'
    });
}

// TODO. comprobar si existe la empresa
async function isValidForm(data) {
    const errorText = [];
    const verifyEmailResponse = await fetch(`${BASE_URL}/check_mail?mail=${data.mail}`);
    if (verifyEmailResponse.ok) {
        errorText.push("Ya existe una cuenta asociada a este correo.");
    }
    if (data.password.length < 8) {
        errorText.push("La contraseña debe tener al menos 8 caracteres");
    }
    if (data.password !== data.confirm_password) {
        errorText.push("Ambas contraseñas deben coincidir.");
    }
    if (errorText.length > 0) {
        showErrorAlert('Error en el formulario', errorText);
        return false;
    }
    return true;
}

/// TODO. Añadir aviso de que se esta creando la cuenta. NO AÑADIR, rompe CSS
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('registrationForm')
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const registerData = getFormData();
        if (await isValidForm(registerData)) {
            try {
                const sendResponse = await fetch(`${BASE_URL}/send_verification_code?mail=${encodeURIComponent(registerData.mail)}`);
                if (!sendResponse.ok) {
                    showErrorAlert("Error", "No se pudo enviar el código de verificación.");
                    return;
                }
                Swal.fire({
                    title: 'Verificación para crear la cuenta',
                    input: 'text',
                    inputLabel: 'El código se ha enviado a tu correo',
                    inputPlaceholder: 'Código de verificación',
                    confirmButtonText: 'Verificar',
                    showCancelButton: true,
                    cancelButtonText: 'Salir',
                    preConfirm: (code) => {
                        if (!code) {
                            Swal.showValidationMessage('Debes introducir un código');
                        }
                        return code;
                    }
                }).then(async result => {
                    if (result.isConfirmed) {
                        const code = result.value;
                        const checkResponse = await fetch(`${BASE_URL}/check_verification_code`, {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ code })
                        });
                        if (checkResponse.ok) {
                            const response = await fetch(`${BASE_URL}/register`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(registerData)
                            });
                            const result = await response.json();
                            if (response.ok) {
                                showOkAlert("¡Cuenta creada!", "Tu cuenta ha sido creada correctamente.")
                                    .then(() => {
                                        window.location.href = `${BASE_URL}/home`
                                    });
                            } else {
                                showErrorAlert("Error al crear la cuenta.", result.message);
                            }
                        } else {
                            showErrorAlert("Código incorrecto", "El código de verificación no es válido.");
                        }
                    }
                });
            } catch (error) {
                showErrorAlert("Error de red", "No se pudo conectar con el servidor.");
                console.error("Error:", error);
            }
        }
    });
    document.getElementById('VolverLogIn').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `${BASE_URL}/login`;
    });
});