import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDepartamentoComponent } from './card-departamentos.component';

describe('DepartamentosComponent', () => {
  let component: CardDepartamentoComponent;
  let fixture: ComponentFixture<CardDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardDepartamentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
