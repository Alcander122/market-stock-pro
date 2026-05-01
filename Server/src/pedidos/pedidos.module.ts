import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Producto } from '../productos/entities/producto.entity'; // 👈 Importante

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, PedidoItem, Producto])
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule { }