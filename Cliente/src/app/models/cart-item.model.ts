// Representa un producto dentro del carrito
export interface CartItem {
    id: number;            // Identificador único del producto
    nombre: string;        // Nombre del producto
    precio: number;        // Precio unitario
    imagenUrl?: string;    // Imagen opcional
    cantidad: number;      // Cantidad seleccionada

    // Campo opcional para cualquier tipo de negocio (tallas, notas, etc.)
    metadata?: any;
}