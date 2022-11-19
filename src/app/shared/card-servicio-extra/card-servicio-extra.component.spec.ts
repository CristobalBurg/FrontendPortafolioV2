import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardServicioExtraComponent } from './card-servicio-extra.component';

describe('CardServicioExtraComponent', () => {
  let component: CardServicioExtraComponent;
  let fixture: ComponentFixture<CardServicioExtraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardServicioExtraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardServicioExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
