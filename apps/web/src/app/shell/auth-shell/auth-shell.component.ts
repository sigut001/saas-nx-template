import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-shell">
      <div class="auth-card">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    .auth-shell { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0f0f1a; }
    .auth-card { background: #1a1a2e; border-radius: 12px; padding: 2.5rem; width: 100%; max-width: 420px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  `]
})
export class AuthShellComponent {}
