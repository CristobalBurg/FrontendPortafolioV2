import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Departamento, Reserva } from 'src/app/shared/interfaces/reserva.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DepartamentoService } from 'src/app/shared/services/departamento.service';
import { ReservaService } from 'src/app/shared/services/reserva.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paso2',
  templateUrl: './paso2.component.html',
  styleUrls: ['./paso2.component.css']
})
export class Paso2Component implements OnInit {

  departamento : Departamento;
  reserva = {} as Reserva


  constructor(
    public router: Router, 
    public activatedRoute: ActivatedRoute, 
    private dS: DepartamentoService , 
    private aS:AuthService,
    private rS:ReservaService
    ) {
     this.departamento = this.router.getCurrentNavigation()?.extras.state?.departamento;
     if (!this.departamento){ 
      this.activatedRoute.params.subscribe(params => {
        let id = params['id'];
        this.dS.obtenerDepartamentoById(id).subscribe( (x:Departamento) => {
          this.departamento = x;
        })
        });
     }
   }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getSelectedDate( rangoFechas ){
    if (!rangoFechas){
      this.rS.removeLocalReserva();
      return;
    } 
    this.reserva.departamento = this.departamento;
    this.reserva.fechaLlegada = rangoFechas.inicio;
    this.reserva.fechaEntrega = rangoFechas.fin;
    this.reserva.usuario = this.aS.getUser();
    this.reserva.reservaPagos = [];
    this.rS.setLocalReserva( this.reserva )

  }

  irPaso3(){
    if(!this.rS.getLocalReserva()){
      Swal.fire("Ups..!","Debes seleccionar un rango de fecha válido para el arriendo","info")
      return;
    }
    this.router.navigate(["/paso3"])
  }

}
