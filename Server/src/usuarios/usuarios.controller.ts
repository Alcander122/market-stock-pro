import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Get(':email')
    async findOne(@Param('email') email: string) {
        const user = await this.usuariosService.findByEmail(email);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }
}