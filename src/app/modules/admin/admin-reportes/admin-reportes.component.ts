import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { Departamento, Pago } from 'src/app/shared/interfaces/reserva.interface';
import { ReporteVenta } from 'src/app/shared/interfaces/ventas.interfaces';
import { DepartamentoService } from 'src/app/shared/services/departamento.service';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { ProductoService } from 'src/app/shared/services/producto.service';
import { ReporteService } from 'src/app/shared/services/reporte.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-reportes',
  templateUrl: './admin-reportes.component.html',
  styleUrls: ['./admin-reportes.component.css']
})
export class AdminReportesComponent implements OnInit {


  reportes : ReporteVenta[];
  departamentos: Departamento[]
  reportes$: Observable<ReporteVenta[]>
  listadoPagos: Pago[];
  listadoPagos$: Observable<Pago[]>
  fechaInicio: NgbDateStruct;
  fechaFin : NgbDateStruct;
  filter = new FormControl('', { nonNullable: true });
  filterPagos = new FormControl('', { nonNullable: true });
  ingresosTotales : number = 0;
  reservasTotales : number = 0;
  egresosTotales: number  = 0 ;
  formFechas: FormGroup;
  maxDate: NgbDateStruct;
  fechaInicioParse: string;
  fechaFinParse: string;


  w = window.innerWidth;

  constructor(
    private rS: ReporteService,
    private dS:DepartamentoService,
    private pS:ProductoService,
    private fb: FormBuilder,
    private uS: UtilsService,
    private ngbPF: NgbDateParserFormatter,
    private xS: ExcelService

    ) {
      
      this.fechaFin = ngbPF.parse( moment().add(1 , 'years').format('yyyy-MM-DD') ) as NgbDateStruct
      this.fechaInicio = ngbPF.parse( moment().subtract( 1 , 'years').format('yyyy-MM-DD') ) as NgbDateStruct
      this.fechaFinParse = moment().add(1 , 'years' ).format('DD-MM-yyyy')
      this.fechaInicioParse  = moment().subtract( 2 , 'years').format('DD-MM-yyyy')
      this.formFechas = this.fb.group({
        fechaInicio: ["", [Validators.required]],
        fechaFin:["", [Validators.required]]
      })
     }

  ngOnInit(): void {
    this.getPagos();
    console.log( this.fechaInicioParse)
    this.getReporteByFecha(this.fechaInicioParse , this.fechaFinParse);


    
  }

  @HostListener('window:resize', ['$event'])
	onResize() {
		this.w = window.innerWidth;
	}

  search(text: string): ReporteVenta[] {
    return this.reportes.filter((r) => {
      const term = text.toLowerCase();
      return (
        r.fecha_primera_reserva.toLowerCase().includes(term) ||
        r.fecha_ultima_reserva.toLowerCase().includes(term) ||
        r.comuna?.toLowerCase().includes(term) ||
        r.departamento?.toLowerCase().includes(term)


      );
    });
  }

  searchPago(text: string): Pago[] {
    return this.listadoPagos.filter((p) => {
      const term = text.toLowerCase();
      return (
        p.medioPago.toLowerCase().includes(term) ||
        p.tipoPago.toLowerCase().includes(term)  ||
        p.observacion?.toLowerCase().includes(term)   ||
        p.fecha?.toLocaleLowerCase().includes(term)

      );
    });
  }


  getPagos(){
    this.pS.listarPagos().subscribe( (p) => {
      this.listadoPagos = p.filter( (p) => p.tipoPago == "MANTENCION");
      let reducer = (sum,val) => sum + val;
      let initialValue = 0;
      this.egresosTotales = this.listadoPagos.map( e => e.monto).reduce( reducer , initialValue);
      this.listadoPagos$ = this.filterPagos.valueChanges.pipe(
        startWith(''),
        map((text) => this.searchPago(text)));
    })
  }


  filtrarPorFecha(){
    console.log(this.formFechas.value)


    let parsedInicio =this.ngbPF.format( this.formFechas.get('fechaInicio')?.value )
    let parsedFin =this.ngbPF.format( this.formFechas.get('fechaFin')?.value )
    let momentParsedInicio  = moment(parsedInicio).format('DD-MM-yyyy')
    let momentParsedFin  = moment(parsedFin).format('DD-MM-yyyy');
    console.log( moment(parsedInicio))
    if( moment(parsedInicio).isAfter(moment(parsedFin))){
      Swal.fire("Error","La fecha de inicio no puede ser posterior a la fecha de termino","error");
      return;
    }

    this.getReporteByFecha( momentParsedInicio , momentParsedFin); 

  }


  getReporteByFecha( fechaI , fechaF) {

    this.rS.getReporteVentas( fechaI , fechaF).subscribe( (x: ReporteVenta[]) => {
      this.reportes = x;
      console.log(x)
      this.dS.obtenerDepartamentos().subscribe( (d) => {
        this.departamentos = d;
        this.reportes = this.reportes.map( (r) => {
          return {
            ...r,
            departamento: this.departamentos.find( (d) => d.idDepartamento === r.id_departamento)?.direccion,
            comuna: this.departamentos.find( (d) => d.idDepartamento === r.id_departamento)?.comuna.nombre
          }
        })
        let reducer = (sum,val) => sum + val;
        let initialValue = 0;
        this.ingresosTotales = this.reportes.map( i => i.ingresos).reduce( reducer , initialValue);
        this.reservasTotales = this.reportes.map( i => i.numero_reservas).reduce( reducer , initialValue);

        this.reportes$ = this.filter.valueChanges.pipe(
          startWith(''),
          map((text) => this.search(text)));
      })

    })
  }

  exportXLS(){

    if (this.reportes.length == 0){
      Swal.fire("Error","No hay registro de ingresos","error");
      return;
    }


    let ingresos = this.reportes.map( (r) => {
      return {
        id: r.id_departamento,
        direccion: r.departamento,
        comuna:r.comuna,
        diasArrendado: r.dias,
        primeraReserva: moment(r.fecha_primera_reserva).format('DD-MM-yyyy'),
        ultimaReserva:moment(r.fecha_primera_reserva).format('DD-MM-yyyy'),
        cantidadReservas:r.numero_reservas,
        ingresos: r.ingresos
      }
    })

    this.xS.exportAsExcelFile(ingresos , 'reporteVentas')

  }



}
