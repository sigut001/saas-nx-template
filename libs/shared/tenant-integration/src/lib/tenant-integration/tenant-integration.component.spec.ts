import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantIntegrationComponent } from './tenant-integration.component';

describe('TenantIntegrationComponent', () => {
  let component: TenantIntegrationComponent;
  let fixture: ComponentFixture<TenantIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantIntegrationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TenantIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
