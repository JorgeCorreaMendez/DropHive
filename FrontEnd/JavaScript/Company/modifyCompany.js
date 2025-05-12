document.addEventListener('DOMContentLoaded', async function () {
    const saveButton = document.getElementById("save-btn1");
    if (saveButton) {
        saveButton.addEventListener("click", agregarCompañia);
    } else {
        console.warn("No se ha encontrado el boton");
    }
});

export const agregarCompañia = async () => {
    const companyId = document.getElementById('company-id')?.value;
    const name = document.getElementById('company-name').value;
    const description = document.getElementById('company-description').value;

    if (!name) {
        alert("Name is mandatory");
        return;
    }

    try {
        const payload = {
            "id": companyId,
            "name": name,
            "description": description
        };

        const response = await fetch("/add_company", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            window.location.href = '/home';
        } else {
            const errorMessage = await response.text();
            console.error("Error in the server:", errorMessage);
        }
    } catch (error) {
        console.error("Error in request:", error);
    }
};