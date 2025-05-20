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
        errorText.push("A company with that name already exists.");
    }
    const verifyEmailResponse = await fetch(`${BASE_URL}/check_mail?mail=${data.mail}`);
    if (verifyEmailResponse.ok) {
        errorText.push("An account with this email already exists.");
    }
    if (data.password.length < 8) {
        errorText.push("Password must be at least 8 characters long.");
    }
    if (data.password !== data.confirm_password) {
        errorText.push("Passwords do not match.");
    }
    if (errorText.length > 0) {
        const alert = document.getElementById('alert-error');
        alert.show(Array.isArray(errorText) ? errorText.join('<br>') : errorText, 2000);
        return false;
    }
    return true;
}


document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById('loading');
    const form = document.getElementById('registrationForm')
    const alertError = document.getElementById('alert-error');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const registerData = getFormData();
        if (await isValidForm(registerData)) {
            loader.show("Sending verification code...");
            try {
                const sendResponse = await fetch(`${BASE_URL}/send_verification_code?mail=${encodeURIComponent(registerData.mail)}`);
                if (!sendResponse.ok) {
                    alert.show("Verification code could not be sent.", 4000);
                    return;
                }
                const prompt = document.getElementById('prompt-modal');
                const code = await prompt.show({
                    title: 'Account verification',
                    text: 'The code has been sent to your email',
                    placeholder: 'Verification code'
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
                            const successModal = document.getElementById('success-modal');
                            successModal.show('Successful registration');
                            setTimeout(() => {
                              window.location.href = `${BASE_URL}/home`;
                            }, 1500);
                        } else {
                            alert.show(result.message, 2000);
                        }
                    } else {
                        alert.show("The verification code is invalid.", 2000);
                    }
                }
            } catch (error) {
                alertError.show(error, 2000);
            } finally {
                loader.hide();
            }
        }
    });
    document.getElementById('VolverLogin').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `${BASE_URL}/login`;
    });
});