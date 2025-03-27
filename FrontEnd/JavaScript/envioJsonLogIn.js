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
                    window.location.href = `http://127.0.0.1:4000/${db_name}/home`
                }
            } else {
                const error = await response.json();
                document.getElementById('message').innerHTML = error.message || "Ocurrió un error desconocido.";
            }
        } catch (error) {
            document.getElementById('message').innerHTML = error.message || "Ocurrió un error en la solicitud.";
        }
    });
});
