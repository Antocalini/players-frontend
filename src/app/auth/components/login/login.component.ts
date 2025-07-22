import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="flex items-center justify-center min-h-[calc(100vh-64px)] p-4"
         style="background-color: var(--color-light);">
      <div class="w-full max-w-md card relative overflow-hidden">
        <div class="absolute inset-0 bg-primary opacity-10 blur-xl scale-150 rounded-full" style="z-index: -1;"></div>
        <h2 class="text-4xl font-bold mb-8 text-center font-display" style="color: var(--color-text-primary);">Iniciar Sesión</h2>

        <div *ngIf="error" class="px-4 py-3 rounded relative mb-4" role="alert" style="background-color: rgba(var(--color-accent-rgb), 0.1); border: 1px solid var(--color-accent); color: var(--color-accent);">
          <strong class="font-bold">Error:</strong>
          <span class="block sm:inline ml-2">{{ error }}</span>
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="mb-5">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required class="input-field">
          </div>
          <div class="mb-6">
            <label for="password" class="form-label">Contraseña</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required class="input-field">
          </div>
          <button type="submit" class="btn btn-primary w-full">Entrar</button>
        </form>

        <p class="mt-8 text-center text-text-secondary">
          ¿No tienes una cuenta? <a routerLink="/register" style="color: var(--color-primary);" class="font-semibold hover:underline">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    /* Adding a subtle background glow to the card */
    .card::before {
      content: '';
      position: absolute;
      top: -50px;
      left: -50px;
      width: 150px;
      height: 150px;
      background-color: var(--color-primary);
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.1;
      z-index: -1;
    }
    .card::after {
      content: '';
      position: absolute;
      bottom: -50px;
      right: -50px;
      width: 150px;
      height: 150px;
      background-color: var(--color-secondary);
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.1;
      z-index: -1;
    }
  `]
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.error = null;
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.message || 'Login failed. Please try again.';
      }
    });
  }
}