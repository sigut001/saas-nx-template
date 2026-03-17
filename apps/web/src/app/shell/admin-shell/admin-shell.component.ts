import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'admin-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-logo">⚙️ Admin</div>
        <nav>
          <a routerLink="/admin/users">Users</a>
          <a routerLink="/admin/organizations">Organizations</a>
          <a routerLink="/admin/flags">Feature Flags</a>
          <a routerLink="/admin/stats">Stats</a>
        </nav>
      </aside>
      <main class="admin-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin-shell { display: flex; height: 100vh; }
    .admin-sidebar { width: 220px; background: #1a0a2e; color: #fff; padding: 1rem; flex-shrink: 0; }
    .admin-logo { font-size: 1.1rem; font-weight: bold; padding: 1rem 0; border-bottom: 1px solid #400; margin-bottom: 1rem; }
    .admin-sidebar nav { display: flex; flex-direction: column; gap: 0.5rem; }
    .admin-sidebar a { color: #ffaaaa; text-decoration: none; padding: 0.5rem; border-radius: 4px; }
    .admin-sidebar a:hover { background: #400; }
    .admin-content { flex: 1; padding: 2rem; background: #0f0a1a; color: #e0d0e0; overflow-y: auto; }
  `]
})
export class AdminShellComponent {}
