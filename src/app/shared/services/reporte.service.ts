import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReporteVenta } from '../interfaces/ventas.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  url = environment.BACKEND_URL + '/api/reportes';

  constructor(private http: HttpClient) { }


  getReporteVentas( fechaInicio: string,  fechaFin: string) : Observable<ReporteVenta[]>{
    let segment = '/ventas';
    const params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);
    return this.http.get<ReporteVenta[]>(this.url + segment , {params})
  }
}
