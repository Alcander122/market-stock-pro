import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('categorias') // Nombre exacto de tu tabla en pgAdmin
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Relación inversa: Una categoría tiene muchos productos
  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}