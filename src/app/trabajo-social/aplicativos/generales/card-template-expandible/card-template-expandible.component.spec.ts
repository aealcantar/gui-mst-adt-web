import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTemplateExpandibleComponent } from './card-template-expandible.component';

describe('CardTemplateExpandibleComponent', () => {
  let component: CardTemplateExpandibleComponent;
  let fixture: ComponentFixture<CardTemplateExpandibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardTemplateExpandibleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTemplateExpandibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
