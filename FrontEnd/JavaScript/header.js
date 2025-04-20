import {recuperarNombreBaseDatos} from "./recursos.js";

function initializeLogoutButton() {
    const logoutButton = document.getElementById("log-out");
    console.log("Se entra aquí");
    if (logoutButton) {
        console.log("2Se entra aquí2");
        logoutButton.addEventListener("click", () => {
            const confirmation = confirm("¿Estás seguro de que deseas cerrar sesión?");
            if (confirmation) {
                fetch("/logout", { method: "GET" })
                    .then(response => {
                        if (response.ok) {
                            window.location.href = "/";
                        } else {
                            alert("Error al cerrar sesión.");
                        }
                    })
                    .catch(error => console.error("Error:", error));
            }
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
        const db_name = await recuperarNombreBaseDatos();
        window.location.href = `http://127.0.0.1:4000/${db_name}/home`;
    })
}