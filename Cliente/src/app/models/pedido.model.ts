export interface Pedido {
    id: number;
    total: number;
    estado: string;
    creadoAt: Date;
    items: PedidoItem[]; // 👈 Esto permite acceder al detalle
}

export interface PedidoItem {
    cantidad: number;
    precioUnitario: number;
    producto: {
        nombre: string;
        imagenUrl?: string;
    };
}