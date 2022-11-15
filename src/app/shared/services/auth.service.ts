import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginData, Usuario } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
    return true;
  }

  public getToken(){
    return localStorage.getItem('token')
  }

  public setUser( usuario: any ){
    localStorage.setItem('user', JSON.stringify(usuario))
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
    return user.authorities[0].authority;
  }

  public createUsuario( usuario: Usuario){
    return this.http.post( environment. BACKEND_URL + '/api/usuarios' , usuario);
  }
}
