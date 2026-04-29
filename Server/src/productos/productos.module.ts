import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar esto
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity'; // Importar tu entidad

@Module({
  imports: [
    // Esto "registra" la tabla de productos para que el servicio pueda usarla
    TypeOrmModule.forFeature([Producto])
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule { }