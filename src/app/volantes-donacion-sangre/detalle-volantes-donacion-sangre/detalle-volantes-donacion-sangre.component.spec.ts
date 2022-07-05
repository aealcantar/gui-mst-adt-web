import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleVolantesDonacionSangreComponent } from './detalle-volantes-donacion-sangre.component';

describe('DetalleVolantesDonacionSangreComponent', () => {
  let component: DetalleVolantesDonacionSangreComponent;
  let fixture: ComponentFixture<DetalleVolantesDonacionSangreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleVolantesDonacionSangreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleVolantesDonacionSangreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
