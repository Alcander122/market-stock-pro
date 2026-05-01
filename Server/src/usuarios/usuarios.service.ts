import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
    ) { }

    // 🔥 Este es el método que nos faltaba
    async findByEmail(email: string): Promise<Usuario | null> {
        return await this.usuarioRepo.findOne({
            where: { email: email }
        });
    }

    // ... tus otros métodos (crear, obtener uno, etc.)
}