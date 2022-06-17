import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadorSocialClinicoComponent } from './trabajador-social-clinico.component';

describe('TrabajadorSocialClinicoComponent', () => {
  let component: TrabajadorSocialClinicoComponent;
  let fixture: ComponentFixture<TrabajadorSocialClinicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabajadorSocialClinicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajadorSocialClinicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
