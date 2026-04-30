import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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

  constructor(private router: Router) { }

  login() {

    // 🔥 SIMULACIÓN (luego lo conectamos a backend)
    const usuario = {
      id: 1,
      nombre: 'Usuario Demo',
      email: this.email
    };

    // Guardar sesión
    localStorage.setItem('usuario', JSON.stringify(usuario));

    // Redirigir
    this.router.navigate(['/']);
  }
}
