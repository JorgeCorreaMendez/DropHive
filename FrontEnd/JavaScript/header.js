import {recuperarNombreBaseDatos} from "./recursos.js";

function initializeLogoutButton() {
    const logoutButton = document.getElementById("log-out");
    console.log("Se entra aquí");

    if (logoutButton) {
        console.log("2Se entra aquí2");
        logoutButton.addEventListener("click", () => {
            // Usamos SweetAlert para la confirmación
            Swal.fire({
                title: '¿Estás seguro de que deseas cerrar sesión?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,  // Mostramos el botón "Cancelar"
                confirmButtonText: 'Sí, cerrar sesión',  // Texto del botón de confirmación
                cancelButtonText: 'No, cancelar',  // Texto del botón de cancelación
                reverseButtons: true  // Revertimos el orden de los botones
            }).then((result) => {
                if (result.isConfirmed) {
                    // Si el usuario confirma, se ejecuta el logout
                    fetch("/logout", { method: "GET" })
                        .then(response => {
                            if (response.ok) {
                                window.location.href = "/";
                            } else {
                                Swal.fire("Error", "Hubo un problema al cerrar sesión.", "error");
                            }
                        })
                        .catch(error => {
                            console.error("Error:", error);
                            Swal.fire("Error", "Hubo un problema al cerrar sesión.", "error");
                        });
                }
            });
        });
    } else {
        console.error("No se encontró el botón con id 'log-out' después de cargar el header.");
    }
}


function initializePage() {
    initializeLogoutButton(); // Siempre cargamos el header y footer
}

window.onload = function() {
    initializeLogoutButton(); // Cargar header, footer y body específico según la página
    document.getElementById("logo").addEventListener("click", async () => {
        window.location.href = `http://127.0.0.1:4000/home`;
    })
}