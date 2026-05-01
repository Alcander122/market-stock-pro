import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { PedidoItem } from '../entities/pedido-item.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

// Estados válidos para el flujo de la tienda
export enum EstadoPedido {
    PENDIENTE = 'PENDIENTE',
    PREPARANDO = 'PREPARANDO',
    ENVIADO = 'ENVIADO',
    ENTREGADO = 'ENTREGADO',
    CANCELADO = 'CANCELADO'
}

@Entity('pedidos')
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @Column({ type: 'decimal' })
    total: number;

    @Column({
        type: 'varchar',
        default: EstadoPedido.PENDIENTE // Estado inicial automático
    })
    estado: string;

    @Column({ name: 'metodo_pago' })
    metodoPago: string;

    @Column({ name: 'ubicacion_entrega', nullable: true })
    ubicacionEntrega: string;

    @Column({ name: 'creado_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creadoAt: Date;

    @OneToMany(() => PedidoItem, item => item.pedido, { cascade: true })
    items: PedidoItem[];
}