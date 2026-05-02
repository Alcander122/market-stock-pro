import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
    ) { }

    async findByEmail(email: string): Promise<Usuario | null> {
        return await this.usuarioRepo.findOne({
            where: { email },
            // Forzamos a que traiga la contraseña, el rol y el email
            select: ['id', 'nombreCompleto', 'email', 'password', 'rol']
        });
    }

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepo.find();
    }

    async findOne(id: number): Promise<Usuario> {
        const usuario = await this.usuarioRepo.findOne({ where: { id } });
        if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        return usuario;
    }

    async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
        // Al usar el DTO, TypeScript entiende que 'password' es una propiedad válida
        const nuevoUsuario = this.usuarioRepo.create(createUsuarioDto);

        if (createUsuarioDto.password) {
            const salt = await bcrypt.genSalt();
            nuevoUsuario.password = await bcrypt.hash(createUsuarioDto.password, salt);
        }

        return await this.usuarioRepo.save(nuevoUsuario);
    }

    async update(id: number, updateUsuarioDto: any): Promise<Usuario> {
        const usuario = await this.findOne(id);

        if (updateUsuarioDto.password) {
            const salt = await bcrypt.genSalt();
            updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, salt);
        }

        const usuarioActualizado = this.usuarioRepo.merge(usuario, updateUsuarioDto);
        return await this.usuarioRepo.save(usuarioActualizado);
    }

    async remove(id: number): Promise<void> {
        const usuario = await this.findOne(id);
        await this.usuarioRepo.remove(usuario);
    }
}