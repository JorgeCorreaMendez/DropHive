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
    const id = document.getElementById("id").value;
    const email = document.getElementById("email").value;
    const password = await generatePassword();
    const role = 1;
    const modal = document.getElementById('loadingModal');

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
            user_id: id,
            mail: email,
            password: password
        };

    try {
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
            fetch(`http://127.0.0.1:4000/new_account_registered?mail=${email}&password=${password}`)
            Swal.fire({
                icon: 'success',
                title: 'New user registered succesfully',
                text: 'An email will be sent to the new user',
                timer: 2500,
                showConfirmButton: false
            }).then(() => {
                window.location.reload();
            })
        } else {
            modal.classList.add('hidden');
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

async function generatePassword(longitud = 8) {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const simbolos = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const todos = letras + numeros + simbolos;

  if (longitud < 2) {
    throw new Error('La longitud debe ser al menos 2 para incluir un símbolo.');
  }

  let contrasena = '';

  // Aseguramos al menos un símbolo
  contrasena += simbolos[Math.floor(Math.random() * simbolos.length)];

  // El resto de la contraseña
  for (let i = 1; i < longitud; i++) {
    contrasena += todos[Math.floor(Math.random() * todos.length)];
  }

  // Mezclamos los caracteres para que el símbolo no siempre esté primero
  contrasena = contrasena.split('').sort(() => Math.random() - 0.5).join('');

  return contrasena;
}

export function addEventListenerAddEmployee() {
    document.getElementById("add-employee-btn").addEventListener("click", cargarModalCrearCuenta);
}