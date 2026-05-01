import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Importar Router
import { PedidosService } from '../../core/services/pedidos.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-historial',
  imports: [CommonModule, RouterModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {
  pedidos: any[] = [];
  cargando: boolean = true;

  constructor(
    private pedidosService: PedidosService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // 👈 Inyecta esto
  ) { }

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    const usuario = this.authService.getUsuario();

    // Si el usuario se perdió al navegar, redirigir al login
    if (!usuario || !usuario.id) {
      console.warn('No se encontró usuario, redirigiendo...');
      this.router.navigate(['/login']);
      return;
    }

    this.cargando = true;
    this.pedidosService.obtenerHistorial(usuario.id).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;
        // 💡 Esto fuerza a Angular a pintar la tabla si se quedó "dormido"
        this.cdr.detectChanges();
        console.log('Historial recargado:', this.pedidos);
      },
      error: (err) => {
        console.error('Error al recuperar historial:', err);
        this.cargando = false;
      }
    });
  }
}