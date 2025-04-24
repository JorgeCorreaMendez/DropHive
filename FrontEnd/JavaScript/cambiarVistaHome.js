import {aplicarFiltros} from "./filtrado.js";
import { modificarCabeceraTablaProductos} from "./home/productos.js";
import {modificarCabeceraTablaCategoria} from "./home/categorias.js";

document.getElementById("category-btn").addEventListener("click", async () => {
    await cambiar_filtros();
})

async function cambiar_filtros() {
    const vistaActual = document.body.dataset.vista;

    console.log("En cambiar filtro:", vistaActual);
    if(vistaActual === "productos") {
        document.getElementById("filtro-productos").classList.add("hidden");

        document.body.dataset.vista = "categorias";
        await aplicarFiltros("categorias");

        document.getElementById("category-btn").textContent = "Show All Items";
        document.getElementById("add-item-btn").textContent = "Add Category";

        await modificarCabeceraTablaCategoria();
    }
    else{
        document.getElementById("filtro-productos").classList.remove("hidden");

        document.body.dataset.vista = "productos";
        await aplicarFiltros("productos");

        document.getElementById("category-btn").textContent = "Show All Category";
        document.getElementById("add-item-btn").textContent = "Add Item";

        await modificarCabeceraTablaProductos();
    }

}