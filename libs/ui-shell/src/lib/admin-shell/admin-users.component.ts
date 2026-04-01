import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'lib-admin-users',
  standalone: true,
  imports: [CommonModule, NzPageHeaderModule, NzTableModule],
  template: `
    <nz-page-header nzTitle="Benutzerverwaltung" nzSubtitle="Verwalte alle Benutzer deiner Plattform"></nz-page-header>
    <nz-table #basicTable [nzData]="users">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Rolle</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of basicTable.data">
          <td>{{ data.name }}</td>
          <td>{{ data.email }}</td>
          <td>{{ data.role }}</td>
          <td>{{ data.status }}</td>
        </tr>
      </tbody>
    </nz-table>
  `,
  styles: [`
    :host { display: block; padding: 24px; background: #fff; border-radius: 8px; }
  `]
})
export class AdminUsersComponent {
  users = [
    { name: 'Admin User', email: 'admin@test.com', role: 'Super-Admin', status: 'Aktiv' },
    { name: 'Test User', email: 'user@test.com', role: 'User', status: 'Aktiv' },
  ];
}
