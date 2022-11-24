import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { map, Observable } from 'rxjs';
import { Departamento, Reserva } from 'src/app/shared/interfaces/reserva.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DepartamentoService } from 'src/app/shared/services/departamento.service';
import { ReservaService } from 'src/app/shared/services/reserva.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paso2',
  templateUrl: './paso2.component.html',
  styleUrls: ['./paso2.component.css']
})
export class Paso2Component implements OnInit {

  departamento : Departamento;
  reserva = {} as Reserva
  listadoReservas: Reserva[];
  dias;
  disabledDates:string[] = []
  parsedDisabledDates:NgbDateStruct[];


  constructor(
    public router: Router, 
    public activatedRoute: ActivatedRoute, 
    private dS: DepartamentoService , 
    private aS:AuthService,
    private rS:ReservaService,
    private ngbPF: NgbDateParserFormatter,
    private uS:UtilsService
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
    this.rS.getReservas().subscribe( (x) => {
      this.listadoReservas = x.filter( (x) => {
        return x.departamento.idDepartamento === this.departamento.idDepartamento
      });
      this.listadoReservas.forEach( (rs) => {
        let listadofechas = this.uS.enumerateDaysBetweenDates(rs.fechaLlegada, rs.fechaEntrega);
        this.disabledDates = this.disabledDates.concat(listadofechas);
      })
      this.parsedDisabledDates = this.disabledDates.map( (md) => {
        return this.ngbPF.parse(md) as NgbDateStruct
      })
    })
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
