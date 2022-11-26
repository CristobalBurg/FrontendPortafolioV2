import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { Comuna, Departamento } from 'src/app/shared/interfaces/reserva.interface';
import { DepartamentoService } from 'src/app/shared/services/departamento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenedor-departamentos',
  templateUrl: './mantenedor-departamentos.component.html',
  styleUrls: ['./mantenedor-departamentos.component.css']
})
export class MantenedorDepartamentosComponent implements OnInit {


  departamentos: Departamento[];
  departamentos$: Observable<Departamento[]>;
  comunas: Comuna[];
  formDepartamentos: FormGroup;
  isEdit:boolean = false;
  departamentoSeleccioando: Departamento;
  filter = new FormControl('', { nonNullable: true });
  w: number = window.innerWidth
  fotoSeleccionada: File;


  constructor(private dS:DepartamentoService , private modalService: NgbModal , private fb: FormBuilder) {
    this.formDepartamentos = this.fb.group({
      direccion: ['', [Validators.required]],
      ctdHabitaciones: [1, [Validators.required]],
      ctdBanos: [1, [Validators.required]],
      valorArriendoDia: [30000, [Validators.required]],
      politicasCondiciones:['', [Validators.required]],
      tamano:[50, [Validators.required]] , 
      comuna: [1, [Validators.required]]
    })
   }

  ngOnInit(): void {
    this.getDepartamentos();
    this.dS.obtenerComunas().subscribe( (comunas) => {
      this.comunas = comunas;
      console.log(this.comunas)

    })
  }

	open(content) {
    this.isEdit = false;
		this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-departamento' })
	}

  agregarDepartamento(){

    console.log(this.formDepartamentos.value)
    

    if(this.formDepartamentos.invalid){
      Swal.fire("Ups..!","El formulario es inválido","error");
      return;
    } 

    let nuevoDepartamento = {} as Departamento;
    nuevoDepartamento.direccion = this.formDepartamentos.get('direccion')?.value
    nuevoDepartamento.ctdHabitaciones = this.formDepartamentos.get('ctdHabitaciones')?.value;
    nuevoDepartamento.ctdBanos = this.formDepartamentos.get('ctdBanos')?.value;
    nuevoDepartamento.valorArriendoDia = this.formDepartamentos.get('valorArriendoDia')?.value;
    nuevoDepartamento.politicasCondiciones = this.formDepartamentos.get('politicasCondiciones')?.value;
    nuevoDepartamento.tamano = this.formDepartamentos.get('tamano')?.value;
    nuevoDepartamento.comuna = this.comunas.find( (comuna) => comuna.idComuna === this.formDepartamentos.get('comuna')?.value) as Comuna;
    nuevoDepartamento.inventarioProductos = [];
    nuevoDepartamento.departamentoMantenciones = [];

    if (this.isEdit){
      nuevoDepartamento.idDepartamento = this.departamentoSeleccioando.idDepartamento;
      nuevoDepartamento.foto = this.departamentoSeleccioando.foto
      this.dS.editarDepartamento(nuevoDepartamento , this.departamentoSeleccioando.idDepartamento || 0 ).subscribe({
        next: (res) =>{
          this.getDepartamentos();
          this.isEdit = false;
          return;
        },
        error: (err) => {
          this.isEdit = false;
          return
        }
      })
    } else {
      this.dS.guardarDepartamento(nuevoDepartamento).subscribe({
        next: (res) =>{
          this.getDepartamentos();
        },
        error: (err) => console.log(err)
      })
    }



  }


  getDepartamentos(){
    this.dS.obtenerDepartamentos().subscribe( (departamentos) => {
      this.departamentos = departamentos;
      this.departamentos$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));    } );
  }

  editarDepartamento( departamento: Departamento , content ){
    this.isEdit = true;
    this.departamentoSeleccioando = departamento;
    console.log(departamento)
    this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-departamento' });
    this.formDepartamentos.get('direccion')?.setValue( departamento.direccion);
    this.formDepartamentos.get('comuna')?.setValue( departamento.comuna.idComuna);
    this.formDepartamentos.get('ctdHabitaciones')?.setValue( departamento.ctdHabitaciones);
    this.formDepartamentos.get('ctdBanos')?.setValue( departamento.ctdBanos);
    this.formDepartamentos.get('tamano')?.setValue( departamento.tamano);
    this.formDepartamentos.get('politicasCondiciones')?.setValue( departamento.politicasCondiciones);
    this.formDepartamentos.get('valorArriendoDia')?.setValue( departamento.valorArriendoDia);

  }

  search(text: string): Departamento[] {
    return this.departamentos.filter((depto) => {
      const term = text.toLowerCase();
      return (
        depto.direccion.toLowerCase().includes(term) ||
        depto.comuna.nombre.toLowerCase().includes(term) 

      );
    });
  }

  eliminarDepartamento(id: number){

    Swal.fire({
      title: 'Seguro que deseas eliminar este departamento',
      text: "Esta acción es IRREVERSIBLE , ¿ estás seguro/a ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dS.borrarDepartamento(id).subscribe( (res) => {
          Swal.fire("Departamento Eliminado","El departamento fue eliminado correctamente","info");
          this.getDepartamentos();
        })
      }
    })
  }

  @HostListener('window:resize', ['$event'])
	onResize() {
		this.w = window.innerWidth;
	}

  seleccionarFoto(event , id){
    this.fotoSeleccionada = event.target.files[0];
    if (this.fotoSeleccionada.type.indexOf('image') < 0 ){
      Swal.fire('Error Upload', 'Seleccione un archivo de imagen', 'error')
      return;
    }
    if (!this.fotoSeleccionada){
      Swal.fire('Error','Debe seleccionar una foto','error')
    } else {
      this.dS.subirFoto( this.fotoSeleccionada , id).subscribe( (x) => {
        console.log(x)
        this.getDepartamentos();
      })
    }

  }



}
