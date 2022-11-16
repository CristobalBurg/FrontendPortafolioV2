import { Injectable } from '@angular/core';
import { Reserva } from '../interfaces/reserva.interface';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor() { }


  setLocalReserva( reserva: Reserva ){
    localStorage.setItem('reserva', JSON.stringify(reserva))
  }

  getLocalReserva(){
    return localStorage.getItem('reserva') || false;
  }

  removeLocalReserva(){
    localStorage.removeItem('reserva');
  }
}
