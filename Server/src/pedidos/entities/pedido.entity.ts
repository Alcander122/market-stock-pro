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

@Entity('pedidos')
export class Pedido {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;
    /*@Column({ name: 'usuario_id' })
    usuarioId: number;*/

    @Column({ type: 'decimal' })
    total: number;

    @Column()
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