import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_BASE_URL } from '../../app-constants';
import { Player } from '../models/player.model';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private apiUrl = `${API_BASE_URL}/players`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage =
        error.error?.message ||
        `Server Error: ${error.status} ${error.statusText}`;
      if (error.error?.errors && Array.isArray(error.error.errors)) {
        errorMessage = error.error.errors
          .map((e: any) => e.msg || e)
          .join(', ');
      }
    }
    console.error('Player Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  getPlayers(): Observable<Player[]> {
    return this.http
      .get<{ message: string; players: Player[] }>(this.apiUrl, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => response.players),
        catchError(this.handleError)
      );
  }

  getPlayer(id: string): Observable<Player> {
    return this.http
      .get<{ message: string; player: Player }>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => response.player),
        catchError(this.handleError)
      );
  }

  createPlayer(
    player: Omit<Player, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>
  ): Observable<Player> {
    return this.http
      .post<{ message: string; player: Player }>(this.apiUrl, player, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => response.player), // Extract the created 'player' object
        catchError(this.handleError)
      );
  }

  updatePlayer(
    id: string,
    player: Partial<
      Omit<Player, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>
    >
  ): Observable<Player> {
    return this.http
      .put<{ message: string; player: Player }>(
        `${this.apiUrl}/${id}`,
        player,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map((response) => response.player),
        catchError(this.handleError)
      );
  }

  deletePlayer(id: string): Observable<void> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
  }
}
