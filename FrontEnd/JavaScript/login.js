document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('LoginForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const mail = document.getElementById('mail').value;
        const password = document.getElementById('password').value;

        console.log(mail, password)

        const loginData = {
            mail: mail,
            password: password
        };

        try {
            const response = await fetch('http://127.0.0.1:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('message').innerHTML = data.message;
                if(response.status === 200) {
                    const db_name = data.db_name;
                    window.location.href = `http://127.0.0.1:4000/home`
                }
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
    });
});


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('sign-in').addEventListener('click', function() {
        window.location.href = 'http://127.0.0.1:4000/register';
    })

    document.getElementById('need-help').addEventListener('click', function() {
        window.location.href = 'http://127.0.0.1:4000/forgotten_password';
    })
})