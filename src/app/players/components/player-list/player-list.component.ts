import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe if needed for createdAt/updatedAt
import { Router, RouterLink } from '@angular/router'; // Import Router
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto py-8">
      <div class="flex justify-between items-center mb-6">
        <h1
          class="text-4xl font-extrabold font-display"
          style="color: var(--color-text-primary);"
        >
          Lista de Jugadores
        </h1>
        <a routerLink="/players/new" *ngIf="isAdmin" class="btn btn-primary">
          <i class="fas fa-plus-circle mr-2"></i> Añadir Jugador
        </a>
      </div>

      <div
        *ngIf="loading"
        class="text-center py-10"
        style="color: var(--color-text-secondary);"
      >
        Cargando jugadores...
      </div>
      <div
        *ngIf="error"
        class="px-4 py-3 rounded relative mb-4"
        role="alert"
        style="background-color: rgba(var(--color-accent-rgb), 0.1); border: 1px solid var(--color-accent); color: var(--color-accent);"
      >
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline ml-2">{{ error }}</span>
      </div>

      <div
        *ngIf="!loading && players.length === 0 && !error"
        class="text-center py-10 text-xl"
        style="color: var(--color-text-secondary);"
      >
        No hay jugadores para mostrar.
        <button
          *ngIf="isAdmin"
          (click)="goToAddPlayer()"
          class="btn btn-primary mt-4"
        >
          Añadir el primer jugador
        </button>
      </div>

      <div
        *ngIf="players.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          *ngFor="let player of players"
          class="card p-6 flex flex-col justify-between transform transition-transform duration-300 hover:scale-[1.02]"
        >
          <div>
            <h2
              class="text-2xl font-bold mb-2 truncate"
              style="color: var(--color-primary);"
            >
              {{ player.name }} {{ player.lastName }}
            </h2>
            <p class="text-lg mb-1" style="color: var(--color-text-primary);">
              <span class="font-semibold">Equipo:</span> {{ player.team }}
            </p>
            <p class="text-lg mb-1" style="color: var(--color-text-primary);">
              <span class="font-semibold">Nacionalidad:</span>
              {{ player.nationality }}
            </p>
            <p class="text-lg mb-1" style="color: var(--color-text-primary);">
              <span class="font-semibold">Edad:</span> {{ player.age }}
            </p>
            <p class="text-lg mb-4" style="color: var(--color-text-primary);">
              <span class="font-semibold">Número:</span> {{ player.number }}
            </p>
            <p class="text-lg mb-4" style="color: var(--color-text-primary);">
              <span class="font-semibold">Valor:</span> {{ '$' + player.value }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 mt-4">
            <a
              [routerLink]="['/players', player._id]"
              class="btn btn-outline flex-grow text-center"
            >
              Ver Detalles
            </a>
            <a
              [routerLink]="['/players/edit', player._id]"
              *ngIf="isAdmin"
              class="btn btn-secondary flex-grow text-center"
            >
              Editar
            </a>
            <button
              (click)="deletePlayer(player._id)"
              *ngIf="isAdmin"
              class="btn btn-danger flex-grow"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Importing Font Awesome for icons */
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
    `,
  ],
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  loading: boolean = true;
  error: string | null = null;
  isAdmin: boolean = false;

  constructor(
    private playerService: PlayerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('admin');
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.loading = true;
    this.error = null;
    this.playerService.getPlayers().subscribe({
      next: (data) => {
        this.players = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load players.';
        this.loading = false;
      },
    });
  }

  deletePlayer(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este jugador?')) {
      this.playerService.deletePlayer(id).subscribe({
        next: () => {
          this.players = this.players.filter((p) => p._id !== id);
        },
        error: (err) => {
          this.error = err.message || 'Failed to delete player.';
        },
      });
    }
  }

  goToAddPlayer(): void {
    this.router.navigate(['/players/new']);
  }
}
