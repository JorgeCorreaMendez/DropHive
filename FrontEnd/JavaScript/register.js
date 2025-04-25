/* global Swal */

const BASE_URL = "http://127.0.0.1:4000"; // TODO. variable global para js

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

function showErrorAlert(title, errors) {
    return Swal.fire({
        icon: 'error',
        title: title,
        html: Array.isArray(errors) ? errors.join('<br>') : errors,
        confirmButtonText: 'Entendido'
    });
}

function showOkAlert(title, errors) {
    return Swal.fire({
        icon: 'success',
        title: title,
        html: Array.isArray(errors) ? errors.join('<br>') : errors,
        confirmButtonText: 'Entendido'
    });
}

function isNotValidForm(data) {
    const errorText = [];
    if (data.password.length < 8) {
        errorText.push("La contraseña debe tener al menos 8 caracteres");
    }
    if (data.password !== data.confirm_password) {
        errorText.push("Ambas contraseñas deben coincidir.");
    }
    if (errorText.length > 0) {
        showErrorAlert('Error en el formulario', errorText);
        return true;
    }
    return false;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const registerData = getFormData();
        if (isNotValidForm(registerData)) return;
        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });
            const result = await response.json();
            if (response.ok) {
                showOkAlert("¡Registro exitoso!", "Tu cuenta ha sido creada correctamente.")
                    .then(() => {
                        window.location.href = `${BASE_URL}/login`
                    })

            } else {
                showErrorAlert("Error al crear la cuenta.", result.message);
            }
        } catch (error) {
            showErrorAlert("Error de red", "No se pudo conectar con el servidor.");
            console.error("Error:", error);
        }
    });

    document.getElementById('VolverLogIn').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `${BASE_URL}/login`;
    });
});