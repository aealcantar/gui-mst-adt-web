import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuhorariosComponent } from './menuhorarios.component';

describe('MenuhorariosComponent', () => {
  let component: MenuhorariosComponent;
  let fixture: ComponentFixture<MenuhorariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuhorariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuhorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
