import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../../shared/models/pedido.interface';

@Injectable({
    providedIn: 'root'
})
export class PedidosService {

    private api = 'http://localhost:3000/api/pedidos';

    constructor(private http: HttpClient) { }

    crearPedido(data: any): Observable<Pedido> {
        return this.http.post<Pedido>(this.api, data);
    }

    obtenerHistorial(usuarioId: number): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(`${this.api}/usuario/${usuarioId}`);
    }

    obtenerTodosParaAdmin(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(`${this.api}/admin/todos`);
    }

    actualizarEstado(id: number, estado: string) {
        return this.http.patch(`${this.api}/${id}/estado`, { nuevoEstado: estado });
    }
}
