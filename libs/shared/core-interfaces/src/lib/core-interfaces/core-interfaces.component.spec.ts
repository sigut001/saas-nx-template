import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreInterfacesComponent } from './core-interfaces.component';

describe('CoreInterfacesComponent', () => {
  let component: CoreInterfacesComponent;
  let fixture: ComponentFixture<CoreInterfacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreInterfacesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CoreInterfacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
