import {recuperarNombreBaseDatos} from "../../recursos.js";
import {cargarDatosArticulo} from "./cargarDatosArticulo.js";
import {modificarArticulo} from "./modificarProducto.js";
import {openModal} from "../abrirYCerrarModal.js";
import {eliminarArticulo} from "./eliminarArticulo.js"; // adjust path if necessary

export function initializeRowClickHandler() {
    const tableBody = document.getElementById("table-body");

    if (!tableBody) {
        console.error("Could not find tbody with ID table-body");
        return;
    }

    tableBody.addEventListener("click", async (event) => {
        const clickedRow = event.target.closest("tr[data-product-id]");
        if (!clickedRow) return;
        const id_product = clickedRow.getAttribute("data-product-id");
        if (!id_product) return;
        try {
            let response = await fetch(`filter_product_by_id?id=${id_product}`);
            const object = await response.json();

            response = await fetch(`readArticle`);
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const bodyContent = doc.body.innerHTML;

            openModal(bodyContent);
            await cargarDatosArticulo(object[0]);
            await modificarArticulo(object[0]);
            await eliminarArticulo();
        } catch (err) {
            console.error("Error loading modal:", err);
            Swal.fire({
                icon: 'error',
                title: "Error loading modal",
                html: err.message || "An unexpected error occurred.",
                timer: 2500,
                showConfirmButton: false
            });
        }
    });
}
