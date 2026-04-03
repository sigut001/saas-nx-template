import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'saas-base-auth-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="debug-panel" [class.open]="isOpen">
      <div class="debug-header" (click)="toggle()">
        <span>🐞 Auth & Vault Debugger</span>
        <span class="toggle-icon">{{ isOpen ? '▼' : '▲' }}</span>
      </div>
      <div class="debug-content" *ngIf="isOpen">
        <label>Authentifizierter User:</label>
        <pre><code>{{ user | json }}</code></pre>
        
        <label>Firestore Vault (injiziert):</label>
        <pre><code>{{ vault | json }}</code></pre>

        <label>Letzter Fehler:</label>
        <pre class="error"><code>{{ error | json }}</code></pre>
      </div>
    </div>
  `,
  styles: [
    `
      .debug-panel {
        position: fixed;
        bottom: 0;
        right: 20px;
        width: 400px;
        background: #1e1e1e;
        color: #00ff00;
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
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      label {
        color: #888;
        display: block;
        margin-top: 10px;
        margin-bottom: 5px;
        text-transform: uppercase;
        font-size: 10px;
      }
      .error {
        color: #ff4444;
      }
    `
  ]
})
export class AuthDebugComponent {
  @Input() user: any = null;
  @Input() vault: any = null;
  @Input() error: any = null;

  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
