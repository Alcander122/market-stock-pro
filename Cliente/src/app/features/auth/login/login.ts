import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    const credenciales = { email: this.email, password: this.password };

    this.authService.login(credenciales).subscribe({
      next: (usuario) => {
        Swal.fire({
          icon: 'success',
          title: '¡Ingreso exitoso!',
          text: `Bienvenido al sistema, ${usuario.nombreCompleto}`,
          timer: 1500,
          showConfirmButton: false
        });

        // 🚦 Redirección basada en el ROL de la base de datos
        if (usuario.rol === 'ADMIN') {
          this.router.navigate(['/admin']); // Hacia el DashboardComponent
        } else {
          this.router.navigate(['/']); // Hacia el HomeComponent para clientes
        }
      },
      error: (err) => {
        console.error('Detalle del error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Usuario o contraseña incorrectos',
          confirmButtonColor: '#2e7d32'
        });
      }
    });
  }
}