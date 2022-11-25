import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServicioExtra } from '../interfaces/reserva.interface';



@Component({
  selector: 'app-card-servicio-extra',
  templateUrl: './card-servicio-extra.component.html',
  styleUrls: ['./card-servicio-extra.component.css']
})
export class CardServicioExtraComponent implements OnInit {

  @Output() addEmitter = new EventEmitter<any>();
  @Output() removeEmitter = new EventEmitter<any>();

  @Input()
  servicioExtra:ServicioExtra;
  @Input()
  selectedServiciosExtra: ServicioExtra[];
  @Input()
  isConfirmacion: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  addServicioExtra( se:ServicioExtra){
    this.addEmitter.emit(se);
  }

  removeServicioExtra ( se:ServicioExtra){
    this.removeEmitter.emit(se)
  }

  checkServicioExtra(){
    return this.selectedServiciosExtra.includes( this.servicioExtra );
  }

}
