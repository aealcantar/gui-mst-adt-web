import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosGeneralesUsuarioComponent } from './datos-generales-usuario.component';

describe('DatosGeneralesUsuarioComponent', () => {
  let component: DatosGeneralesUsuarioComponent;
  let fixture: ComponentFixture<DatosGeneralesUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosGeneralesUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
