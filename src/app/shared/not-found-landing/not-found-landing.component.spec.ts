import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundLandingComponent } from './not-found-landing.component';

describe('NotFoundLandingComponent', () => {
  let component: NotFoundLandingComponent;
  let fixture: ComponentFixture<NotFoundLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotFoundLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
