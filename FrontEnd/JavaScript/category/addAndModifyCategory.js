document.addEventListener('DOMContentLoaded', async function () {
    const saveButton = document.getElementById("save-btn1");
    if (saveButton) {
        saveButton.addEventListener("click", agregarCategoria);
    } else {
        console.warn("Button not found");
    }
});

export const agregarCategoria = async () => {
    const categoryId = document.getElementById('category-id')?.value;
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;

    if (!name) {
        alert("Name is required");
        return;
    }

    try {
        const payload = {
            "id": categoryId,
            "name": name,
            "description": description
        };

        const response = await fetch("/add_category", {
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
            console.error("Server error:", errorMessage);
        }
    } catch (error) {
        console.error("Error in the request:", error);
    }
};
