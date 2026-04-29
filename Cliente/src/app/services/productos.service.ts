import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductosService {
    // Inyectamos el cliente HTTP (el que habilitamos en app.config.ts)
    private http = inject(HttpClient);

    // La dirección de tu Backend en NestJS
    private apiUrl = 'http://localhost:3000/api/productos';

    obtenerProductos(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
    actualizarProducto(id: number, datosActualizados: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}`, datosActualizados);
    }
    // NUEVO MÉTODO: Para subir la imagen al servidor
    subirImagen(id: number, formData: FormData): Observable<any> {
        // Apunta al endpoint @Post(':id/upload') que creamos en el controlador
        return this.http.post<any>(`${this.apiUrl}/${id}/upload`, formData);
    }
    crearProducto(producto: any): Observable<any> {
        // Asegúrate de que apiUrl sea 'http://localhost:3000/api/productos'
        return this.http.post<any>(this.apiUrl, producto);
    }
}