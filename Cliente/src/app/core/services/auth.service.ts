import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private api = 'http://localhost:3000/api/auth';

    private usuarioSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('usuario') || 'null'));
    usuario$ = this.usuarioSubject.asObservable();

    constructor(private http: HttpClient) { }

    login(credenciales: any) {
        return this.http.post(`${this.api}/login`, credenciales).pipe(
            tap((response: any) => {
                const { access_token, ...user } = response;
                localStorage.setItem('token', access_token);
                localStorage.setItem('usuario', JSON.stringify(user));
                this.usuarioSubject.next(user);
            })
        );
    }

    register(datos: any) {
        return this.http.post(`${this.api}/register`, datos).pipe(
            tap((response: any) => {
                const { access_token, ...user } = response;
                localStorage.setItem('token', access_token);
                localStorage.setItem('usuario', JSON.stringify(user));
                this.usuarioSubject.next(user);
            })
        );
    }

    logout() {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        this.usuarioSubject.next(null);
    }

    getUsuario() {
        return this.usuarioSubject.value;
    }
}
