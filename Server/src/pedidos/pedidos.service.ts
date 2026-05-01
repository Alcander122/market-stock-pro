import { Injectable, BadRequestException } from '@nestjs/common';
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

    async crearPedido(dto: CreatePedidoDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Crear el pedido usando el manager de la transacción
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

            // 2. Procesar stock de cada producto
            for (const item of dto.items) {
                // Bloqueamos la fila para evitar que dos compras al mismo tiempo causen errores
                const producto = await queryRunner.manager.findOne(Producto, {
                    where: { id: item.productoId },
                    lock: { mode: 'pessimistic_write' }
                });

                if (!producto) {
                    throw new BadRequestException(`Producto con ID ${item.productoId} no encontrado`);
                }

                // IMPORTANTE: Convertir el stock de string (Postgres numeric) a número
                const stockActual = Number(producto.stock);

                if (stockActual < item.cantidad) {
                    throw new BadRequestException(`Stock insuficiente para ${producto.nombre}. Disponible: ${stockActual}`);
                }

                // 3. Actualización explícita para asegurar que el cambio se guarde
                const nuevoStock = stockActual - item.cantidad;

                await queryRunner.manager.update(Producto, producto.id, {
                    stock: nuevoStock
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