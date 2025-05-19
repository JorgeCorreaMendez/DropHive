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

// TODO: Reuse modals, create new models
function showErrorAlert(title, errors) {
    return Swal.fire({
        icon: 'error',
        title: title,
        html: Array.isArray(errors) ? errors.join('<br>') : errors,
        confirmButtonText: 'Understood'
    });
}

function showOkAlert(title, text) {
    return Swal.fire({
        icon: 'success',
        title: title,
        html: Array.isArray(text) ? text.join('<br>') : text,
        confirmButtonText: 'Understood'
    });
}

// TODO: Check if the company already exists
async function isValidForm(data) {
    const errorText = [];
    const verifyEmailResponse = await fetch(`${BASE_URL}/check_mail?mail=${data.mail}`);
    if (verifyEmailResponse.ok) {
        errorText.push("An account with this email already exists.");
    }
    if (data.password.length < 8) {
        errorText.push("Password must be at least 8 characters long.");
    }
    if (data.password !== data.confirm_password) {
        errorText.push("Passwords must match.");
    }
    if (errorText.length > 0) {
        showErrorAlert('Form Error', errorText);
        return false;
    }
    return true;
}

// TODO: Add message indicating account is being created. DO NOT ADD — breaks CSS
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const registerData = getFormData();
        if (await isValidForm(registerData)) {
            try {
                const sendResponse = await fetch(`${BASE_URL}/send_verification_code?mail=${encodeURIComponent(registerData.mail)}`);
                if (!sendResponse.ok) {
                    showErrorAlert("Error", "Failed to send verification code.");
                    return;
                }
                Swal.fire({
                    title: 'Account Creation Verification',
                    input: 'text',
                    inputLabel: 'The code has been sent to your email',
                    inputPlaceholder: 'Verification code',
                    confirmButtonText: 'Verify',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                    preConfirm: (code) => {
                        if (!code) {
                            Swal.showValidationMessage('You must enter a code.');
                        }
                        return code;
                    }
                }).then(async result => {
                    if (result.isConfirmed) {
                        const code = result.value;
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
                                showOkAlert("Account Created!", "Your account has been successfully created.")
                                    .then(() => {
                                        window.location.href = `${BASE_URL}/home`;
                                    });
                            } else {
                                showErrorAlert("Account Creation Failed", result.message);
                            }
                        } else {
                            showErrorAlert("Invalid Code", "The verification code is not valid.");
                        }
                    }
                });
            } catch (error) {
                showErrorAlert("Network Error", "Could not connect to the server.");
                console.error("Error:", error);
            }
        }
    });

    document.getElementById('VolverLogIn').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `${BASE_URL}/login`;
    });
});
