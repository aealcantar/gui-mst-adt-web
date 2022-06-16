import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesPacienteComponent } from './datos-generales-paciente.component';

describe('DatosGeneralesPacienteComponent', () => {
  let component: DatosGeneralesPacienteComponent;
  let fixture: ComponentFixture<DatosGeneralesPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosGeneralesPacienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
