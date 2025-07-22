import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto py-8">
      <div class="card w-full max-w-2xl mx-auto p-8">
        <h1
          class="text-4xl font-extrabold mb-8 text-center font-display"
          style="color: var(--color-text-primary);"
        >
          {{ isEditMode ? 'Editar Jugador' : 'Añadir Nuevo Jugador' }}
        </h1>

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
          *ngIf="successMessage"
          class="px-4 py-3 rounded relative mb-4"
          role="alert"
          style="background-color: rgba(var(--color-primary-rgb), 0.1); border: 1px solid var(--color-primary); color: var(--color-primary);"
        >
          <strong class="font-bold">Éxito:</strong>
          <span class="block sm:inline ml-2">{{ successMessage }}</span>
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="mb-5">
            <label for="name" class="form-label">Nombre</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="player.name"
              name="name"
              required
              class="input-field"
            />
          </div>
          <div class="mb-5">
            <label for="lastName" class="form-label">Apellido</label>
            <input
              type="text"
              id="lastName"
              [(ngModel)]="player.lastName"
              name="lastName"
              required
              class="input-field"
            />
          </div>
          <div class="mb-5">
            <label for="nationality" class="form-label">Nacionalidad</label>
            <input
              type="text"
              id="nationality"
              [(ngModel)]="player.nationality"
              name="nationality"
              required
              class="input-field"
            />
          </div>
          <div class="mb-5">
            <label for="team" class="form-label">Equipo</label>
            <input
              type="text"
              id="team"
              [(ngModel)]="player.team"
              name="team"
              required
              class="input-field"
            />
          </div>
          <div class="mb-5">
            <label for="age" class="form-label">Edad</label>
            <input
              type="number"
              id="age"
              [(ngModel)]="player.age"
              name="age"
              required
              class="input-field"
              min="16"
              max="45"
            />
          </div>
          <div class="mb-5">
            <label for="number" class="form-label">Número</label>
            <input
              type="number"
              id="number"
              [(ngModel)]="player.number"
              name="number"
              required
              class="input-field"
              min="1"
              max="99"
            />
          </div>
          <div class="mb-6">
            <label for="value" class="form-label">Valor</label>
            <input
              type="number"
              id="value"
              [(ngModel)]="player.value"
              name="value"
              required
              class="input-field"
            />
          </div>

          <div class="flex justify-between gap-4">
            <button
              type="button"
              (click)="goBack()"
              class="btn btn-outline flex-grow"
            >
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary flex-grow">
              {{ isEditMode ? 'Guardar Cambios' : 'Añadir Jugador' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      /* No specific styles needed here, uses global card, form, and button styles */
    `,
  ],
})
export class PlayerFormComponent implements OnInit {
  player: Player = {
    _id: '',
    name: '',
    lastName: '',
    nationality: '',
    team: '',
    age: 0,
    number: 0,
    value: 0,
  };
  isEditMode: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.hasRole('admin')) {
      this.router.navigate(['/']);
      return;
    }

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.playerService.getPlayer(id).subscribe({
          next: (data) => {
            this.player = data;
          },
          error: (err) => {
            this.error = err.message || 'Failed to load player for editing.';
          },
        });
      } else {
        this.isEditMode = false;
      }
    });
  }

  onSubmit(): void {
    this.error = null;
    this.successMessage = null;

    const playerToSubmit: Omit<
      Player,
      '_id' | 'createdBy' | 'createdAt' | 'updatedAt'
    > = {
      name: this.player.name,
      lastName: this.player.lastName,
      nationality: this.player.nationality,
      team: this.player.team,
      age: this.player.age,
      number: this.player.number,
      value: this.player.value,
    };

    if (this.isEditMode) {
      this.playerService
        .updatePlayer(this.player._id, playerToSubmit)
        .subscribe({
          next: (response) => {
            this.successMessage = 'Jugador actualizado con éxito!';
            setTimeout(() => this.router.navigate(['/players']), 2000);
          },
          error: (err) => {
            this.error = err.message || 'Error al actualizar el jugador.';
          },
        });
    } else {
      this.playerService.createPlayer(playerToSubmit).subscribe({
        next: (response) => {
          this.successMessage = 'Jugador añadido con éxito!';
          setTimeout(() => this.router.navigate(['/players']), 2000);
        },
        error: (err) => {
          this.error = err.message || 'Error al añadir el jugador.';
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/players']);
  }
}
