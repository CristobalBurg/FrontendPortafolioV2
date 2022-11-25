import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { DepartamentoMantenciones, Mantencion } from 'src/app/shared/interfaces/departamento.interface';
import { Departamento, Reserva } from 'src/app/shared/interfaces/reserva.interface';
import { DepartamentoService } from 'src/app/shared/services/departamento.service';
import { ProductoService } from 'src/app/shared/services/producto.service';
import { ReservaService } from 'src/app/shared/services/reserva.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenciones',
  templateUrl: './mantenciones.component.html',
  styleUrls: ['./mantenciones.component.css']
})
export class MantencionesComponent implements OnInit {


  departamento: Departamento;
  listadoMantenciones: DepartamentoMantenciones[];
  listadoMantenciones$:Observable<DepartamentoMantenciones[]>;
  maestroMantenciones: Mantencion[]
  filter = new FormControl('', { nonNullable: true });
  formMantenciones: FormGroup;
  disabledDates:string[] = []
  parsedDisabledDates:NgbDateStruct[];

  disabledDatesMantenciones:string[] = []
  parsedDisabledDatesMantenciones:NgbDateStruct[];

  listadoReservas: Reserva[];
  


  constructor(private activatedRoute:ActivatedRoute,
     private router:Router,
     private dS:DepartamentoService,
     private pS:ProductoService,
     private modalService: NgbModal,
     private fb:FormBuilder,
     private rS:ReservaService,
     private ngbPF: NgbDateParserFormatter,
     private uS: UtilsService

     
     ) {
    this.getMantenciones();
    this.formMantenciones = this.fb.group({
      mantencion:  [1, [Validators.required]],
      fechaInicio: ["", [Validators.required]],
      fechaFin: ["", [Validators.required]]
    })
    this.departamento = this.router.getCurrentNavigation()?.extras.state?.departamento;
    if (!this.departamento) {
      this.activatedRoute.params.subscribe(params => {
        let id = params['id'];
        this.getDepartamentoById(id);

      });
    } else {
      this.listadoMantenciones = this.departamento.departamentoMantenciones;
      this.disabledDatesMantenciones = this.listadoMantenciones.map( (dm) => {
        return this.uS.enumerateDaysBetweenDates(dm.fechaInicio , dm.fechaFin)[0]
      })
      console.log(this.disabledDatesMantenciones)
      this.listadoMantenciones$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));
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
      console.log(this.disabledDates)
      console.log(this.parsedDisabledDates)
    })
  }



  getDepartamentoById(id){
    this.dS.obtenerDepartamentoById(id).subscribe((x: Departamento) => {
      this.departamento = x;
      console.log(this.departamento.departamentoMantenciones)
      this.listadoMantenciones = x.departamentoMantenciones;
      this.listadoMantenciones$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));
    })
  }

  search(text: string): DepartamentoMantenciones[] {
    return this.listadoMantenciones.filter((mt) => {
      const term = text.toLowerCase();
      return (
        mt.mantencion.descripcion.toLowerCase().includes(term) || 
        mt.fechaInicio.toLowerCase().includes(term) || 
        mt.fechaFin.toLowerCase().includes(term) 
      );
    });
  }

  getMantenciones(){
    this.pS.getMantenciones().subscribe( (m) => {
      this.maestroMantenciones = m;
    })
  }

  agendarMantencion(){
    let newDepartamentoMantencion = {} as DepartamentoMantenciones;
    newDepartamentoMantencion.fechaInicio = this.formMantenciones.get('fechaInicio')?.value;
    newDepartamentoMantencion.fechaFin = this.formMantenciones.get('fechaFin')?.value;
    newDepartamentoMantencion.mantencion = this.maestroMantenciones.find( (x) => x.idMantencion === Number(this.formMantenciones.get('mantencion')?.value)) as Mantencion;
    this.departamento.departamentoMantenciones.push(newDepartamentoMantencion);
    Swal.fire({
      title: 'Seguro que deseas agendar esta mantención?',
      text: "Se realizará la simulación e pago y no se podra modificar la programacion de esta mantención",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dS.editarDepartamento( this.departamento , Number(this.departamento.idDepartamento)).subscribe({
          next: (n) => {
            this.getDepartamentoById(this.departamento.idDepartamento);
            Swal.fire("Mantención agendada","se ha agendado correctamente la mantención" , "success");
            this.modalService.dismissAll()
          }
        })
      }
    })


  } 

  open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-mantenciones' })
	}

  getSelectedDate(rangoFechas){
    if (!rangoFechas) return;
    this.formMantenciones.get('fechaInicio')?.setValue(rangoFechas.inicio);
    this.formMantenciones.get('fechaFin')?.setValue(rangoFechas.fin);
    console.log(this.formMantenciones.value)

  }

}
