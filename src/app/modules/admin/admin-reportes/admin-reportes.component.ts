import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Departamento, Pago } from 'src/app/shared/interfaces/reserva.interface';
import { ReporteVenta } from 'src/app/shared/interfaces/ventas.interfaces';
import { DepartamentoService } from 'src/app/shared/services/departamento.service';
import { ProductoService } from 'src/app/shared/services/producto.service';
import { ReporteService } from 'src/app/shared/services/reporte.service';

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
  fechaInicio: string;
  fechaFin : string;
  filter = new FormControl('', { nonNullable: true });
  filterPagos = new FormControl('', { nonNullable: true });
  ingresosTotales : number = 0;
  reservasTotales : number = 0;
  egresosTotales: number  = 0 ;

  w = window.innerWidth;

  constructor(private rS: ReporteService , private dS:DepartamentoService , private pS:ProductoService) { }

  ngOnInit(): void {
    this.getPagos();
    this.rS.getReporteVentas('01-01-2020' , '01-01-2024').subscribe( (x: ReporteVenta[]) => {
      this.reportes = x;
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

  @HostListener('window:resize', ['$event'])
	onResize() {
		this.w = window.innerWidth;
	}

  search(text: string): ReporteVenta[] {
    return this.reportes.filter((r) => {
      const term = text.toLowerCase();
      return (
        r.fecha_primera_reserva.toLowerCase().includes(term) ||
        r.fecha_ultima_reserva.toLowerCase().includes(term) 
      );
    });
  }

  searchPago(text: string): Pago[] {
    return this.listadoPagos.filter((p) => {
      const term = text.toLowerCase();
      return (
        p.medioPago.toLowerCase().includes(term) ||
        p.tipoPago.toLowerCase().includes(term)  
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

}
