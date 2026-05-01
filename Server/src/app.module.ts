// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ✅ RUTAS CORREGIDAS (Sin el /src/ intermedio)
import { ProductosModule } from './productos/productos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'admin123',
            database: 'fruver_base_template',
            autoLoadEntities: true,
            synchronize: false,
        }),
        ProductosModule,
        PedidosModule,
        UsuariosModule,
        AuthModule,
    ],
})
export class AppModule { }