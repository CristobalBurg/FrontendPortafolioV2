import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CheckIn, Checkout, Reserva, ServicioExtra } from '../interfaces/reserva.interface';
import { DesgloseTotal } from '../interfaces/ventas.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  url : string = environment.BACKEND_URL + '/api/reserva';
  urlCheckin : string = environment.BACKEND_URL + '/api/checkin';
  urlCheckout : string = environment.BACKEND_URL + '/api/checkout';




  constructor(private httpClient:HttpClient) { }


  setLocalReserva( reserva: Reserva ){
    localStorage.setItem('reserva', JSON.stringify(reserva))
  }

  getLocalReserva(){
    return JSON.parse(localStorage.getItem('reserva') || '{}');
  }

  removeLocalReserva(){
    localStorage.removeItem('reserva');
  }

  getServiciosExtra(): Observable<ServicioExtra[]>{

    let segment = '/servicioExtra/listarServiciosExtra';
    return this.httpClient.get<ServicioExtra[]>(this.url + segment)

  }

  getServicioExtraById(id: number): Observable<ServicioExtra>{
    let segment = '/servicioExtra/' + id;
    return this.httpClient.get<ServicioExtra>(this.url + segment)

  }


  saveServicioExtra( nuevoDepto: ServicioExtra): Observable<ServicioExtra>{
    let segment = '/servicioExtra';
    return this.httpClient.post<ServicioExtra>(this.url + segment , nuevoDepto)
  }

  deleteServicioExtra( id: number){
    let segment = '/servicioExtra/'  + id.toString();
    return this.httpClient.delete(this.url + segment)
  }

  editServicioExtra(departamento: ServicioExtra , id: number){
    let segment = '/servicioExtra/'  + id.toString();
    return this.httpClient.put(this.url  + segment , departamento )
  }

  subirFotoSE(archivo: File , id: string){
    let formData = new FormData();
    let segment = '/servicioExtra/upload'
    formData.append("archivo", archivo);
    formData.append("id",id)
    return this.httpClient.post(this.url + segment , formData).pipe(
      map( (res: any) => res.se as ServicioExtra),
      catchError( e =>{
        console.error(e.error.mensaje);
        Swal.fire("Error",e.error.error,'error')
        return throwError(e);
      })
    )
  }

  saveReserva( nuevaReserva: Reserva): Observable<Reserva>{
    let segment = '/';
    return this.httpClient.post<Reserva>(this.url + segment , nuevaReserva)
  }

  
  getReservas(): Observable<Reserva[]>{
    let segment = '/listarReservas';
    return this.httpClient.get<Reserva[]>(this.url + segment)
  }

  cancelarReserva(id) {
    let segment = '/' + id;
    return this.httpClient.delete(this.url + segment)
  }

  crearCheckin( checkIn: CheckIn): Observable<CheckIn[]>{
    return this.httpClient.post<CheckIn[]>(this.urlCheckin , checkIn )
  }

  getCheckins(): Observable<CheckIn[]>{
    let segment = '/listarCheckins';
    return this.httpClient.get<CheckIn[]>(this.urlCheckin + segment)
  }



  imprimirCheckin(idCheckin : number):Observable<HttpResponse<Blob>>{
    let segment = '/download/' + idCheckin;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get<Blob>(this.urlCheckin + segment , { headers , observe: 'response', responseType: 'blob' as 'json'})
  }

  imprimirCheckout(idCheckout : number):Observable<HttpResponse<Blob>>{
    let segment = '/download/' + idCheckout;
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get<Blob>(this.urlCheckout + segment , { headers , observe: 'response', responseType: 'blob' as 'json'})
  }

  crearCheckout( checkout: Checkout){
    return this.httpClient.post<CheckIn[]>(this.urlCheckout , checkout)
  }

  getCheckouts(): Observable<Checkout[]>{
    let segment = '/listarCheckouts';
    return this.httpClient.get<Checkout[]>(this.urlCheckout + segment)
  }



  calcularTotal( reserva: Reserva ): DesgloseTotal {
  
  let totalDias = this.getDias(reserva.fechaLlegada , reserva.fechaEntrega);
  let totalServiciosExtra = 0;
  reserva.reservaServicioExtra.forEach( (rs) => {
    totalServiciosExtra += rs.servicioExtra.tipoPrecio == 'T' ? rs.servicioExtra.valor : rs.servicioExtra.valor * reserva.ctdAcomanantes
  })
  let totalSinServiciosExtra = (totalDias * reserva.departamento.valorArriendoDia)
  let totalGeneral = (totalDias * reserva.departamento.valorArriendoDia) + totalServiciosExtra;
  let totalAnticipo = Math.round(totalGeneral / 2) ;

    return {
      totalDias,
      totalGeneral,
      totalAnticipo,
      totalSinServiciosExtra,
      totalServiciosExtra
    } as DesgloseTotal
 
  }

  getDias(fechaI: string, fechaT: string){
    let fechaIFormatted = moment(fechaI);
    let fechaTFormatted = moment(fechaT);
    return fechaTFormatted.diff( fechaIFormatted , 'days')

  }


}
