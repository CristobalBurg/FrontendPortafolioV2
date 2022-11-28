import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginData, Usuario } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authChanged: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient) { }


  public generarToken( loginData: LoginData){
    return this.http.post( environment. BACKEND_URL + '/generate-token', loginData)
  }
  
  public getCurrentUser(){
    return this.http.get( environment. BACKEND_URL + '/current-user' )
  }

  public loginUser(token: string){
    localStorage.setItem('token',token);
  }

  public isLoggedIn(){
    let token  = localStorage.getItem('token');
    return token ? true : false;
  }

  public logout () {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authChanged.emit(false);
    return true;
  }

  public getToken(){
    return localStorage.getItem('token')
  }

  public setUser( usuario: any ){
    localStorage.setItem('user', JSON.stringify(usuario))
    this.authChanged.emit(this.getUser());
  }
  
  public getUser(){
    let user = localStorage.getItem('user');
    if (user != null){
      return JSON.parse(user);
    } else {
      this.logout();
      return null
    }
  }

  public getUserRole(){
    let user = this.getUser();
    return user.authorities[0].authority || null;
  }

  public createUsuario( usuario: Usuario){
    return this.http.post( environment. BACKEND_URL + '/api/usuarios' , usuario);
  }
}
