
async function loadTemplate(templateName, targetElementId) {
    try {
        const response = await fetch(`../html/${templateName}.html`); // Cambié la ruta
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(targetElementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading template ${templateName}:`, error);
    }
}


function loadDefaultTemplates() {
    loadTemplate("header", 'header-container');

}
function initializePage() {
    loadDefaultTemplates(); // Siempre cargamos el header y footer}
}

window.onload = function() {
    initializePage(); // Cargar header, footer y body específico según la página
};

document.addEventListener("DOMContentLoaded", function () {
    console.log("Script cargado correctamente");

    const pageMap = {
        "submit": "../html/LogIn.html",

    };

    // Si decides manejar la redirección manualmente, puedes escuchar el evento submit del formulario:
    const form = document.getElementById("registrationForm");
    form.addEventListener("submit", function(event) {
        // La validación ya se invoca con el onsubmit, pero aquí puedes redirigir si la validación fue exitosa.
        if (validateRegistrationForm()) {
            console.log("Validación exitosa, redirigiendo a: " + pageMap["submit"]);
            // Si no deseas que el formulario se envíe de forma tradicional, puedes prevenir el submit y redirigir manualmente:
            event.preventDefault();
            window.location.href = pageMap["submit"];
        } else {
            // La función de validación mostrará los errores y se previene el envío.
            console.log("Validación fallida, no se redirige");
            event.preventDefault();
        }
    });
});

// Función para validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para validar teléfono
function validatePhone(phone) {
    const re = /^\+?\d{7,15}$/;
    return re.test(phone);
}

// Función de validación del formulario
function validateRegistrationForm() {
    // Se usan los ID actualizados para acceder a los elementos
    const nameField = document.getElementById("Company");
    const email = document.getElementById("Email");
    const password = document.getElementById("password");
    const repeatPassword = document.getElementById("confirm-password");
    const phone = document.getElementById("phone");
    let isValid = true;
    let errors = [];

    // Validar email
    if (!email || email.value.trim() === "") {
        isValid = false;
        errors.push("El email es obligatorio.");
    } else if (!validateEmail(email.value.trim())) {
        isValid = false;
        errors.push("El formato del email no es válido.");
    }

    // Validar contraseña
    if (!password || password.value.trim() === "") {
        isValid = false;
        errors.push("La contraseña es obligatoria.");
    } else if (password.value.trim().length < 8) {
        isValid = false;
        errors.push("La contraseña debe tener al menos 8 caracteres.");
    }

    // Validar que la confirmación de la contraseña coincida
    if (!repeatPassword || repeatPassword.value.trim() === "") {
        isValid = false;
        errors.push("Debes repetir la contraseña.");
    } else if (password.value.trim() !== repeatPassword.value.trim()) {
        isValid = false;
        errors.push("Las contraseñas no coinciden.");
    }

    // Validar nombre (Company)
    if (!nameField || nameField.value.trim() === "") {
        isValid = false;
        errors.push("El nombre es obligatorio.");
    }

    // Validar teléfono (si es obligatorio, de lo contrario, omite esta validación)
    if (!phone || phone.value.trim() === "") {
        isValid = false;
        errors.push("El número de teléfono es obligatorio.");
    } else if (!validatePhone(phone.value.trim())) {
        isValid = false;
        errors.push("El número de teléfono no es válido.");
    }

    if (!isValid) {
        alert(errors.join("\n"));
    }
    return isValid;
}