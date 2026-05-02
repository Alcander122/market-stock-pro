import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from './categoria.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @Column({ name: 'precio_referencia', type: 'decimal' })
  precioReferencia: number;

  @Column({ name: 'unidad_medida' })
  unidadMedida: string;

  // 💡 Mantenemos solo una propiedad mapeada a 'stock_actual'
  // Usamos el nombre 'stock' para que coincida con tu lógica del servicio
  @Column({ name: 'stock_actual', type: 'numeric', precision: 10, scale: 2, default: 0 })
  stock: number;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ name: 'imagen_url', nullable: true })
  imagenUrl: string;

  // En Server/src/productos/entities/producto.entity.ts
  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata: any;
}