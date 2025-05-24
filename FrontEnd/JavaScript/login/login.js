/// TODO. sacar logica del primer login
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('LoginForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const mail = document.getElementById('mail').value;
        const password = document.getElementById('password').value;
        const alert = document.getElementById('alert-error');
        try {
            const response = await fetch('http://127.0.0.1:4000/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({mail, password})
            });
            if (response.ok) {
                const firstLoginRes = await fetch(`http://127.0.0.1:4000/check_first_login?mail=${mail}`);
                const firstLoginData = await firstLoginRes.json();
                if (firstLoginRes.ok && firstLoginData.first_login === true) {
                    const changePasswordModal = document.getElementById("change-password-modal");
                    while (true) {
                        try {
                            const password = await changePasswordModal.show();
                            const passChangeRes = await fetch('http://127.0.0.1:4000/change_password', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    mail,
                                    password,
                                })
                            });

                            if (passChangeRes.ok) {
                                await fetch(`http://127.0.0.1:4000/change_first_login?mail=${mail}`);
                                sessionStorage.setItem('correo', mail);
                                const successModal = document.getElementById("success-modal");
                                successModal.show("Password changed successfully!", 2000);
                                setTimeout(() => {
                                    window.location.href = `http://127.0.0.1:4000/home`;
                                }, 1500);
                                break;
                            } else {
                                const error = await passChangeRes.json();
                                alert.show(error.error, 2500);
                            }
                        } catch (err) {
                            if (err === 'mismatch') {
                                alert.show("The passwords do not match", 2000);
                            } else if (err === 'empty') {
                                alert.show("Password fields cannot be empty", 2000);
                            } else if (err === 'too_short') {
                                alert.show("Password must be at least 8 characters long", 2000);
                            } else if (err === 'cancel') {
                                break;
                            } else {
                                alert.show("Unexpected error", 2000);
                            }
                        }
                    }
                } else {
                    window.location.href = `http://127.0.0.1:4000/home`;
                }
            } else {
                const json = await response.json();
                alert.show(json.error, 2000);
            }
        } catch (error) {
            alert.show("Request failed. An error occurred.", 2000);
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('sign-in').addEventListener('click', function () {
        window.location.href = 'http://127.0.0.1:4000/register';
    })

    document.getElementById('change-password').addEventListener('click', function () {
        window.location.href = 'http://127.0.0.1:4000/changePassword';
    })
})