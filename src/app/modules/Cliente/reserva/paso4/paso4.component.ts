import { Component, OnInit } from '@angular/core';
import { Pago, Reserva, ReservaPago, ReservaServicioExtra, ServicioExtra } from 'src/app/shared/interfaces/reserva.interface';
import { ReservaService } from 'src/app/shared/services/reserva.service';
import moment from 'moment';
import { DesgloseTotal } from 'src/app/shared/interfaces/ventas.interfaces';
import Swal from 'sweetalert2';
import { tap , finalize} from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';



@Component({
  selector: 'app-paso4',
  templateUrl: './paso4.component.html',
  styleUrls: ['./paso4.component.css']
})
export class Paso4Component implements OnInit {


  reserva: Reserva ;
  selectedServicioExtras: ServicioExtra[] = [];
  hasTransportista: boolean;
  totales: DesgloseTotal;

  constructor(private rS:ReservaService, private spinner: NgxSpinnerService, private router:Router) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.reserva = this.rS.getLocalReserva();
    this.totales = this.rS.calcularTotal( this.reserva );
    this.hasTransportista = this.reserva.reservaServicioExtra.find( (se) => se.servicioExtra.nombre == "Transporte") ? true : false;
  }

  crearAnticipo(): void{
    let anticipo: Pago = {
      tipoPago: 'ANTICIPO',
      monto: this.totales.totalAnticipo,
      medioPago: "DC" 
    } 

    let reservaPago : ReservaPago = {
      pago: anticipo
    }
    this.reserva.reservaPagos.push(reservaPago)
  }


  simularPago(){

    this.spinner.show()
    this.crearAnticipo();
    console.log("Incoming Reserva", this.reserva);

    this.rS.saveReserva( this.reserva ).subscribe({
      next: () => {   
        this.spinner.hide()
        Swal.fire("Reserva Completada!", "El pago fue procesado correctamente (simulación) , hemos enviado el comprobante de la reserva a " + this.reserva.usuario.email , "success")
        this.router.navigate(["/home"]);
      },
      error: (err) => {
        this.spinner.hide()
        Swal.fire("Error",err.error.mensaje || "Error al crear la reserva","error")
      }
    })

 



 

  }

  







}
