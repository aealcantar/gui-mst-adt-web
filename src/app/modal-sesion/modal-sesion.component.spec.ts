import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSesionComponent } from './modal-sesion.component';

describe('ModalSesionComponent', () => {
  let component: ModalSesionComponent;
  let fixture: ComponentFixture<ModalSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSesionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
