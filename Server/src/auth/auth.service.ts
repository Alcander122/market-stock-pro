import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
    constructor(private readonly usuariosService: UsuariosService) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usuariosService.findByEmail(email); //
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}