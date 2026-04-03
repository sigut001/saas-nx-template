import { Component } from '@angular/core';

@Component({
  selector: 'saas-analytics-performance',
  standalone: true,
  template: `
    <div class="slice-container">
      <h2>Core Web Vitals (PageSpeed)</h2>
      <p>Hier rendern wir das Ampel-System für Google Ladezeiten (CrUX Felddaten) aus dem API-Endpoint.</p>
    </div>
  `,
  styles: [`
    .slice-container h2 { font-size: 1.5rem; color: #222; margin-bottom: 1rem; }
    .slice-container p { color: #555; }
  `]
})
export class PerformanceComponent {}
