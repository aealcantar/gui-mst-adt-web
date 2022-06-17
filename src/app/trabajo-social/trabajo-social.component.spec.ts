import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajoSocialComponent } from './trabajo-social.component';

describe('TrabajoSocialComponent', () => {
  let component: TrabajoSocialComponent;
  let fixture: ComponentFixture<TrabajoSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabajoSocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajoSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
