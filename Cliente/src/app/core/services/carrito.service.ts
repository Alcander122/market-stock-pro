import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../../shared/models/cart-item.interface';
import { Producto } from '../../shared/models/producto.interface';

@Injectable({
    providedIn: 'root'
})
export class CarritoService {


    private readonly storageKey = 'hz_cart_data';

    // State
    items = signal<CartItem[]>([]);

    // Computed properties
    total = computed(() => {
        return this.items().reduce((acc, i) => acc + (Number(i.precio) * i.cantidad), 0);
    });

    cantidadTotal = computed(() => {
        return this.items().reduce((acc, i) => acc + i.cantidad, 0);
    });

    constructor() {
        this.cargarDesdeStorage();
    }

    agregar(producto: Producto) {
        this.items.update(currentItems => {
            const newItems = [...currentItems];
            const index = newItems.findIndex(i => i.id === producto.id);

            if (index !== -1) {
                newItems[index] = { ...newItems[index], cantidad: newItems[index].cantidad + 1 };
            } else {
                newItems.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precioReferencia,
                    imagenUrl: producto.imagenUrl,
                    cantidad: 1
                });
            }
            this.guardarEnStorage(newItems);
            return newItems;
        });
    }

    disminuir(index: number) {
        this.items.update(currentItems => {
            const newItems = [...currentItems];
            if (newItems[index].cantidad > 1) {
                newItems[index] = { ...newItems[index], cantidad: newItems[index].cantidad - 1 };
            } else {
                newItems.splice(index, 1);
            }
            this.guardarEnStorage(newItems);
            return newItems;
        });
    }

    aumentarCantidad(index: number) {
        this.items.update(currentItems => {
            const newItems = [...currentItems];
            newItems[index] = { ...newItems[index], cantidad: newItems[index].cantidad + 1 };
            this.guardarEnStorage(newItems);
            return newItems;
        });
    }

    eliminar(index: number) {
        this.items.update(currentItems => {
            const newItems = [...currentItems];
            newItems.splice(index, 1);
            this.guardarEnStorage(newItems);
            return newItems;
        });
    }

    limpiar() {
        this.items.set([]);
        localStorage.removeItem(this.storageKey);
    }

    private guardarEnStorage(items: CartItem[]) {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    private cargarDesdeStorage() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            this.items.set(JSON.parse(data));
        }
    }
}
