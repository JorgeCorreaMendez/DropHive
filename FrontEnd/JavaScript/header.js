async function loadTemplate(templateName, targetElementId) {
    try {
        const response = await fetch(`http://127.0.0.1:4000/templates/${templateName}.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(targetElementId).innerHTML = html;

        if (templateName === "header") {
            initializeLogoutButton();
        }

    } catch (error) {
        console.error(`Error loading template ${templateName}:`, error);
    }
}

function initializeLogoutButton() {
    const logoutButton = document.getElementById("log-out");
    if (logoutButton) {
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

function loadDefaultTemplates() {
    loadTemplate("header", 'header-container');
}

function initializePage() {
    loadDefaultTemplates(); // Siempre cargamos el header y footer
}

window.onload = function() {
    initializePage(); // Cargar header, footer y body específico según la página
}