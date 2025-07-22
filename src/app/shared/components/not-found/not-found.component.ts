import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 text-center" style="background-color: var(--color-light);">
      <h1 class="text-9xl font-extrabold text-gray-400 animate-bounce">404</h1>
      <p class="text-2xl font-semibold mb-4" style="color: var(--color-text-primary);">¡Página No Encontrada!</p>
      <p class="mb-8" style="color: var(--color-text-secondary);">Parece que te has perdido. La página que buscas no existe.</p>
      <a routerLink="/" class="btn btn-primary">
        Volver al Inicio
      </a>
    </div>
  `,
  styles: [`
    .animate-bounce {
      animation: bounce 1s infinite;
    }
    @keyframes bounce {
      0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
  `]
})
export class NotFoundComponent { }