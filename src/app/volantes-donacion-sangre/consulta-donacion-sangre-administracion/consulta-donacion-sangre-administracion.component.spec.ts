import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaDonacionSangreAdministracionComponent } from './consulta-donacion-sangre-administracion.component';

describe('ConsultaDonacionSangreAdministracionComponent', () => {
  let component: ConsultaDonacionSangreAdministracionComponent;
  let fixture: ComponentFixture<ConsultaDonacionSangreAdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaDonacionSangreAdministracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaDonacionSangreAdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
