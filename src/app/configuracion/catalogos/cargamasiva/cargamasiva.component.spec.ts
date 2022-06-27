import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargamasivaComponent } from './cargamasiva.component';

describe('CargamasivaComponent', () => {
  let component: CargamasivaComponent;
  let fixture: ComponentFixture<CargamasivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargamasivaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargamasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
