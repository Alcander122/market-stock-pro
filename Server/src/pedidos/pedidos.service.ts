import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {
    constructor(
        @InjectRepository(Pedido)
        private pedidoRepo: Repository<Pedido>,
        @InjectRepository(Producto)
        private productoRepo: Repository<Producto>,
        private dataSource: DataSource,
    ) { }

    // Crea el pedido y descuenta stock (Lógica validada)
    async crearPedido(dto: CreatePedidoDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const pedido = queryRunner.manager.create(Pedido, {
                usuario: { id: dto.usuarioId },
                total: dto.total,
                estado: 'PENDIENTE',
                items: dto.items.map(i => ({
                    producto: { id: i.productoId },
                    cantidad: i.cantidad,
                    precioUnitario: i.precio
                }))
            });

            const pedidoGuardado = await queryRunner.manager.save(pedido);

            for (const item of dto.items) {
                const producto = await queryRunner.manager.findOne(Producto, {
                    where: { id: item.productoId },
                    lock: { mode: 'pessimistic_write' }
                });

                if (!producto) throw new BadRequestException(`Producto ${item.productoId} no encontrado`);

                const stockActual = Number(producto.stock);
                if (stockActual < item.cantidad) {
                    throw new BadRequestException(`Stock insuficiente para ${producto.nombre}`);
                }

                await queryRunner.manager.update(Producto, producto.id, {
                    stock: stockActual - item.cantidad
                });
            }

            await queryRunner.commitTransaction();
            return pedidoGuardado;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // Nuevo: Actualizar el estado de un pedido específico
    async actualizarEstado(id: number, nuevoEstado: string) {
        const pedido = await this.pedidoRepo.findOne({ where: { id } });
        if (!pedido) throw new NotFoundException(`Pedido #${id} no encontrado`);

        pedido.estado = nuevoEstado;
        return await this.pedidoRepo.save(pedido);
    }

    // Nuevo: Obtener todos los pedidos para el administrador
    async obtenerTodosParaAdmin() {
        return await this.pedidoRepo.find({
            relations: ['usuario', 'items', 'items.producto'],
            order: { creadoAt: 'DESC' }
        });
    }

    async obtenerHistorial(usuarioId: number) {
        return this.pedidoRepo.find({
            where: { usuario: { id: usuarioId } },
            relations: ['items', 'items.producto'],
            order: { creadoAt: 'DESC' }
        });
    }
}