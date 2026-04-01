import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule, NzPageHeaderModule, NzResultModule],
  template: `
    <nz-page-header nzTitle="Dashboard" nzSubtitle="Willkommen in deiner SaaS-Anwendung"></nz-page-header>
    <nz-result nzStatus="info" nzTitle="Dashboard Platzhalter" nzSubTitle="Hier werden bald deine Statistiken und KPIs angezeigt.">
    </nz-result>
  `,
  styles: [`
    :host { display: block; padding: 24px; background: #fff; border-radius: 8px; }
  `]
})
export class DashboardComponent {}
