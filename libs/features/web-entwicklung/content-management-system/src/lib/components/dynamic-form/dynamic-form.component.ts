import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Ant Design Modules
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'lib-cms-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzFormModule,
    NzSwitchModule,
    NzCardModule,
  ],
  template: `
    <div class="dynamic-form-node">
      <ng-container *ngFor="let item of parsedFields; trackBy: trackByKey">
        <!-- Nested Object (wird als eingerückte Karte/Block gerendert) -->
        <div *ngIf="item.type === 'object'" class="nested-object">
          <nz-card
            [nzTitle]="formatLabel(item.key)"
            [nzSize]="'small'"
            style="margin-bottom: 16px;"
          >
            <!-- Recursive Call! -->
            <lib-cms-dynamic-form
              [data]="item.value"
              [parentPath]="getFullPath(item.key)"
              [missingPaths]="missingPaths"
              [changedPaths]="changedPaths"
              (dataChange)="onFieldChange(item.key, $event)"
            >
            </lib-cms-dynamic-form>
          </nz-card>
        </div>

        <!-- String Field (Input oder Textarea je nach Länge) -->
        <nz-form-item *ngIf="item.type === 'string'">
          <nz-form-label
            [nzSpan]="24"
            style="text-align: left; padding-bottom: 4px;"
            >{{ formatLabel(item.key) }}</nz-form-label
          >
          <nz-form-control [nzSpan]="24">
            <textarea
              *ngIf="
                item.value.length > 80 ||
                item.key.toLowerCase().includes('description') ||
                item.key.toLowerCase().includes('body')
              "
              nz-input
              [ngClass]="{
                'missing-sync': isMissing(item.key),
                'synced-change': isChanged(item.key) && !isMissing(item.key),
              }"
              [ngModel]="item.value"
              (ngModelChange)="onFieldChange(item.key, $event)"
              [nzAutosize]="{ minRows: 2, maxRows: 6 }"
            >
            </textarea>
            <input
              *ngIf="
                !(
                  item.value.length > 80 ||
                  item.key.toLowerCase().includes('description') ||
                  item.key.toLowerCase().includes('body')
                )
              "
              nz-input
              [ngClass]="{
                'missing-sync': isMissing(item.key),
                'synced-change': isChanged(item.key) && !isMissing(item.key),
              }"
              [ngModel]="item.value"
              (ngModelChange)="onFieldChange(item.key, $event)"
            />
          </nz-form-control>
        </nz-form-item>

        <!-- Boolean Field (Toggle) -->
        <nz-form-item *ngIf="item.type === 'boolean'">
          <nz-form-label
            [nzSpan]="24"
            style="text-align: left; padding-bottom: 4px;"
            >{{ formatLabel(item.key) }}</nz-form-label
          >
          <nz-form-control [nzSpan]="24">
            <nz-switch
              [ngModel]="item.value"
              (ngModelChange)="onFieldChange(item.key, $event)"
            ></nz-switch>
          </nz-form-control>
        </nz-form-item>

        <!-- Number Field (Input type=number) -->
        <nz-form-item *ngIf="item.type === 'number'">
          <nz-form-label
            [nzSpan]="24"
            style="text-align: left; padding-bottom: 4px;"
            >{{ formatLabel(item.key) }}</nz-form-label
          >
          <nz-form-control [nzSpan]="24">
            <input
              nz-input
              type="number"
              [ngClass]="{
                'missing-sync': isMissing(item.key),
                'synced-change': isChanged(item.key) && !isMissing(item.key),
              }"
              [ngModel]="item.value"
              (ngModelChange)="onFieldChange(item.key, $event)"
            />
          </nz-form-control>
        </nz-form-item>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .nested-object {
        margin-left: 8px;
      }
      /* Sync Validation Styles */
      .missing-sync {
        border: 2px solid #faad14 !important;
        background-color: #fffbe6 !important;
      }
      .synced-change {
        border: 2px solid #52c41a !important;
        background-color: #f6ffed !important;
      }
      /* UI Fallback für unkontrolliert lange Eingaben (z.B. Zalgo, ewige Wörter) */
      textarea[nz-input],
      input[nz-input] {
        word-break: break-all;
        overflow-wrap: anywhere;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CmsDynamicFormComponent implements OnChanges {
  @Input() data: any;
  @Input() parentPath: string = '';
  @Input() missingPaths: string[] = [];
  @Input() changedPaths: string[] = [];

  @Output() dataChange = new EventEmitter<any>();

  parsedFields: { key: string; value: any; type: string }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.parseData();
    }
  }

  getFullPath(key: string): string {
    return this.parentPath ? `${this.parentPath}.${key}` : key;
  }

  isMissing(key: string): boolean {
    return this.missingPaths.includes(this.getFullPath(key));
  }

  isChanged(key: string): boolean {
    return this.changedPaths.includes(this.getFullPath(key));
  }

  parseData() {
    this.parsedFields = [];
    if (typeof this.data !== 'object' || this.data === null) return;

    const keys = Object.keys(this.data);

    for (const key of keys) {
      // Ignoriere Firebase-Metadaten oder IDs
      if (key === 'id' || key === 'updatedAt' || key === 'createdAt') continue;

      const value = this.data[key];
      const type = Array.isArray(value) ? 'array' : typeof value;

      this.parsedFields.push({ key, value, type });
    }

    // Konsistente UX: Sortiere Felder!
    // 1. Primitive Felder nach oben, Objekte (verschachtelt) nach unten
    // 2. Alphabetisch innerhalb der Gruppen
    this.parsedFields.sort((a, b) => {
      const aIsObj = a.type === 'object';
      const bIsObj = b.type === 'object';

      if (aIsObj && !bIsObj) return 1;
      if (!aIsObj && bIsObj) return -1;

      return a.key.localeCompare(b.key);
    });
  }

  onFieldChange(key: string, newValue: any) {
    // Create a new IMMUTABLE object to trigger change detection in parents
    const updatedData = { ...this.data, [key]: newValue };
    this.dataChange.emit(updatedData);
  }

  formatLabel(key: string): string {
    // Wandelt "seoTitle" in "Seo Title" um
    const result = key.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  trackByKey(index: number, item: any): string {
    return item.key;
  }
}
