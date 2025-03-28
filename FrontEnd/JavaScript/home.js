document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("log-out").addEventListener("click", () => {
        fetch("/logout", { method: "GET"})
            .then(response => {
                if (response.ok) {
                    alert("Sesión cerrada con éxito.");
                    window.location.href = "/";
                } else {
                    alert("Error al cerrar sesión.");
                }
            })
            .catch(error => console.error("Error:", error));
    });
});