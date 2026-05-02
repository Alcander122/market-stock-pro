import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../shared/models/producto.interface';

@Injectable({
    providedIn: 'root'
})
export class ProductosService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/productos';

    obtenerProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.apiUrl);
    }

    actualizarProducto(id: number, data: Partial<Producto>): Observable<Producto> {
        return this.http.patch<Producto>(`${this.apiUrl}/${id}`, data);
    }

    crearProducto(producto: Partial<Producto>): Observable<Producto> {
        return this.http.post<Producto>(this.apiUrl, producto);
    }

    subirImagen(id: number, formData: FormData) {
        return this.http.post(`${this.apiUrl}/${id}/upload`, formData);
    }
}
