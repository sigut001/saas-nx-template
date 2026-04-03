import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'saas-analytics-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="analytics-container">
      <header class="analytics-header">
        <h1>Analytics Dashboard</h1>
        <nav class="analytics-tabs">
          <a routerLink="posthog" routerLinkActive="active" class="tab-link">Custom Analytics</a>
          <a routerLink="seo" routerLinkActive="active" class="tab-link">Google Suchkonsole</a>
          <a routerLink="performance" routerLinkActive="active" class="tab-link">Performance (Vitals)</a>
        </nav>
      </header>
      <main class="analytics-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 2rem;
      font-family: 'Inter', system-ui, sans-serif;
      color: #333;
    }
    .analytics-header {
      margin-bottom: 2rem;
      border-bottom: 1px solid #eaeaea;
    }
    .analytics-header h1 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #111;
    }
    .analytics-tabs {
      display: flex;
      gap: 2rem;
    }
    .tab-link {
      text-decoration: none;
      color: #666;
      font-weight: 500;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
    }
    .tab-link:hover {
      color: #111;
    }
    .tab-link.active {
      color: #0070f3;
      border-bottom: 2px solid #0070f3;
    }
    .analytics-content {
      background: #fdfdfd;
      border-radius: 12px;
      padding: 3rem;
      box-shadow: 0 8px 30px rgba(0,0,0,0.04);
      border: 1px solid #eaeaea;
      min-height: 400px;
    }
  `]
})
export class AnalyticsShellComponent {}
