import {aplicarFiltros} from "./filtrado.js";
import {cargarModalCrearProducto, modificarCabeceraTablaProductos} from "./home/productos.js";
import {cargarModalCrearCategoria, modificarCabeceraTablaCategoria} from "./home/categorias.js";

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

        modificarBotonAdd("add-item-btn", "Add Category",cargarModalCrearCategoria);

        await modificarCabeceraTablaCategoria();
    }
    else{
        document.getElementById("filtro-productos").classList.remove("hidden");

        document.body.dataset.vista = "productos";
        await aplicarFiltros("productos");

        document.getElementById("category-btn").textContent = "Show All Category";
        document.getElementById("add-item-btn").textContent = "Add Item";

        modificarBotonAdd("add-item-btn", "Add Item", cargarModalCrearProducto);

        await modificarCabeceraTablaProductos();
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
