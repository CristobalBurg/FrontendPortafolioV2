import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Reserva, ReservaServicioExtra, ServicioExtra } from 'src/app/shared/interfaces/reserva.interface';
import { ReservaService } from 'src/app/shared/services/reserva.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paso3',
  templateUrl: './paso3.component.html',
  styleUrls: ['./paso3.component.css']
})
export class Paso3Component implements OnInit {

  listadoServiciosExtra: ServicioExtra[];
  selectedServicioExtras: ServicioExtra[] = [];
  formAcompanantes:FormGroup;
  reserva: Reserva;

  constructor(private rS: ReservaService , private fb: FormBuilder, private router:Router) {
    this.formAcompanantes = this.fb.group({
      acompanantes: [1, [Validators.required, Validators.max(5)]],
    })
   }

  ngOnInit(): void {
    this.reserva = this.rS.getLocalReserva();
    this.reserva.reservaPagos = [];
    this.rS.setLocalReserva(this.reserva);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(( Object.keys( this.rS.getLocalReserva()).length == 0)){
      this.router.navigate(["/home"]);
      return
    }

    
    this.rS.getServiciosExtra().subscribe( (x) => {
      this.listadoServiciosExtra = x;
    })
  }

  addServicioExtra (se: ServicioExtra){
    this.selectedServicioExtras.push( se );
    console.log( this.selectedServicioExtras)
  }
  removeServicioExtra (se: ServicioExtra){
    this.selectedServicioExtras = this.selectedServicioExtras.filter( (s) => {
      return s.idServicioExtra !== se.idServicioExtra;
    });

  }

  irPaso4(){
    if (this.formAcompanantes.invalid || !this.rS.getLocalReserva()){
      Swal.fire("Ups..!", "La cantidad de Acompañantes debe ser entre 0 y 5" , "error");
      return;
    }
    let reserva: Reserva = this.rS.getLocalReserva();
    let reservaServiciosExtra = this.selectedServicioExtras.map( (x) => {
      return {
        servicioExtra: x,
        cantidad: this.formAcompanantes.value.acompanantes
      } as ReservaServicioExtra
    })
    reserva.reservaServicioExtra = reservaServiciosExtra
    reserva.ctdAcomanantes = this.formAcompanantes.value.acompanantes;
    this.rS.setLocalReserva(reserva);
    this.router.navigate(['/paso4'])

  }

}
