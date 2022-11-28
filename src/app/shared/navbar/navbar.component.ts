import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit  {

  authedUser: Usuario
  isAdmin: boolean = false;

  constructor(private aS: AuthService, private router:Router) {
    this.aS.authChanged
    .subscribe((user?: any) => {
      this.authedUser = user;
      this.isAdmin = this.authedUser.isAdmin === 1 ? true : false;
    });
  }
   

  ngOnInit(): void {
    this.authedUser = this.aS.getUser();
    console.log(this.authedUser)
    if (!this.authedUser){
      this.isAdmin = false;
    } else {
      this.isAdmin = this.authedUser.isAdmin === 1 ? true : false;

    }
  }

  logout(){
    this.aS.logout();
    Swal.fire("Has cerrado tu sesión","Recuerda que para realizar reservas debes estar autenticado","info");
    this.router.navigate(['/home'])
  }

  irPaso1(){

  }


}
