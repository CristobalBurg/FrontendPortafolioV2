import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder , Validators , AbstractControl } from '@angular/forms';
import { Usuario } from 'src/app/shared/interfaces/auth.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomValidatorsService } from 'src/app/shared/services/custom-validators.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

// Typescript ===== JAVASCRIPT 


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  formRegister: FormGroup;

  constructor(private fb: FormBuilder , private cvS: CustomValidatorsService, private aS: AuthService , private router: Router) {
    this.formRegister = this.fb.group({
      rutUsuario: ['', [Validators.required , cvS.rutValidator()]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required ,cvS.createPasswordStrengthValidator()]],
      password2: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]], // mail@asd.com pattern
      telefono: ['', [Validators.required ,Validators.maxLength(8),Validators.pattern('[- +()0-9]{8,8}')]],
      isAdmin: [2, [Validators.required]]
    } , { validator: this.checkPasswords })
   }

  ngOnInit(): void {
  }

  registrarUsuario(){
    this.formRegister.markAllAsTouched();
    if (this.formRegister.valid){
      let nuevoUsuario: Usuario = this.formRegister.value;
      delete nuevoUsuario.password2;
      nuevoUsuario.telefono = '+569' + nuevoUsuario.telefono;
      nuevoUsuario.isAdmin = 2;
      this.aS.createUsuario(nuevoUsuario).subscribe( {
        next: () => { 
          Swal.fire({
            title: 'Usuario Creado!',
            text: 'Bienvenido: ' + nuevoUsuario.nombre + " !",
            icon:'success',
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/','login'])
            
            }
          })
        },
        error: (e) => {Swal.fire("Error", 'Su rut ya está registrado' , "error")}
      })
    }
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls['password']?.value;
    const confirmPass = group.controls['password2'].value;
    return pass === confirmPass ? null : { notSame: true };
}

}
