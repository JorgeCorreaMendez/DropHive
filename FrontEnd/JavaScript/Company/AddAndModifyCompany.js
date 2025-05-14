// noinspection JSNonASCIINames,NonAsciiCharacters

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("company-form");
    if (form) {
        form.addEventListener("submit", agregarCompañia);
    }
});

export const agregarCompañia = async (e) => {
    e.preventDefault();

    const companyId = document.getElementById('company-id')?.value;
    const name = document.getElementById('company-name')?.value.trim();
    const description = document.getElementById('company-description')?.value.trim();

    if (!name) {
        alert("El nombre es obligatorio.");
        return;
    }

    const payload = {
        id: companyId || null,
        name,
        description
    };

    const endpoint = companyId ? "/modify_company" : "/add_company";
    const method = "POST";

    try {
        const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            window.location.href = "/home";
        } else {
            const errorMessage = await response.text();
            alert("Error del servidor: " + errorMessage);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error en la conexión.");
    }
};
