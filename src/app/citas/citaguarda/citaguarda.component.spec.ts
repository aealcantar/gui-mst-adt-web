import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaguardaComponent } from './citaguarda.component';

describe('CitaguardaComponent', () => {
  let component: CitaguardaComponent;
  let fixture: ComponentFixture<CitaguardaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitaguardaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaguardaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
