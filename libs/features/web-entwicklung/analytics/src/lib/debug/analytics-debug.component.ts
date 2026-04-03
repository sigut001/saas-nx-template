import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'saas-base-analytics-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="debug-panel" [class.open]="isOpen">
      <div class="debug-header" (click)="toggle()">
        <span>🐞 Analytics API Debugger</span>
        <span class="toggle-icon">{{ isOpen ? '▼' : '▲' }}</span>
      </div>
      <div class="debug-content" *ngIf="isOpen">
        <label>Google Search Console Payload:</label>
        <pre><code>{{ data | json }}</code></pre>

        <label>PostHog Widgets Payload (Firestore):</label>
        <pre><code [class.text-red-400]="!posthogData || posthogData.length === 0">{{ posthogData ? (posthogData | json) : 'FEHLT ODER LEER' }}</code></pre>
      </div>
    </div>
  `,
  styles: [
    `
      .debug-panel {
        position: fixed;
        bottom: 0;
        right: 440px; /* offset von auth debug */
        width: 400px;
        background: #1e1e1e;
        color: #00ffff;
        font-family: monospace;
        border-radius: 8px 8px 0 0;
        z-index: 9999;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
        font-size: 12px;
        transition: transform 0.3s ease-in-out;
      }
      .debug-header {
        padding: 10px 15px;
        background: #333;
        color: #fff;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px 8px 0 0;
        font-weight: bold;
      }
      .debug-content {
        padding: 15px;
        max-height: 400px;
        overflow-y: auto;
      }
      pre {
        background: #000;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
      }
      label {
        color: #888;
        display: block;
        margin-top: 10px;
        margin-bottom: 5px;
        text-transform: uppercase;
        font-size: 10px;
      }
    `
  ]
})
export class AnalyticsDebugComponent {
  @Input() data: any = null;
  @Input() posthogData: any = null;
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
