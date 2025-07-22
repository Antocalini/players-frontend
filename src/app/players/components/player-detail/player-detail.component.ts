import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Include DatePipe if you want to format createdAt/updatedAt
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="container mx-auto py-8">
      <div
        *ngIf="loading"
        class="text-center py-10"
        style="color: var(--color-text-secondary);"
      >
        Cargando detalles del jugador...
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

      <div *ngIf="player && !loading" class="card w-full max-w-2xl mx-auto p-8">
        <h1
          class="text-4xl font-extrabold mb-6 text-center font-display"
          style="color: var(--color-primary);"
        >
          {{ player.name }} {{ player.lastName }}
        </h1>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-lg mb-8"
        >
          <div>
            <p
              class="font-semibold"
              style="color: var(--color-text-secondary);"
            >
              Nacionalidad:
            </p>
            <p class="text-xl" style="color: var(--color-text-primary);">
              {{ player.nationality }}
            </p>
          </div>
          <div>
            <p
              class="font-semibold"
              style="color: var(--color-text-secondary);"
            >
              Equipo:
            </p>
            <p class="text-xl" style="color: var(--color-text-primary);">
              {{ player.team }}
            </p>
          </div>
          <div>
            <p
              class="font-semibold"
              style="color: var(--color-text-secondary);"
            >
              Edad:
            </p>
            <p class="text-xl" style="color: var(--color-text-primary);">
              {{ player.age }} años
            </p>
          </div>
          <div>
            <p
              class="font-semibold"
              style="color: var(--color-text-secondary);"
            >
              Número:
            </p>
            <p class="text-xl" style="color: var(--color-text-primary);">
              {{ player.number }}
            </p>
          </div>
          <div>
            <p
              class="font-semibold"
              style="color: var(--color-text-secondary);"
            >
              Valor:
            </p>
            <p class="text-xl" style="color: var(--color-text-primary);">
              {{ '$' + player.value }}
            </p>
          </div>
          <div *ngIf="player.createdAt">
            <p
              class="font-semibold"
              style="color: var(--color-text-secondary);"
            >
              Creado el:
            </p>
            <p class="text-xl" style="color: var(--color-text-primary);">
              {{ player.createdAt | date : 'shortDate' }}
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 mt-6">
          <a routerLink="/players" class="btn btn-outline flex-grow text-center"
            >Volver a la Lista</a
          >
          <a
            [routerLink]="['/players/edit', player._id]"
            *ngIf="isAdmin"
            class="btn btn-secondary flex-grow text-center"
            >Editar Jugador</a
          >
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* No specific styles needed here, uses global card and button styles */
    `,
  ],
})
export class PlayerDetailComponent implements OnInit {
  player: Player | null = null;
  loading: boolean = true;
  error: string | null = null;
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('admin');
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadPlayerDetails(id);
      } else {
        this.error = 'No player ID provided.';
        this.loading = false;
      }
    });
  }

  loadPlayerDetails(id: string): void {
    this.loading = true;
    this.error = null;
    this.playerService.getPlayer(id).subscribe({
      next: (data) => {
        this.player = data;

        if (this.player.createdAt) {
          this.player.createdAt = new Date(this.player.createdAt);
        }
        if (this.player.updatedAt) {
          this.player.updatedAt = new Date(this.player.updatedAt);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load player details.';
        this.loading = false;
      },
    });
  }
}
