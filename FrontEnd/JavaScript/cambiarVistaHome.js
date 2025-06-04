import {aplicarFiltros} from "./filtrado.js";
import {cargarModalCrearProducto, modificarCabeceraTablaProductos} from "./home/productos.js";
import {cargarModalCrearCategoria, modificarCabeceraTablaCategoria} from "./home/categorias.js";
import {cargarModalCrearCompany, modificarCabeceraTablaCompany} from "./home/company.js";

document.getElementById("category-btn").addEventListener("click", async () => {
    await cambiar_filtros("categorias");
})

document.getElementById("company-btn").addEventListener("click", async () => {
    await cambiar_filtros("company");
})

document.getElementById("item-btn").addEventListener("click", async () => {
    await cambiar_filtros("productos");
})

async function cambiar_filtros(new_vista) {
    document.body.dataset.vista = new_vista;
    const vistaActual = document.body.dataset.vista;

    console.log(vistaActual)

    if (vistaActual === "categorias") {
        document.getElementById("filtro-productos").classList.add("hidden");
        document.getElementById("category-btn").classList.add("hidden");
        document.getElementById("item-btn").classList.remove("hidden");
        document.getElementById("company-btn").classList.remove("hidden");

        await aplicarFiltros("categorias");

        document.getElementById("category-btn").textContent = "Show All Items";
        document.getElementById("add-item-btn").textContent = "Add Category";

        modificarBotonAdd("add-item-btn", "Add Category", cargarModalCrearCategoria);

        await modificarCabeceraTablaCategoria();
    } else if (vistaActual === "productos") {
        document.getElementById("filtro-productos").classList.remove("hidden");
        document.getElementById("category-btn").classList.remove("hidden");
        document.getElementById("item-btn").classList.add("hidden");
        document.getElementById("company-btn").classList.remove("hidden");

        await aplicarFiltros("productos");

        document.getElementById("category-btn").textContent = "Show All Categories";
        document.getElementById("add-item-btn").textContent = "Add Item";

        modificarBotonAdd("add-item-btn", "Add Item", cargarModalCrearProducto);

        await modificarCabeceraTablaProductos();
    } else if (vistaActual === "company") {
        document.getElementById("filtro-productos").classList.add("hidden");
        document.getElementById("category-btn").classList.remove("hidden");
        document.getElementById("item-btn").classList.remove("hidden");
        document.getElementById("company-btn").classList.add("hidden");

        await aplicarFiltros("company");

        document.getElementById("category-btn").textContent = "Show All Categories";
        document.getElementById("add-item-btn").textContent = "Add Item";

        modificarBotonAdd("add-item-btn", "Add company", cargarModalCrearCompany);

        await modificarCabeceraTablaCompany();
    }

}

function modificarBotonAdd(nombreBoton, textoNuevo, nuevaAccion) {
    const addBtn = document.getElementById(nombreBoton);
    if (!addBtn) return;

    // Clonar el botón para quitar TODOS los eventListeners
    const nuevoBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(nuevoBtn, addBtn);

    // Cambiar el texto del botón
    nuevoBtn.textContent = textoNuevo;

    // Agregar nuevo eventListener
    nuevoBtn.addEventListener("click", nuevaAccion);
}