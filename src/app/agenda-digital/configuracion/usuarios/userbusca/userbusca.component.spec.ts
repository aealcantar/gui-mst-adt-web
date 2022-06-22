import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserbuscaComponent } from './userbusca.component';

describe('UserbuscaComponent', () => {
  let component: UserbuscaComponent;
  let fixture: ComponentFixture<UserbuscaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserbuscaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserbuscaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
