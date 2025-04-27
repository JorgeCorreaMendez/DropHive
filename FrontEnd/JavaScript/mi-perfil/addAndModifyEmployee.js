import {openModal} from "../modals/abrirYCerrarModal.js";

async function cargarModalCrearCuenta() {
    const response = await fetch(`/addEmployee`);
    const html = await response.text();
    openModal(html);
    setTimeout(() => {
      document.getElementById("save-changes-btn")?.addEventListener("click", crearCuentaEmpleado);
    }, 50);
}

async function crearCuentaEmpleado() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = 1;

    if(password.length < 8) {
        Swal.fire({
                icon: 'error',
                title: "Password Error",
                html: "Password must have at least 8 characters",
                timer: 2500,
                showConfirmButton: false
            });
        return;
    }

    const newUserData = {
            mail: email,
            password: password
        };

    console.log(newUserData)

    try {
        const response = await fetch('http://127.0.0.1:4000/create_account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUserData)
            });

        if (response.ok) {
            fetch(`http://127.0.0.1:4000/new_account_registered?mail=${email}&password=${password}`)
            Swal.fire({
                icon: 'success',
                title: 'New user registered succesfully',
                text: 'An email will be sent to the new user',
                timer: 2500,
                showConfirmButton: false
            })
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
            html: "Ocuririó un error en la solicitud",
            timer: 2500,
            showConfirmButton: false
        });
    }
}

export function addEventListenerAddEmployee() {
    document.getElementById("add-employee-btn").addEventListener("click", cargarModalCrearCuenta);
}