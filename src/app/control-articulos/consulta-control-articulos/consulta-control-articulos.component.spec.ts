import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaControlArticulosComponent } from './consulta-control-articulos.component';

describe('ConsultaControlArticulosComponent', () => {
  let component: ConsultaControlArticulosComponent;
  let fixture: ComponentFixture<ConsultaControlArticulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaControlArticulosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaControlArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
