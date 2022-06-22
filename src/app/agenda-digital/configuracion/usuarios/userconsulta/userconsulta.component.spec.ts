import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserconsultaComponent } from './userconsulta.component';

describe('UserconsultaComponent', () => {
  let component: UserconsultaComponent;
  let fixture: ComponentFixture<UserconsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserconsultaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
