import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mantencion } from '../interfaces/departamento.interface';
import { Pago, Producto, Reserva } from '../interfaces/reserva.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url : string = environment.BACKEND_URL + '/api/productos';
  urlMantencion : string = environment.BACKEND_URL + '/api/mantenciones';

  constructor(private http:HttpClient) { }

  getProductos(): Observable<Producto[]>{
    let segment = '/listadoProductos';
    return this.http.get<Producto[]>(this.url + segment)
  }

  deleteInvetarioProductoById(ipId: number){
    let segment = '/ip/' + ipId;
    return this.http.delete(this.url + segment)
  }

  getMantenciones(): Observable<Mantencion[]>{
    let segment = '/listarMantenciones';
    return this.http.get<Mantencion[]>(this.urlMantencion + segment)
  }

  obtenerProductosById(id: number): Observable<Producto>{
    let segment = '/' + id;
    return this.http.get<Producto>(this.url + segment)
  }

  ingresarPago( pago: Pago ){
    let segment = '/pago'
    return this.http.post(this.urlMantencion + segment , pago)
  }


  guardarProducto(nuevoProducto: Producto): Observable<Producto>{
    let segment = '';
    return this.http.post<Producto>(this.url + segment , nuevoProducto)
  }


  borrarProducto( id: number){
    let segment = '/'  + id;
    return this.http.delete(this.url + segment)
  }

  editarProducto(producto: Producto, id: number){
    let segment = '/'  + id;
    return this.http.put(this.url  + segment , producto )
  }


  listarPagos( ):Observable<Pago[]>{
    let segment = '/listarPagos'
    return this.http.get<Pago[]>(this.urlMantencion + segment)
  }

}
