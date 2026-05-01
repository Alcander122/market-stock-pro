import { Controller, Post, Body, Get, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedidos')
export class PedidosController {

    constructor(private readonly service: PedidosService) { }

    @Post()
    crear(@Body() dto: CreatePedidoDto) {
        return this.service.crearPedido(dto);
    }

    // Para el administrador: Ver flujo global
    @Get('admin/todos')
    obtenerTodos() {
        return this.service.obtenerTodosParaAdmin();
    }

    // Para el administrador: Cambiar estado del pedido
    @Patch(':id/estado')
    actualizarEstado(
        @Param('id', ParseIntPipe) id: number,
        @Body('nuevoEstado') nuevoEstado: string
    ) {
        return this.service.actualizarEstado(id, nuevoEstado);
    }

    @Get('usuario/:id')
    historial(@Param('id') id: string) {
        return this.service.obtenerHistorial(+id);
    }
}