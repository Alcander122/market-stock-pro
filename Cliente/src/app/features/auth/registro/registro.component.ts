import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    // Por defecto asume rol 'cliente'
    const datos = { ...this.registroForm.value, rol: 'cliente' };

    this.authService.register(datos).subscribe({
      next: () => {
        Swal.fire('¡Bienvenido!', 'Tu cuenta ha sido creada y has iniciado sesión', 'success').then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        Swal.fire('Error', 'Hubo un problema al crear la cuenta. Intenta de nuevo.', 'error');
        console.error(err);
      }
    });
  }
}
