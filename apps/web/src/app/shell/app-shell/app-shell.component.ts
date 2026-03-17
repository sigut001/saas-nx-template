import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-logo">SaaS Base</div>
        <nav class="sidebar-nav">
          <!-- Phase 4: wird durch SidebarComponent ersetzt -->
          <a routerLink="/app/dashboard">Dashboard</a>
          <a routerLink="/app/account">Account</a>
          <a routerLink="/app/settings">Settings</a>
          <a routerLink="/app/billing">Billing</a>
          <a routerLink="/app/organization">Organization</a>
        </nav>
      </aside>
      <div class="app-content">
        <header class="top-bar">
          <!-- Phase 4: wird durch TopBarComponent ersetzt -->
          <span>SaaS Base App</span>
        </header>
        <main class="content-area">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; height: 100vh; }
    .sidebar { width: 240px; background: #1a1a2e; color: #fff; padding: 1rem; flex-shrink: 0; }
    .sidebar-logo { font-size: 1.25rem; font-weight: bold; padding: 1rem 0; border-bottom: 1px solid #333; margin-bottom: 1rem; }
    .sidebar-nav { display: flex; flex-direction: column; gap: 0.5rem; }
    .sidebar-nav a { color: #ccc; text-decoration: none; padding: 0.5rem; border-radius: 4px; }
    .sidebar-nav a:hover { background: #333; color: #fff; }
    .app-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .top-bar { height: 56px; background: #16213e; color: #fff; display: flex; align-items: center; padding: 0 1.5rem; border-bottom: 1px solid #333; flex-shrink: 0; }
    .content-area { flex: 1; overflow-y: auto; padding: 2rem; background: #0f0f1a; color: #e0e0e0; }
  `]
})
export class AppShellComponent {}
