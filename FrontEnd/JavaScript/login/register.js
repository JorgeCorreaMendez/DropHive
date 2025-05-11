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

async function isValidForm(data) {
    const errorText = [];
    const verifyCompanyResponse = await fetch(`${BASE_URL}/check_company?name=${data.name}`);
    if (verifyCompanyResponse.ok) {
        errorText.push("Ya existe una empresa registrada con ese nombre.");
    }
    const verifyEmailResponse = await fetch(`${BASE_URL}/check_mail?mail=${data.mail}`);
    if (verifyEmailResponse.ok) {
        errorText.push("Ya existe una cuenta asociada a este correo.");
    }
    if (data.password.length < 8) {
        errorText.push("La contraseña debe tener al menos 8 caracteres.");
    }
    if (data.password !== data.confirm_password) {
        errorText.push("Ambas contraseñas deben coincidir.");
    }
    if (errorText.length > 0) {
        const alert = document.getElementById('alert-error');
        alert.setMessage(Array.isArray(errorText) ? errorText.join('<br>') : errorText);
        alert.show(2000);
        return false;
    }
    return true;
}


document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById('loading');
    const form = document.getElementById('registrationForm')
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const registerData = getFormData();
        if (await isValidForm(registerData)) {
            loader.show();
            try {
                const sendResponse = await fetch(`${BASE_URL}/send_verification_code?mail=${encodeURIComponent(registerData.mail)}`);
                if (!sendResponse.ok) {
                    loader.hide();
                    const alert = document.getElementById('alert-error');
                    alert.setMessage("No se pudo enviar el código de verificación.");
                    alert.show(2000);
                    return;
                }
                const prompt = document.getElementById('prompt-modal');
                const code = await prompt.show({
                    title: 'Verificación para crear la cuenta',
                    text: 'El código se ha enviado a tu correo',
                    placeholder: 'Código de verificación'
                });

                if (code) {
                    const checkResponse = await fetch(`${BASE_URL}/check_verification_code`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code })
                    });

                    if (checkResponse.ok) {
                        const response = await fetch(`${BASE_URL}/register`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(registerData)
                        });

                        const result = await response.json();

                        if (response.ok) {
                            const alert = document.getElementById('alert-success');
                            alert.setMessage("Tu cuenta ha sido creada correctamente.");
                            alert.show(2000);
                            loader.hide();
                            window.location.href = `${BASE_URL}/home`;
                        } else {
                            loader.hide();
                            const alert = document.getElementById('alert-error');
                            alert.setMessage(result.message);
                            alert.show(2000);
                        }
                    } else {
                        loader.hide();
                        const alert = document.getElementById('alert-error');
                        alert.setMessage("El código de verificación no es válido.");
                        alert.show(2000);
                    }
                } else {
                    loader.hide();
                }
            } catch (error) {
                const alert = document.getElementById('alert-error');
                alert.setMessage(error);
                alert.show(2000);
            }
        }
    });
    document.getElementById('VolverLogIn').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `${BASE_URL}/login`;
    });
});