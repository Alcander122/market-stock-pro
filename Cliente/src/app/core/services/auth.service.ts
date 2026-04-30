import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    getUsuario() {
        return JSON.parse(localStorage.getItem('usuario') || 'null');
    }

    estaLogueado(): boolean {
        return !!this.getUsuario();
    }
}