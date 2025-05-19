document.addEventListener("DOMContentLoaded", async () => {
    await loadCategories();
});

const loadCategories = async () => {
    try {
        const response = await fetch("/get_all_categories");
        if (!response.ok) throw new Error("Error retrieving categories");

        const categories = await response.json();
        const container = document.getElementById("categories-container");
        container.innerHTML = "";

        if (!Array.isArray(categories) || categories.length === 0) {
            container.innerHTML = "<p>No categories found.</p>";
            return;
        }

        categories.forEach(category => {
            const card = document.createElement("div");
            card.className = "category-card bg-white rounded-xl shadow p-4 m-4";

            const name = document.createElement("h3");
            name.textContent = category.name;
            name.className = "text-xl font-bold text-center mt-4";

            const description = document.createElement("p");
            description.textContent = category.description;
            description.className = "text-gray-700 mt-2 text-center";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Modify";
            editBtn.className = "bg-blue-500 text-white px-4 py-1 rounded mt-4 block mx-auto";
            editBtn.addEventListener("click", () => {
                localStorage.setItem("editCategoryId", category.id);
                window.location.href = "/addAndModifyCategory";
            });

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "bg-red-500 text-white px-4 py-1 rounded mt-2 block mx-auto";
            deleteBtn.addEventListener("click", async () => {
                if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
                    try {
                        const deleteResponse = await fetch(`/delete_category?id=${category.id}`, {
                            method: "DELETE"
                        });
                        if (!deleteResponse.ok) throw new Error("Error deleting category");
                        await loadCategories(); // Reload the list
                    } catch (err) {
                        alert("Error deleting category.");
                        console.error(err);
                    }
                }
            });

            card.appendChild(name);
            card.appendChild(description);
            card.appendChild(editBtn);
            card.appendChild(deleteBtn);

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading categories:", error);
        const container = document.getElementById("category-container");
        container.innerHTML = "<p>Error loading categories.</p>";
    }
};
