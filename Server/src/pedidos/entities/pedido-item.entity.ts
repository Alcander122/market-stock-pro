import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('pedido_items')
export class PedidoItem {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Pedido)
    @JoinColumn({ name: 'pedido_id' })
    pedido: Pedido;

    @ManyToOne(() => Producto)
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    @Column()
    cantidad: number;

    @Column({ name: 'precio_unitario_historico', type: 'decimal' })
    precioUnitario: number;
}