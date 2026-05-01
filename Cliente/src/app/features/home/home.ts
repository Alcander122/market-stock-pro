import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../core/services/productos.service';
import { CarritoService } from '../../core/services/carrito.service';
import { CartComponent } from '../../shared/components/cart/cart.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CartComponent, HeaderComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private cdr = inject(ChangeDetectorRef);


  productos: any[] = [];
  productosFiltrados: any[] = [];
  categoriaSeleccionada = 0;

  carritoVisible = false;

  categorias = [
    { id: 1, nombre: 'Frutas', icono: '🍎' },
    { id: 2, nombre: 'Verduras', icono: '🥦' },
    { id: 4, nombre: 'Lácteos', icono: '🥛' },
    { id: 5, nombre: 'Aseo', icono: '🧼' },
    { id: 6, nombre: 'Despensa', icono: '🥫' },
    { id: 3, nombre: 'Abarrotes', icono: '🛍️' },
    { id: 7, nombre: 'Carnes', icono: '🥩' }
  ];

  constructor(
    private productoService: ProductosService,
    private carritoService: CarritoService,

  ) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;

        // 💡 DEBE IR AQUÍ ADENTRO: 
        // Avisa a Angular que ya llegaron los datos y debe dibujar las cards.
        this.cdr.detectChanges();

        console.log('Productos cargados en Home:', this.productosFiltrados);
      },
      error: (err) => {
        console.error('Error al cargar productos en Home:', err);
      }
    });
  }

  filtrarPor(idCategoria: number) {
    this.categoriaSeleccionada = idCategoria;

    if (idCategoria === 0) {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(p => {
        const pCatId = p.categoria?.id || p.categoriaId;
        return Number(pCatId) === Number(idCategoria);
      });
    }
    this.cdr.detectChanges();
  }

  buscarProducto(event: any) {
    const busqueda = event.target.value.toLowerCase();

    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(busqueda)
    );
  }

  agregarAlCarrito(producto: any) {
    this.carritoService.agregar(producto);
  }

  abrirCarrito() {
    this.carritoVisible = true;
  }

  cerrarCarrito() {
    this.carritoVisible = false;
  }
}