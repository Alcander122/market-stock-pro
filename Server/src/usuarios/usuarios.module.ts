import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario])
  ],
  exports: [TypeOrmModule] // 👈 CLAVE para usarlo en pedidos
})
export class UsuariosModule { }