import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData } from 'src/app/shared/interfaces/auth.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  formLogin:FormGroup

  constructor(private fb:FormBuilder , private aS: AuthService , private router:Router) {
    this.formLogin = this.fb.group({
      username: new FormControl(),
      password: new FormControl()
    })
   }

  ngOnInit(): void {
  }

  login(){
    let loginData = new LoginData(this.formLogin.value);
    loginData.username = this.formLogin.value.username;
    loginData.password = this.formLogin.value.password
    this.aS.generarToken(loginData).subscribe( {
      next: (n:any) => {
        console.log("token", n)
        this.aS.logout();
        this.aS.loginUser(n.token);
        this.aS.getCurrentUser().subscribe( (user:any) =>{
          this.aS.setUser(user);
          user.isAdmin == 1 ? this.router.navigate(["/","admin-home"]) : this.router.navigate(['/','paso1'])
          });
      },
      error: (e) => Swal.fire("Ups...!", e.error.mensaje , "error")
    })
  }
}
