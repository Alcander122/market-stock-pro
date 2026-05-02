export interface PedidoVista {
    id: number;
    creadoAt: Date | string; // Asegúrate de que coincida con el nombre en tu entidad
    total: number;
    estado: string;
    items: any[];           // Lista de productos del pedido
    expandido: boolean;     // Propiedad para el acordeón
}