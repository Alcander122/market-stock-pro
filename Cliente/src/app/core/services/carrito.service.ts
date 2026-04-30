import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

@Injectable({
    providedIn: 'root'
})
export class CarritoService {

    // 🔐 Clave para guardar en localStorage
    private storageKey = 'carrito_app';

    // 🧠 Estado interno del carrito
    private items: CartItem[] = [];

    // 🔄 Observable para reaccionar a cambios
    private itemsSubject = new BehaviorSubject<CartItem[]>([]);
    items$ = this.itemsSubject.asObservable();

    constructor() {
        this.cargarDesdeStorage();
    }

    // ➕ Agregar producto
    agregar(producto: any) {
        const index = this.items.findIndex(i => i.id === producto.id);

        if (index !== -1) {
            // Si ya existe → aumenta cantidad
            this.items[index].cantidad++;
        } else {
            // Si no existe → lo agrega
            this.items.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precioReferencia,
                imagenUrl: producto.imagenUrl,
                cantidad: 1
            });
        }

        this.actualizar();
    }

    // ➖ Disminuir cantidad
    disminuir(index: number) {
        if (this.items[index].cantidad > 1) {
            this.items[index].cantidad--;
        } else {
            this.eliminar(index);
            return;
        }

        this.actualizar();
    }

    // 🗑️ Eliminar producto
    eliminar(index: number) {
        this.items.splice(index, 1);
        this.actualizar();
    }

    // 🧹 Vaciar carrito
    limpiar() {
        this.items = [];
        this.actualizar();
    }

    // 💰 Total del carrito
    getTotal(): number {
        return this.items.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
    }

    // 🔢 Total de unidades (tipo Amazon)
    getCantidadTotal(): number {
        return this.items.reduce((acc, i) => acc + i.cantidad, 0);
    }

    // 🔄 Notifica cambios + guarda en localStorage
    private actualizar() {
        this.itemsSubject.next(this.items);
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    }

    // 📦 Recupera carrito guardado
    private cargarDesdeStorage() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            this.items = JSON.parse(data);
            this.itemsSubject.next(this.items);
        }
    }
}