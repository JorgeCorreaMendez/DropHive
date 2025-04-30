document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('LoginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const mail = document.getElementById('mail').value;
        const password = document.getElementById('password').value;

        const loginData = { mail, password };

        try {
            const response = await fetch('http://127.0.0.1:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const data = await response.json();

                // Consultamos si es el primer inicio de sesión
                const firstLoginRes = await fetch(`http://127.0.0.1:4000/check_first_login?mail=${mail}`);
                const firstLoginData = await firstLoginRes.json();

                if (firstLoginRes.ok && (firstLoginData.first_login === true || firstLoginData.first_login === 1)) {
                    // Mostrar modal para cambiar contraseña
                    const { value: formValues } = await Swal.fire({
                        title: 'Cambia tu contraseña',
                        html:
                            '<input id="swal-password" type="password" class="swal2-input" placeholder="Nueva contraseña">' +
                            '<input id="swal-confirm" type="password" class="swal2-input" placeholder="Confirmar contraseña">',
                        focusConfirm: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Guardar',
                        preConfirm: validatePassword
                    });

                    if (formValues) {
                        const passChangeRes = await fetch('http://127.0.0.1:4000/change_password', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                mail,
                                password: formValues.newPassword,
                            })
                        });

                        if (passChangeRes.ok) {
                            window.location.href = `http://127.0.0.1:4000/home`;
                        } else {
                            const error = await passChangeRes.json();
                            Swal.fire({
                                icon: 'error',
                                title: "Error durante el cambio de contraseña.",
                                html: error.message || "Ocurrió un error desconocido",
                                timer: 2500,
                                showConfirmButton: false
                            });
                        }
                    }
                } else {
                    // Si no es primer login, redirige directamente
                    window.location.href = `http://127.0.0.1:4000/home`;
                }

            } else {
                const error = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: "Error durante el inicio de sesión.",
                    html: error.message || "Ocurrió un error desconocido",
                    timer: 2500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: "Error en el servidor.",
                html: "Ocurrió un error en la solicitud",
                timer: 2500,
                showConfirmButton: false
            });
        }
    });
});

// Validación modular
function validatePassword() {
    const pass = document.getElementById('swal-password').value;
    const confirm = document.getElementById('swal-confirm').value;

    if (!pass || !confirm) {
        Swal.showValidationMessage('Debes completar ambos campos');
        return false;
    }

    if (pass.length < 8) {
        Swal.showValidationMessage('La contraseña debe tener al menos 8 caracteres');
        return false;
    }

    if (pass !== confirm) {
        Swal.showValidationMessage('Las contraseñas no coinciden');
        return false;
    }

    return { newPassword: pass };
}



document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('sign-in').addEventListener('click', function() {
        window.location.href = 'http://127.0.0.1:4000/register';
    })

    document.getElementById('need-help').addEventListener('click', function() {
        window.location.href = 'http://127.0.0.1:4000/forgotten_password';
    })
})