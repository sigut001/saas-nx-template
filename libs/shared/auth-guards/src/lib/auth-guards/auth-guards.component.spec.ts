import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthGuardsComponent } from './auth-guards.component';

describe('AuthGuardsComponent', () => {
  let component: AuthGuardsComponent;
  let fixture: ComponentFixture<AuthGuardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthGuardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthGuardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
