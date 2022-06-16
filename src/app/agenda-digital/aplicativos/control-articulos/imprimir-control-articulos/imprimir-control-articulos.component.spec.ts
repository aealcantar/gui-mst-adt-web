import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirControlArticulosComponent } from './imprimir-control-articulos.component';

describe('ImprimirControlArticulosComponent', () => {
  let component: ImprimirControlArticulosComponent;
  let fixture: ComponentFixture<ImprimirControlArticulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprimirControlArticulosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirControlArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
