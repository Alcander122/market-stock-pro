import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';

@Entity('usuarios')
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'nombre_completo' })
    nombreCompleto: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    telefono: string;

    @Column()
    rol: string;

    @Column({ name: 'direccion_principal', nullable: true })
    direccion: string;

    @Column({ name: 'creado_at', type: 'timestamp' })
    creadoAt: Date;

    // 🔥 Relación con pedidos
    @OneToMany(() => Pedido, pedido => pedido.usuario)
    pedidos: Pedido[];
}