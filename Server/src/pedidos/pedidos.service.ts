import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';
import { Repository } from 'typeorm';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {

    constructor(
        @InjectRepository(Pedido)
        private pedidoRepo: Repository<Pedido>,

        @InjectRepository(PedidoItem)
        private itemRepo: Repository<PedidoItem>,
    ) { }

    async crearPedido(dto: CreatePedidoDto) {

        const pedido = this.pedidoRepo.create({
            usuario: { id: dto.usuarioId },
            total: dto.total,
            estado: 'PENDIENTE',
            items: dto.items.map(i => ({
                producto: { id: i.productoId },
                cantidad: i.cantidad,
                precioUnitario: i.precio
            }))
        });

        return await this.pedidoRepo.save(pedido);
    }

    async obtenerHistorial(usuarioId: number) {
        return this.pedidoRepo.find({
            where: {
                usuario: { id: usuarioId }
            },
            relations: ['items', 'items.producto'],
            order: { creadoAt: 'DESC' }
        });
    }
}