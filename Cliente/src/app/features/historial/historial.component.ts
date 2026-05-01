import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  // Arreglo para almacenar los pedidos del usuario
  pedidos: any[] = [];
  // Estado para controlar el spinner o mensaje de carga
  cargando: boolean = true;

  constructor(
    private pedidosService: PedidosService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // Ayuda a Angular a detectar cambios asíncronos
  ) { }

  ngOnInit() {
    this.cargarHistorial();
  }

  /**
   * Obtiene la información del usuario autenticado y solicita su historial de pedidos.
   */
  cargarHistorial() {
    const usuario = this.authService.getUsuario();

    // Validación de seguridad: si no hay sesión activa, redirige al login
    if (!usuario || !usuario.id) {
      console.warn('Sesión no encontrada. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    this.cargando = true;

    // Llamada al servicio para obtener los pedidos desde el backend
    this.pedidosService.obtenerHistorial(usuario.id).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;

        // 💡 Forzamos la detección de cambios para renderizar los badges de estado
        this.cdr.detectChanges();

        console.log('Historial obtenido con éxito:', this.pedidos);
      },
      error: (err) => {
        console.error('Error al recuperar el historial de compras:', err);
        this.cargando = false;
      }
    });
  }
}