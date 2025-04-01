// Función para recuperar los datos del formulario
function recuperarDatos() {
    // Obtener valores de los campos del formulario
    const name = document.getElementById('company').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value.trim();
    const description = document.getElementById('descripcion').value.trim();
    const address = document.getElementById('direccion').value.trim();

    // Crear objeto con los datos
    return {
        name: name,
        mail: email,
        password: password,
        phone: phone || null,
        description: description || null,
        address: address || null
    }; // Devuelve el objeto directamente (no stringify)
}

// Función para validar el formulario
function validateRegistrationForm() {
    const errors = [];
    const data = recuperarDatos();
    const email = document.getElementById('email').value.trim();
    let db_name = "";
    if (email.includes("@") && email.includes(".")) {
        db_name = email.split('@')[1].split('.')[0].toLowerCase();
    }

    // Validar campo nombre
    if (!data.name) {
        errors.push("El nombre debe tener al menos 2 caracteres");
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.mail)) {
        errors.push("Por favor ingrese un email válido");
    }

    // Validar contraseña
    if (!data.password) {
        errors.push("La contraseña debe tener al menos 8 caracteres");
    }

    // Mostrar errores si existen
    if (errors.length > 0) {
        document.getElementById('message').innerHTML = errors.join("<br>");
        document.getElementById('message').style.color = "red";
        return false;
    }

    return true;
}

// Función principal para manejar el registro
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('registrationForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        if (!validateRegistrationForm()) {
            return;
        }

        const registerData = recuperarDatos();

        try {
            const response = await fetch('http://127.0.0.1:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData) // Aquí se convierte a JSON
            });
            const result = await response.json();
            
            if (response.ok) {
                console.log("Entra aqui");
                
                if (response.status === 200) {
                    window.location.href = `http://127.0.0.1:4000/login`;
                }
            } else {
                document.getElementById('message').innerHTML = result.message || "Error en el registro";
                document.getElementById('message').style.color = "red";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    // Botón para volver al login
    document.getElementById('VolverLogIn').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'http://127.0.0.1:4000/login';
    });
});