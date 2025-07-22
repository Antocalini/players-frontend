import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center py-10 px-4"
         style="background-color: var(--color-light);">
      <div class="text-center max-w-4xl w-full">
        <h1 class="text-6xl md:text-7xl font-extrabold mb-6 font-display leading-tight animate-fade-in-up"
            style="color: var(--color-text-primary);">
          Tu <span style="color: var(--color-primary);">Hub</span> definitivo
          para <br>la gestión de <span style="color: var(--color-secondary);">Jugadores</span>
        </h1>
        <p class="text-xl md:text-2xl text-text-secondary mb-10 leading-relaxed animate-fade-in-up delay-300">
          Explora, registra y gestiona a tus estrellas del deporte con facilidad.
          Una plataforma intuitiva para mantener tu equipo siempre al día.
        </p>
        <div class="space-x-4 animate-fade-in-up delay-600">
          <a routerLink="/players" class="btn btn-primary">
            <i class="fas fa-users mr-2"></i> Ver Jugadores
          </a>
          <a *ngIf="!isLoggedIn" routerLink="/register" class="btn btn-outline">
            <i class="fas fa-user-plus mr-2"></i> Unirse Ahora
          </a>
        </div>
      </div>
      </div>
  `,
  styles: [`
    /* Add Font Awesome for icons (if you plan to use them, you'll need to install: npm install @fortawesome/fontawesome-free) */
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 0;
    }
    .delay-300 { animation-delay: 0.3s; }
    .delay-600 { animation-delay: 0.6s; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}