import {aplicarFiltros} from "./filtrado.js";

document.getElementById("category-btn").addEventListener("click", async () => {
    await aplicarFiltros("category");
})