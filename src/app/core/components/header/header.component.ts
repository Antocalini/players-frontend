import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="w-full py-4 px-6 lg:px-8 shadow-lg z-30"
         style="background-color: var(--color-card-bg);"> <div class="container mx-auto flex justify-between items-center h-full">

        <a routerLink="/"
           class="flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105">
           <span class="text-4xl font-extrabold tracking-tight"
                 style="color: var(--color-primary); font-family: var(--font-special); line-height: 1;">Player</span>
           <span class="text-4xl font-extrabold tracking-tight"
                 style="color: var(--color-dark); font-family: var(--font-special); line-height: 1;">Hub</span> </a>

        <div class="flex items-center space-x-6">
          <ng-container *ngIf="!isLoggedIn">
            <a routerLink="/login"
               class="nav-link font-semibold uppercase tracking-wide transition-colors duration-300 hover:text-primary"
               style="color: var(--color-text-primary);"> Iniciar Sesión
            </a>
            <a routerLink="/register" class="btn btn-secondary btn-header text-sm">Registrarse</a>
          </ng-container>

          <ng-container *ngIf="isLoggedIn">
            <button (click)="logout()" class="btn btn-outline-alt-light btn-header text-sm"> Cerrar Sesión
            </button>
          </ng-container>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    /* General nav link styles */
    .nav-link {
        padding: 0.5rem 0; /* Add some vertical padding for click area */
    }
    .nav-link:hover {
        color: var(--color-primary); /* Only change color on hover */
    }

    /* Button specific styles for the header to make them compact and elegant */
    .btn-header {
      padding: 0.6rem 1.2rem; /* Compact padding */
      border-radius: 0.5rem; /* Slightly less rounded than main buttons */
      font-weight: 600; /* Medium bold */
      letter-spacing: 0.025em; /* Slightly tighter tracking */
    }

    .btn-secondary.btn-header {
        background-color: var(--color-secondary);
        color: white; /* Still white on secondary for contrast */
        box-shadow: none; /* No strong shadow for sleekness */
    }
    .btn-secondary.btn-header:hover {
        background-color: #D97706; /* Darker amber */
        transform: none; /* No lift */
        box-shadow: none;
    }

    /* Specific outline button for header on LIGHT background */
    .btn-outline-alt-light { /* New class for light background */
        background-color: transparent;
        border: 1px solid var(--color-text-secondary); /* Border color for light background */
        color: var(--color-text-primary); /* Text color for light background */
        transition: all 0.3s ease-in-out;
    }
    .btn-outline-alt-light:hover {
        background-color: var(--color-light); /* Subtle hover background */
        border-color: var(--color-primary); /* Primary color border on hover */
        color: var(--color-primary); /* Primary color text on hover */
        transform: translateY(-1px);
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'admin';
    });
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}