import { IsNumber, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 1. Definimos la estructura de cada producto dentro del carrito
class PedidoItemDto {
    @IsNumber()
    @IsNotEmpty()
    productoId: number;

    @IsNumber()
    @IsNotEmpty()
    cantidad: number;

    @IsNumber()
    @IsNotEmpty()
    precio: number;
}

// 2. Clase principal para crear el pedido
export class CreatePedidoDto {

    @IsNumber()
    @IsNotEmpty()
    usuarioId: number;

    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true }) // Valida cada objeto dentro del array
    @Type(() => PedidoItemDto)      // Indica a qué clase pertenece cada item
    items: PedidoItemDto[];

    @IsNumber()
    @IsNotEmpty()
    total: number;
}