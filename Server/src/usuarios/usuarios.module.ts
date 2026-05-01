import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  // 🔥 ¡ESTA ES LA PARTE CLAVE! 
  // Debes exportarlo para que AuthModule pueda verlo.
  exports: [UsuariosService],
})
export class UsuariosModule { }