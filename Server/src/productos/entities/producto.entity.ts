// src/productos/entities/producto.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from './categoria.entity'; // 👈 Usa ruta relativa directa si están en la misma carpeta

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  // Usa una función de flecha para evitar problemas de carga
  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @Column({ name: 'precio_referencia', type: 'decimal' })
  precioReferencia: number;

  @Column({ name: 'unidad_medida' })
  unidadMedida: string;

  @Column({ type: 'decimal', name: 'stock_actual' })
  stockActual: number;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ name: 'imagen_url', nullable: true })
  imagenUrl: string;
}