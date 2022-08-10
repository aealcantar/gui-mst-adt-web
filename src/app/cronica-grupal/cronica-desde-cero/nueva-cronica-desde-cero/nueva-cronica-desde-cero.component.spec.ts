import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaCronicaDesdeCeroComponent } from './nueva-cronica-desde-cero.component';

describe('NuevaCronicaDesdeCeroComponent', () => {
  let component: NuevaCronicaDesdeCeroComponent;
  let fixture: ComponentFixture<NuevaCronicaDesdeCeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaCronicaDesdeCeroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaCronicaDesdeCeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
