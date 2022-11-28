import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, map, Observable , throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import {Comuna, Departamento, Transportista} from '../interfaces/reserva.interface';


@Injectable({
  providedIn: 'root'
})
export class TransportistaService {

  url : string = environment.BACKEND_URL + '/api/transportista';


  constructor(private httpClient: HttpClient) { }


  obtenerTrasportistas(): Observable<Transportista[]>{

    let segment = '/listarTransportistas';
    return this.httpClient.get<Transportista[]>(this.url + segment)
  }

  obtenerTrasportistaById(id: number): Observable<Transportista>{
    let segment = '/' + id;
    return this.httpClient.get<Transportista>(this.url + segment)
  }


  guardarTransportista( nuevoTransportista: Transportista): Observable<Transportista>{
    let segment = '';
    return this.httpClient.post<Transportista>(this.url + segment , nuevoTransportista)
  }

  borrarTransportista( rut: string){
    let segment = '/'  + rut;
    return this.httpClient.delete(this.url + segment)
  }

  editarTransportista(transportista: Transportista, rut: string){
    let segment = '/'  + rut;
    return this.httpClient.put(this.url  + segment , transportista )
  }

}
