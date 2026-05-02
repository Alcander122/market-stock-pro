import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Post()
    async create(@Body() createUsuarioDto: any) {
        return this.usuariosService.create(createUsuarioDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.usuariosService.findAll();
    }

    @Get('email/:email')
    async findByEmail(@Param('email') email: string) {
        const user = await this.usuariosService.findByEmail(email);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usuariosService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUsuarioDto: any) {
        return this.usuariosService.update(+id, updateUsuarioDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usuariosService.remove(+id);
    }
}