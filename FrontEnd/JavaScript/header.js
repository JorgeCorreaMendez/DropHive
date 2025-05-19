import { recuperarNombreBaseDatos } from "./recursos.js";

function initializeLogoutButton() {
    const logoutButton = document.getElementById("log-out");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            // Use SweetAlert for confirmation
            Swal.fire({
                title: 'Are you sure you want to log out?',
                text: 'This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,       // Show "Cancel" button
                confirmButtonText: 'Yes, log out',  // Confirm button text
                cancelButtonText: 'No, cancel',     // Cancel button text
                reverseButtons: true          // Reverse button order
            }).then((result) => {
                if (result.isConfirmed) {
                    // If confirmed, execute logout
                    fetch("/logout", { method: "GET" })
                        .then(response => {
                            if (response.ok) {
                                window.location.href = "/";
                            } else {
                                Swal.fire("Error", "There was a problem logging out.", "error");
                            }
                        })
                        .catch(error => {
                            console.error("Error:", error);
                            Swal.fire("Error", "There was a problem logging out.", "error");
                        });
                }
            });
        });
    } else {
        console.error("Could not find the button with id 'log-out' after loading the header.");
    }
}

document.getElementById("mi-perfil").addEventListener("click", async () => {
    window.location.href = "http://127.0.0.1:4000/profile";
});

document.getElementById("retorno-home").addEventListener("click", () => {
    window.location.href = "http://127.0.0.1:4000/home";
});

function initializePage() {
    initializeLogoutButton(); // Always load header and footer
}

window.onload = function () {
    initializeLogoutButton(); // Load header, footer, and page-specific body
    document.getElementById("logo").addEventListener("click", async () => {
        window.location.href = `http://127.0.0.1:4000/home`;
    });
}
