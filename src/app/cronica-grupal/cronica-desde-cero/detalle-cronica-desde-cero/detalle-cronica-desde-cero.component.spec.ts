import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCronicaDesdeCeroComponent } from './detalle-cronica-desde-cero.component';

describe('DetalleCronicaDesdeCeroComponent', () => {
  let component: DetalleCronicaDesdeCeroComponent;
  let fixture: ComponentFixture<DetalleCronicaDesdeCeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleCronicaDesdeCeroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCronicaDesdeCeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
