import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { catchError, map, Observable , throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Usuario } from '../interfaces/reserva.interface';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url : string = environment.BACKEND_URL + '/api/usuarios';


  constructor(private httpClient: HttpClient) { }


  obtenerUsuarios(): Observable<Usuario[]>{

    let segment = '/listarUsuarios';
    return this.httpClient.get<Usuario[]>(this.url + segment)

  }

  obtenerUsuarioById(id: string): Observable<Usuario>{
    let segment = '/' + id;
    return this.httpClient.get<Usuario>(this.url + segment)

  }

  guardarUsuario( nuevoUser: Usuario): Observable<Usuario>{
    let segment = '';
    return this.httpClient.post<Usuario>(this.url + segment , nuevoUser)
  }

  borrarUsuario( rut: string){
    let segment = '/'  + rut;
    return this.httpClient.delete(this.url + segment)
  }

  editarUsuario(usuario: Usuario, rut: string){
    let segment = '/'  + rut;
    return this.httpClient.put(this.url  + segment , usuario )
  }
}
