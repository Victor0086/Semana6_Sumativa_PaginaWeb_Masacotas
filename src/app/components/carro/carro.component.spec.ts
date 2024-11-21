import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarroComponent } from './carro.component';
import { CommonModule } from '@angular/common';

describe('CarroComponent', () => {
  let component: CarroComponent;
  let fixture: ComponentFixture<CarroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarroComponent, CommonModule] // Aseguramos que CommonModule esté disponible
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
