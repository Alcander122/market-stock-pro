import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedidos')
export class PedidosController {

    constructor(private readonly service: PedidosService) { }

    @Post()
    crear(@Body() dto: CreatePedidoDto) {
        return this.service.crearPedido(dto);
    }

    @Get('usuario/:id')
    historial(@Param('id') id: string) {
        return this.service.obtenerHistorial(+id);
    }
}