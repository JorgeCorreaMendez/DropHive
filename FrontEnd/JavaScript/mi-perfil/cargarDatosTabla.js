import {cargarDatosEnTablaPerfil} from "./profile.js";

export async function recuperarCuentas() {
    try {
        const response = await fetch(`http://127.0.0.1:4000/accounts`);

        // Verifica que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        // Espera la respuesta JSON
        const respuesta_json = await response.json();

        console.log(respuesta_json);

        // Aquí puedes trabajar con los datos obtenidos de la API
        await cargarDatosEnTablaPerfil(respuesta_json);
        //await initPagination(respuesta_json.length);

        return respuesta_json.length;

    } catch (error) {
        console.error('Hubo un error al hacer la solicitud:', error);
    }
}

export async function addInformacionFilaEmpleado(item) {
    const row = document.createElement('tr');
    row.classList.add(
        'bg-[#D9D9D9]',
        'gap-[5px]',
        'text-center',
        'modal-trigger',
        'cursor-pointer',
        'hover:bg-[#bfbfbf]', // un tono más oscuro que #D9D9D9
        'transition-colors',
        'duration-200',
    );


    row.id = "list-article"
    row.setAttribute('data-product-id', item.id);

    // A partir de aquí se muestran los elementos de las columnas
    const idCell = document.createElement('td');
    idCell.classList.add('p-2', 'rounded-[5px]');
    idCell.textContent = item.id;

    const mailCell = document.createElement('td');
    mailCell.classList.add('p-2', 'rounded-[5px]');
    mailCell.textContent = item.mail;

    let privilegioId = await localizarPrivilegio(item.privilege_id)

    const privilegeCell = document.createElement('td');
    privilegeCell.classList.add('p-2', 'rounded-[5px]');
    privilegeCell.textContent = privilegioId;

    //Agregamos las celdas a la fila
    row.appendChild(idCell);
    row.appendChild(mailCell);
    row.appendChild(privilegeCell);

    return row;
}

/*
TODO:
Crear función en el backend para buscar privilegios por id.
 */
export async function localizarPrivilegio(id) {
    try {
        const response = await fetch(`http://127.0.0.1:4000/get_privilege?id=${id}`)

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        return data.name
    } catch (e) {
        console.log(e)
    }
}