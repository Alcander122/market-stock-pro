import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../../productos/entities/categoria.entity'; // <-- Revisa que esta ruta sea correcta

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // ESTO ES LO QUE FALTA: Definir la relación
  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'categoria_id' }) // Mapea la columna categoria_id de tu DB
  categoria: Categoria; // <--- Ahora el Service sí encontrará esta propiedad

  @Column({ name: 'precio_referencia', type: 'decimal' })
  precioReferencia: number;

  @Column({ name: 'unidad_medida' })
  unidadMedida: string;

  @Column({ type: 'decimal', name: 'stock_actual' })
  stockActual: number;

  @Column({ nullable: true })
  descripcion: string;
  // AGREGA ESTO: Mapeo de la columna de imagen
  @Column({ name: 'imagen_url', nullable: true })
  imagenUrl: string;
}