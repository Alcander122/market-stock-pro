export class CreatePedidoDto {
    usuarioId: number;

    items: {
        productoId: number;
        cantidad: number;
        precio: number;
    }[];

    total: number;
}