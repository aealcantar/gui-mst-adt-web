import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleControlArticulosComponent } from './detalle-control-articulos.component';

describe('DetalleControlArticulosComponent', () => {
  let component: DetalleControlArticulosComponent;
  let fixture: ComponentFixture<DetalleControlArticulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleControlArticulosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleControlArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
