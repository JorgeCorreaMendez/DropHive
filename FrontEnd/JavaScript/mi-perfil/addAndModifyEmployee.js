import {openModal} from "../modals/abrirYCerrarModal.js";

async function cargarModalCrearCuenta() {
    const response = await fetch(`/addEmployee`);
    const html = await response.text();
    openModal(html);
    setTimeout(() => {
        document.getElementById("save-changes-btn")?.addEventListener("click", crearCuentaEmpleado);
    }, 50);
}

function generateNumericPassword(length = 8) {
    let password = '';
    for (let i = 0; i < length; i++) {
        password += Math.floor(Math.random() * 10);
    }
    return password;
}


async function crearCuentaEmpleado() {
    const alertError = document.querySelector("alert-modal");
    const successfulModal = document.querySelector("successful-modal");

    const id = document.getElementById("id").value.trim();
    const email = document.getElementById("email").value.trim();
    const modal = document.getElementById('loadingModal');

    if (!id || !email) {
        return alertError.show("Both ID and email are required.", 2000);
    }

    const newUserData = {
        user_id: id,
        mail: email,
        password: generateNumericPassword()
    };

    try {
        /// TODO. Crear contraseña aquii
        modal.classList.remove('hidden');
        const response = await fetch('http://127.0.0.1:4000/create_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUserData)
        });

        if (response.ok) {
            modal.classList.add('hidden');
            await fetch(`http://127.0.0.1:4000/send_password_to_new_user?mail=${email}`)
            await successfulModal.show("New user registered successfully. An email will be sent.");
            window.location.reload();
        } else {
            modal.classList.add('hidden');
            const error = await response.json();
            alertError.show(error.message || "An unknown error occurred.", 2500);
        }
    } catch (error) {
        alertError.show(error.message || "An unknown error occurred.", 2500);
    }
}

export function addEventListenerAddEmployee() {
    document.getElementById("add-employee-btn").addEventListener("click", cargarModalCrearCuenta);
}