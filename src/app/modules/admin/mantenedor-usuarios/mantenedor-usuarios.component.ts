import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { Usuario } from 'src/app/shared/interfaces/reserva.interface';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenedor-usuarios',
  templateUrl: './mantenedor-usuarios.component.html',
  styleUrls: ['./mantenedor-usuarios.component.css']
})
export class MantenedorUsuariosComponent implements OnInit {


  usuarios: Usuario[];
  usuarios$: Observable<Usuario[]>;
  formUsuarios: FormGroup;
  isEdit:boolean = false;
  usuarioSeleccionado: Usuario;
  filter = new FormControl('', { nonNullable: true });
  w: number = window.innerWidth


  constructor(private dS:UsuarioService , private modalService: NgbModal , private fb: FormBuilder) {
    this.formUsuarios = this.fb.group({
      rutUsuario: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      password:['', [Validators.required]],
      telefono:['', [Validators.required]] , 
      username: ['', [Validators.required]]
    })
   }

  ngOnInit(): void {
    this.getUsuarios();
  }

	open(content) {
    this.isEdit = false;
		this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-usuario' })
	}

  agregarUsuario(){

    if(this.formUsuarios.invalid){
      Swal.fire("Ups..!","El formulario es inválido","error");
      return;
    } 

    let nuevoUsuario = {} as Usuario;
    nuevoUsuario.rutUsuario = this.formUsuarios.get('rutUsuario')?.value
    nuevoUsuario.apellido = this.formUsuarios.get('apellido')?.value;
    nuevoUsuario.email = this.formUsuarios.get('email')?.value;
    nuevoUsuario.nombre = this.formUsuarios.get('nombre')?.value;
    nuevoUsuario.password = this.formUsuarios.get('password')?.value;
    nuevoUsuario.telefono = this.formUsuarios.get('telefono')?.value;
    nuevoUsuario.username = this.formUsuarios.get('username')?.value;;
    nuevoUsuario.isAdmin = 2;
    nuevoUsuario.enabled = true;

    if (this.isEdit){
      nuevoUsuario.rutUsuario = this.usuarioSeleccionado.rutUsuario;
      this.dS.editarUsuario(nuevoUsuario , this.usuarioSeleccionado.rutUsuario|| '' ).subscribe({
        next: (res) =>{
          this.getUsuarios();
          this.isEdit = false;
          return;
        },
        error: (err) => {
          this.isEdit = false;
          return
        }
      })
    } else {
      this.dS.guardarUsuario(nuevoUsuario).subscribe({
        next: (res) =>{
          this.getUsuarios();
        },
        error: (err) => console.log(err)
      })
    }



  }


  getUsuarios(){
    this.dS.obtenerUsuarios().subscribe( (usuarios) => {
      this.usuarios = usuarios;
      this.usuarios$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));    } );
  }

  editarUsuario( usuario: Usuario , content ){
    this.isEdit = true;
    this.usuarioSeleccionado = usuario;
    console.log(usuario)
    this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-usuario' });
    this.formUsuarios.get('rutUsuario')?.setValue( usuario.rutUsuario);
    this.formUsuarios.get('apellido')?.setValue( usuario.apellido);
    this.formUsuarios.get('email')?.setValue( usuario.email);
    this.formUsuarios.get('nombre')?.setValue( usuario.nombre);
    this.formUsuarios.get('password')?.setValue( usuario.password);
    this.formUsuarios.get('telefono')?.setValue( usuario.telefono);
    this.formUsuarios.get('username')?.setValue( usuario.username);
  }

  search(text: string): Usuario[] {
    return this.usuarios.filter((User) => {
      const term = text.toLowerCase();
      return (
        User.nombre.toLowerCase().includes(term) ||
        User.rutUsuario?.toLowerCase().includes(term) ||
        User.apellido.toLowerCase().includes(term)||
        User.telefono.toLowerCase().includes(term)||
        User.email.toLowerCase().includes(term)
      );
    });
  }

  eliminarUsuario(rut: string){

    Swal.fire({
      title: 'Seguro que deseas eliminar este usuario',
      text: "Esta acción es IRREVERSIBLE , ¿ estás seguro/a ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dS.borrarUsuario(rut).subscribe( (res) => {
          Swal.fire("Usuario Eliminado","El Usuario fue eliminado correctamente","info");
          this.getUsuarios();
        })
      }
    })
  }

  @HostListener('window:resize', ['$event'])
	onResize() {
		this.w = window.innerWidth;
	}



}
