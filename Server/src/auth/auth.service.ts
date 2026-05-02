import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService, // Inyecta el servicio real
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usuariosService.findByEmail(email);

        // 🛠️ LÍNEA TEMPORAL PARA OBTENER EL HASH CORRECTO
        const hashPrueba = await bcrypt.hash(pass, 10);

        console.log('--- DEPURACIÓN DE LOGIN ---');
        console.log('Email recibido:', email);
        console.log('¿Usuario encontrado?:', user ? 'SÍ' : 'NO');

        // 🚩 MIRA ESTO EN TU TERMINAL
        console.log('USA ESTE HASH EN TU DB:', hashPrueba);

        if (user) {
            console.log('Password en DB:', user.password);
            const isMatch = await bcrypt.compare(pass, user.password);
            console.log('¿Contraseña coincide?:', isMatch);
        }
        console.log('---------------------------');

        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        // Generamos el payload para el token
        const payload = { email: user.email, sub: user.id, rol: user.rol };
        return {
            ...user,
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(userDto: any) {
        const user = await this.usuariosService.create(userDto);
        const { password, ...result } = user;
        return this.login(result);
    }
}