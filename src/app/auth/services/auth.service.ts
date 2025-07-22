import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API_BASE_URL } from '../../app-constants';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';

export interface UserData {
  _id: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${API_BASE_URL}/auth`;
  private userSubject: BehaviorSubject<UserData | null>;
  public currentUser: Observable<UserData | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject<UserData | null>(null);
    this.currentUser = this.userSubject.asObservable();
    this.checkAuthStatus();
  }

  public get currentUserValue(): UserData | null {
    return this.userSubject.value;
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
        errorMessage = error.error.errors.join(', ');
      }
    }
    console.error('Authentication Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  register(
    email: string,
    password: string,
    role: string = 'user'
  ): Observable<any> {
    const body = { email, password, role };
    return this.http.post<any>(`${this.apiUrl}/register`, body).pipe(
      tap((response) => {
        if (response.token && response.data?.user) {
          localStorage.setItem('accessToken', response.token);
          this.updateAuthStatus(response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap((response) => {
        if (response.token && response.data?.user) {
          localStorage.setItem('accessToken', response.token);
          this.updateAuthStatus(response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          const user: UserData = {
            _id: decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
          };
          this.userSubject.next(user);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error('Error decoding or verifying token:', error);
        this.logout();
      }
    } else {
      this.userSubject.next(null);
    }
  }

  private updateAuthStatus(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      const user: UserData = {
        _id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
      };
      this.userSubject.next(user);
    } catch (error) {
      console.error('Error updating authentication status from token:', error);
      this.logout();
    }
  }

  hasRole(requiredRole: string): boolean {
    const user = this.userSubject.value;
    return user?.role === requiredRole;
  }
}
