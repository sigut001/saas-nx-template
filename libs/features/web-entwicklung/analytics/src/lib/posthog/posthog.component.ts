import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantIntegrationService } from '@saas-base/tenant-integration';
import { AnalyticsDebugComponent } from '../debug/analytics-debug.component';

export interface PostHogWidget {
  id: string;
  title: string;
  type: 'TREND_NUMBER' | 'PERCENTAGE' | 'LIST';
  posthogUrl: string;
  meta?: {
    subtitle?: string;
  };
}

@Component({
  selector: 'saas-analytics-posthog',
  standalone: true,
  imports: [CommonModule, AnalyticsDebugComponent],
  template: `
    <div class="posthog-dashboard">
      <header class="mb-8">
        <h2 class="text-2xl font-bold text-slate-800">Custom Analytics</h2>
        <p class="text-slate-500">Ihre spezifischen Conversion-Ziele und KPIs (via PostHog)</p>
      </header>

      <!-- Lade-Status -->
      <div *ngIf="loading()" class="animate-pulse space-y-4">
        <div class="h-8 bg-slate-200 rounded w-1/4"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="h-32 bg-slate-200 rounded-xl"></div>
          <div class="h-32 bg-slate-200 rounded-xl"></div>
          <div class="h-32 bg-slate-200 rounded-xl"></div>
        </div>
      </div>

      <!-- Content -->
      <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ng-container *ngFor="let widget of widgets()">
          <!-- Generisches Widget Card -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{{ widget.title }}</h3>
            
            <div *ngIf="widget.meta?.subtitle" class="text-xs text-slate-400 mb-4">
              {{ widget.meta?.subtitle }}
            </div>

            <!-- TREND_NUMBER (Mock Value) -->
            <div *ngIf="widget.type === 'TREND_NUMBER'" class="flex items-baseline gap-2 mt-4">
              <span class="text-4xl font-extrabold text-slate-800">
                {{ mockFetchData(widget) | number }}
              </span>
              <span class="text-sm font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                &uarr; 12%
              </span>
            </div>

            <!-- PERCENTAGE (Mock Value) -->
            <div *ngIf="widget.type === 'PERCENTAGE'" class="flex items-baseline gap-2 mt-4">
              <span class="text-4xl font-extrabold text-blue-600">
                {{ mockFetchData(widget) }}%
              </span>
              <span class="text-sm font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                &uarr; 2.4%
              </span>
            </div>

            <!-- LIST (Mock Value) -->
            <div *ngIf="widget.type === 'LIST'" class="mt-4 space-y-3">
              <div *ngFor="let item of mockListFetchData(widget); let i = index" class="flex justify-between items-center text-sm">
                <span class="truncate text-slate-600">
                  <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-xs text-slate-500 mr-2">{{ i + 1 }}</span>
                  {{ item.label }}
                </span>
                <span class="font-medium text-slate-800">{{ item.value }}</span>
              </div>
            </div>

            <!-- Datenquelle Hinweis -->
            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Live von PostHog</span>
              <span class="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" title="Connected"></span>
            </div>
          </div>
        </ng-container>
      </div>

      <div *ngIf="!loading() && widgets().length === 0" class="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
          <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-lg font-medium text-slate-800">Keine spezifischen KPIs gefunden.</h3>
        <p class="text-slate-500 max-w-sm mx-auto mt-2">Für dieses Projekt wurden noch keine Custom-Analytics oder Funnels in den Nutzerdaten konfiguriert.</p>
      </div>
      
      <!-- Debug Container -->
      <saas-base-analytics-debug [posthogData]="widgets()"></saas-base-analytics-debug>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PosthogComponent implements OnInit {
  // Verbinde UI mit dem offiziellen Tenant-Service
  private tenantService = inject(TenantIntegrationService);

  // Computed Signal: Lade Widgets aus dem Firebase User-Doc
  widgets = computed<PostHogWidget[]>(() => {
    return this.tenantService.userProfile()?.dashboardConfig?.widgets || [];
  });

  // Zeige Ladezustand an, wenn das Profil noch fetcht
  loading = computed(() => this.tenantService.isLoading());

  ngOnInit() {
    // Kein lokaler Setup mehr nötig, die Signals machen das Reactively!
  }

  // Dies simuliert weiterhin die Endpunkt-Aufrufe (HTTP Get) für die realen Zahlen
  mockFetchData(widget: PostHogWidget): number {
    // Im echten Code würden wir hier http.get(widget.posthogUrl) machen
    if (widget.type === 'PERCENTAGE') return 14.5;
    if (widget.type === 'TREND_NUMBER') return 1284;
    return 0;
  }

  mockListFetchData(widget: PostHogWidget): {label: string, value: string}[] {
    return [
      { label: '/leistungen/dachausbau', value: '842 views' },
      { label: '/kontakt', value: '315 views' },
      { label: '/ueber-uns', value: '201 views' }
    ];
  }
}
