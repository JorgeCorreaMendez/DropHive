function initializeLogoutButton() {
    const logoutButton = document.getElementById("log-out");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            const modal = document.getElementById("confirmation-modal");
            modal.show("Are you sure you want to log out?")
                .then(() => {
                    fetch("/logout", { method: "GET" })
                        .then(response => {
                            if (response.ok) {
                                window.location.href = "/login";
                            } else {
                                console.error("There was a problem logging out.", 3000);
                            }
                        })
                        .catch(error => {
                            console.error(error, 3000);
                        });
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

window.onload = function () {
    initializeLogoutButton();
    document.getElementById("logo").addEventListener("click", async () => {
        window.location.href = `http://127.0.0.1:4000/home`;
    });
}
