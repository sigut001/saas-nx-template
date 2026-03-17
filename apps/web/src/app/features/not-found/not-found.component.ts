import { Component } from '@angular/core';

@Component({ selector: 'app-not-found', standalone: true, template: `
  <div style="text-align:center; padding: 4rem;">
    <h1 style="font-size: 6rem; margin: 0; opacity: 0.2;">404</h1>
    <h2>Seite nicht gefunden</h2>
    <a routerLink="/app/dashboard">Zurück zum Dashboard</a>
  </div>
` })
export class NotFoundComponent {}
