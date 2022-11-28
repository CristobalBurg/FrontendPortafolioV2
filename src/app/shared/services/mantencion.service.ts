import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, map, Observable , throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Mantencion } from '../interfaces/departamento.interface';


@Injectable({
  providedIn: 'root'
})
export class MantencionService {

  url : string = environment.BACKEND_URL + '/api/mantenciones';


  constructor(private httpClient: HttpClient) { }


  obtenerMantenciones(): Observable<Mantencion[]>{

    let segment = '/listarMantenciones';
    return this.httpClient.get<Mantencion[]>(this.url + segment)

  }

  obtenerMantencionById(id: number): Observable<Mantencion>{
    let segment = '/' + id;
    return this.httpClient.get<Mantencion>(this.url + segment)

  }

  guardarMantencion( nuevaMantencion: Mantencion): Observable<Mantencion>{
    let segment = '';
    return this.httpClient.post<Mantencion>(this.url + segment , nuevaMantencion)
  }

  borrarMantencion( id: number){
    let segment = '/'  + id;
    return this.httpClient.delete(this.url + segment)
  }

  editarMantencion(mantencion: Mantencion, id: number){
    let segment = '/'  + id.toString();
    return this.httpClient.put(this.url  + segment , mantencion)
  }
}
