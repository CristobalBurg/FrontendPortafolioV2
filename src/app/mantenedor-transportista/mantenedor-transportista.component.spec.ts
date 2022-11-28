import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTransportistaComponent } from './mantenedor-transportista.component';

describe('MantenedorTransportistaComponent', () => {
  let component: MantenedorTransportistaComponent;
  let fixture: ComponentFixture<MantenedorTransportistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenedorTransportistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
