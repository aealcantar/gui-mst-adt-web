import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenugralComponent } from './menugral.component';

describe('MenugralComponent', () => {
  let component: MenugralComponent;
  let fixture: ComponentFixture<MenugralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenugralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenugralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
