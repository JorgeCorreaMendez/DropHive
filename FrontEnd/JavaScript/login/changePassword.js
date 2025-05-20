//TODO. Cambiar CSS de los botones
document.getElementById("LoginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("mail").value;
    const alertError = document.getElementById('alert-error');
    const loader = document.getElementById('loading');
    // TODO. cambiar y retornar 200 y que no se ha encontrado el correo
    const check_mail = await fetch(`http://127.0.0.1:4000/check_mail?mail=${email}`);
    if (!check_mail.ok) {
        alertError.show("The entered email is not registered", 2000);
        return
    }
    loader.show("Sending verification email");
    const sendMailResponse = await fetch(`http://127.0.0.1:4000/send_verification_code?mail=${email}`);
    loader.hide();

    if (sendMailResponse.ok) {
        const prompt = document.getElementById('prompt-modal');
        let valid = false;
        while (!valid) {
            const verification_code = await prompt.show({
                title: 'Verification to reset password',
                text: 'The code has been sent to your email',
                placeholder: 'Verification code'
            });
            if (verification_code === null) {
                break;
            }
            if (!verification_code || verification_code.trim() === '') {
                alertError.show("You must enter a verification code.", 2000);
                continue;
            }
            const response = await fetch('http://127.0.0.1:4000/check_verification_code', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({code: verification_code}),
            });

            if (response.ok) {
                valid = true
                const changePasswordModal = document.getElementById('change-password');
                let passwordSet = false;
                while (!passwordSet) {
                    try {
                        const newPassword = await changePasswordModal.show();
                        const responseChange = await fetch('http://127.0.0.1:4000/change_password', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                mail: email,
                                password: newPassword,
                            })
                        });
                        if (responseChange.ok) {
                            changePasswordModal.hide()
                            const successModal = document.getElementById('success-modal');
                            successModal.show('Successful registration');
                            setTimeout(() => {
                                window.location.href = 'http://127.0.0.1:4000/login';
                            }, 1500);
                            passwordSet = true;
                            break;
                        } else {
                            alertError.show("There was an error changing the password. Please try again later.", 2000);
                        }
                    } catch (err) {
                        if (err === 'mismatch') {
                            alertError.show("The passwords do not match", 2000);
                        } else if (err === 'empty') {
                            alertError.show("Password fields cannot be empty", 2000);
                        } else if (err === 'too_short') {
                            alertError.show("Password must be longer than 8 characters", 2000);
                        } else if (err === 'cancel') {
                            break;
                        } else {
                            alertError.show("Unexpected error", 2000);
                        }
                    }
                }
            } else {
                alertError.show("The verification code is incorrect", 2000);
            }
        }
    } else {
        alertError.show("Could not send the verification email", 2000);
    }
});