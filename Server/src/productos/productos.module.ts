// src/productos/productos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Categoria } from './entities/categoria.entity';

@Module({
  imports: [
    // 🔥 Registra ambas para que la metadata de la relación sea visible
    TypeOrmModule.forFeature([Producto, Categoria])
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [TypeOrmModule]
})
export class ProductosModule { }