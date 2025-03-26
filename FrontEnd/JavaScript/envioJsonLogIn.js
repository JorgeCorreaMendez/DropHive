document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const mail = document.getElementById('mail').value;
    const password = document.getElementById('password').value;

    const loginData = {
        mail: mail,
        password: password
    }

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if(response.ok) {
            const data = await response.json();
            document.getElementById('message').innerHTML = data.message;
        } else {
            const error = await response.json();
            document.getElementById('message').innerHTML = error.message;
        }
    } catch (error) {
        document.getElementById('message').innerHTML = error.message;
    }
});