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

                // Check if this is the first login
                const firstLoginRes = await fetch(`http://127.0.0.1:4000/check_first_login?mail=${mail}`);
                const firstLoginData = await firstLoginRes.json();

                if (firstLoginRes.ok && (firstLoginData.first_login === true || firstLoginData.first_login === 1)) {
                    // Show modal to change password
                    const { value: formValues } = await Swal.fire({
                        title: 'Change your password',
                        html:
                            '<input id="swal-password" type="password" class="swal2-input" placeholder="New password">' +
                            '<input id="swal-confirm" type="password" class="swal2-input" placeholder="Confirm password">',
                        focusConfirm: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonText: 'Save',
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
                            await fetch(`http://127.0.0.1:4000/change_first_login?mail=${mail}`);
                            sessionStorage.setItem('correo', mail);
                            window.location.href = `http://127.0.0.1:4000/home`;
                        } else {
                            const error = await passChangeRes.json();
                            Swal.fire({
                                icon: 'error',
                                title: "Error while changing the password.",
                                html: error.message || "An unknown error occurred",
                                timer: 2500,
                                showConfirmButton: false
                            });
                        }
                    }
                } else {
                    // If not first login, redirect directly
                    sessionStorage.setItem('correo', mail);
                    window.location.href = `http://127.0.0.1:4000/home`;
                }

            } else {
                const error = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: "Login error.",
                    html: error.error || "An unknown error occurred",
                    timer: 2500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: "Server error.",
                html: "An error occurred with the request",
                timer: 2500,
                showConfirmButton: false
            });
        }
    });
});

// Modular validation
function validatePassword() {
    const pass = document.getElementById('swal-password').value;
    const confirm = document.getElementById('swal-confirm').value;

    if (!pass || !confirm) {
        Swal.showValidationMessage('You must complete both fields');
        return false;
    }

    if (pass.length < 8) {
        Swal.showValidationMessage('Password must be at least 8 characters long');
        return false;
    }

    if (pass !== confirm) {
        Swal.showValidationMessage('Passwords do not match');
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
});
