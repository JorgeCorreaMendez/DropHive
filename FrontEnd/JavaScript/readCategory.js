document.addEventListener("DOMContentLoaded", async () => {
    await cargarCategorias();
});

const cargarCategorias = async () => {
    try {
        const response = await fetch("/get_all_categories");
        if (!response.ok) throw new Error("Errore nel recupero delle categorie");

        const categories = await response.json();
        const container = document.getElementById("categories-container");
        container.innerHTML = "";

        if (!Array.isArray(categories) || categories.length === 0) {
            container.innerHTML = "<p>Nessuna categoria trovata.</p>";
            return;
        }

        categories.forEach(category => {
            const card = document.createElement("div");
            card.className = "category-card bg-white rounded-xl shadow p-4 m-4";

            const image = document.createElement("img");
            image.src = category.image_url || "/FrontEnd/Images/sinFoto.png";
            image.alt = category.name;
            image.className = "w-32 h-32 object-cover rounded-full mx-auto";

            const name = document.createElement("h3");
            name.textContent = category.name;
            name.className = "text-xl font-bold text-center mt-4";

            const description = document.createElement("p");
            description.textContent = category.description;
            description.className = "text-gray-700 mt-2 text-center";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Modifica";
            editBtn.className = "bg-blue-500 text-white px-4 py-1 rounded mt-4 block mx-auto";
            editBtn.addEventListener("click", () => {
                localStorage.setItem("editCategoryId", category.id);
                window.location.href = "/addAndModifyCategory";
            });

            card.appendChild(image);
            card.appendChild(name);
            card.appendChild(description);
            card.appendChild(editBtn);

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Errore nel caricamento categorie:", error);
        const container = document.getElementById("category-container");
        container.innerHTML = "<p>Errore nel caricamento delle categorie.</p>";
    }
};
