import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorTransportistasComponent } from './mantenedor-transportistas.component';

describe('MantenedorTransportistasComponent', () => {
  let component: MantenedorTransportistasComponent;
  let fixture: ComponentFixture<MantenedorTransportistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenedorTransportistasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantenedorTransportistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
