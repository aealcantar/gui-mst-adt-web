import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoControlArticulosComponent } from './nuevo-control-articulos.component';

describe('NuevoControlArticulosComponent', () => {
  let component: NuevoControlArticulosComponent;
  let fixture: ComponentFixture<NuevoControlArticulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoControlArticulosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoControlArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
