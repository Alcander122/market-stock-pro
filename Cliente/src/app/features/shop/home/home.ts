import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../../core/services/productos.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { CartComponent } from '../../../shared/components/cart/cart.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { Producto } from '../../../shared/models/producto.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CartComponent, HeaderComponent, ProductCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private productoService = inject(ProductosService);
  private carritoService = inject(CarritoService);

  // Signals
  productos = signal<Producto[]>([]);
  categoriaSeleccionada = signal<number>(0);
  terminoBusqueda = signal<string>('');
  carritoVisible = signal<boolean>(false);

  categorias = [
    { id: 1, nombre: 'Frutas', icono: '🍎' },
    { id: 2, nombre: 'Verduras', icono: '🥦' },
    { id: 4, nombre: 'Lácteos', icono: '🥛' },
    { id: 5, nombre: 'Aseo', icono: '🧼' },
    { id: 6, nombre: 'Despensa', icono: '🥫' },
    { id: 3, nombre: 'Abarrotes', icono: '🛍️' },
    { id: 7, nombre: 'Carnes', icono: '🥩' }
  ];

  // Computed Signal for real-time filtering
  productosFiltrados = computed(() => {
    const todos = this.productos();
    const cat = this.categoriaSeleccionada();
    const texto = this.terminoBusqueda().toLowerCase();

    return todos.filter(p => {
      // Filtrado por categoría
      let catId: number | null = null;
      if (p.categoriaId !== undefined && p.categoriaId !== null) {
        catId = Number(p.categoriaId);
      } else if (p.categoria?.id !== undefined) {
        catId = Number(p.categoria.id);
      } else if ((p as any).categoria_id !== undefined) {
        catId = Number((p as any).categoria_id);
      }

      const matchCat = cat === 0 || catId === cat;
      const matchText = p.nombre.toLowerCase().includes(texto);

      return matchCat && matchText;
    });
  });

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
      },
      error: (err) => console.error(err)
    });
  }

  filtrarPor(idCategoria: number) {
    this.categoriaSeleccionada.set(idCategoria);
  }

  buscarProducto(event: any) {
    this.terminoBusqueda.set(event.target.value);
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregar(producto);
  }

  abrirCarrito() {
    this.carritoVisible.set(true);
  }

  cerrarCarrito() {
    this.carritoVisible.set(false);
  }
}
