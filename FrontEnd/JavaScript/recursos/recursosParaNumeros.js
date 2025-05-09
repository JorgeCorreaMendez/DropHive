export function obtenerValorPrecio(valor) {
    // Reemplaza las comas por puntos
    let valorNormalizado = valor.trim().replace(',', '.');

    // Verifica si es un número válido
    if (!isNaN(valorNormalizado)) {
        return parseFloat(valorNormalizado); // Convierte a float para manejar decimales
    }
    return null; // Si no es un número válido, retorna null
}