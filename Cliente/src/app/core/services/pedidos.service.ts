import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PedidosService {

    private api = 'http://localhost:3000/api/pedidos';

    constructor(private http: HttpClient) { }

    // 🧾 Crear pedido
    crearPedido(data: any): Observable<any> {
        return this.http.post(this.api, data);
    }

    // 📜 Historial
    obtenerHistorial(usuarioId: number): Observable<any> {
        return this.http.get(`${this.api}/usuario/${usuarioId}`);
    }
}