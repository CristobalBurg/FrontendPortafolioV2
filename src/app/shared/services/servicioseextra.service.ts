import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, map, Observable , throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ServicioExtra } from '../interfaces/reserva.interface';


@Injectable({
  providedIn: 'root'
})
export class ServicioExtraService {

  url : string = environment.BACKEND_URL + '/api/reserva/servicioExtra';


  constructor(private httpClient: HttpClient) { }


  obtenerServiciosExtra(): Observable<ServicioExtra[]>{

    let segment = '/listarServiciosExtra';
    return this.httpClient.get<ServicioExtra[]>(this.url + segment)

  }

  obtenerServicioExtraById(id: number): Observable<ServicioExtra>{
    let segment = '/' + id;
    return this.httpClient.get<ServicioExtra>(this.url + segment)

  }

  guardarServicioExtra( nuevoServicioExtra: ServicioExtra): Observable<ServicioExtra>{
    let segment = '';
    return this.httpClient.post<ServicioExtra>(this.url + segment , nuevoServicioExtra)
  }

  borrarServicioExtra( id: number){
    let segment = '/'  + id;
    return this.httpClient.delete(this.url + segment)
  }

  editarServicioExtra(servicioextra: ServicioExtra, id: number){
    let segment = '/'  + id.toString();
    return this.httpClient.put(this.url  + segment , servicioextra)
  }
  
  subirFoto(archivo: File , id: string){
    let formData = new FormData();
    let segment = '/upload'
    formData.append("archivo", archivo);
    formData.append("id",id)
    return this.httpClient.post(this.url + segment , formData).pipe(
      map( (res: any) => res.seriviciosextra as ServicioExtra),
      catchError( e =>{
        console.error(e.error.mensaje);
        Swal.fire("Error",e.error.error,'error')
        return throwError(e);
      })
    )
  }
}
