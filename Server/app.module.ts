// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './src/productos/productos.module';
import { Producto } from './src/productos/entities/producto.entity'; // Importa Producto
import { Categoria } from './src/productos/entities/categoria.entity'; // <-- Revisa que esta ruta sea correcta

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'admin123',
            database: 'fruver_base_template',
            // Si autoLoadEntities falla, pasamos la lista manualmente:
            entities: [Producto, Categoria],
            synchronize: false,
        }),
        ProductosModule,
    ],
})
export class AppModule { }