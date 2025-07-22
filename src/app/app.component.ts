import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col" style="background-color: var(--color-light);">
      <header>
        <app-header></app-header>
      </header>

      <main class="flex-grow container mx-auto p-4 md:p-8 relative">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {
  title = 'players-frontend';
}