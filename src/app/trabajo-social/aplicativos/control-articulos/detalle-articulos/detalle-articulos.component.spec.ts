import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleArticulosComponent } from './detalle-articulos.component';

describe('DetalleArticulosComponent', () => {
  let component: DetalleArticulosComponent;
  let fixture: ComponentFixture<DetalleArticulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleArticulosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
