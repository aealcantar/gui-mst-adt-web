import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichapacienteComponent } from './fichapaciente.component';

describe('FichapacienteComponent', () => {
  let component: FichapacienteComponent;
  let fixture: ComponentFixture<FichapacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichapacienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FichapacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
