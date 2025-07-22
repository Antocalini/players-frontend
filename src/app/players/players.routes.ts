// src/app/players/players.routes.ts
import { Routes } from '@angular/router';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { PlayerFormComponent } from './components/player-form/player-form.component';
import { PlayerDetailComponent } from './components/player-detail/player-detail.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AdminGuard } from '../shared/guards/admin.guard';

export const PLAYERS_ROUTES: Routes = [
  {
    path: '',
    component: PlayerListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'new',
    component: PlayerFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'edit/:id',
    component: PlayerFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: ':id',
    component: PlayerDetailComponent,
    canActivate: [AuthGuard],
  },
];
