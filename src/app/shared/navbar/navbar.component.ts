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

  constructor(private aS: AuthService, private router:Router) {
    this.aS.authChanged
    .subscribe((user?: any) => {
      this.authedUser = user;
      console.log( "user from navbar " , user)
    });
  }
   

  ngOnInit(): void {
    this.authedUser = this.aS.getUser();
  }

  logout(){
    this.aS.logout();
    Swal.fire("Has cerrado tu sesión","Recuerda que para realizar reservas debes estar autenticado","info");
    this.router.navigate(['/home'])
  }


}
