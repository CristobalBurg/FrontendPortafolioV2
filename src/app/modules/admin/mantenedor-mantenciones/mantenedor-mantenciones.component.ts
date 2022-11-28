import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { Mantencion } from 'src/app/shared/interfaces/departamento.interface';
import { MantencionService } from 'src/app/shared/services/mantencion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenedor-mantenciones',
  templateUrl: './mantenedor-mantenciones.component.html',
  styleUrls: ['./mantenedor-mantenciones.component.css']
})
export class MantenedorMantencionesComponent implements OnInit {


  mantenciones: Mantencion[];
  mantenciones$: Observable<Mantencion[]>;
  formMantenciones: FormGroup;
  isEdit:boolean = false;
  mantencionSeleccionada: Mantencion;
  filter = new FormControl('', { nonNullable: true });
  w: number = window.innerWidth


  constructor(private dS:MantencionService , private modalService: NgbModal , private fb: FormBuilder) {
    this.formMantenciones = this.fb.group({
      descripcion: ['', [Validators.required]],
      valor: ['', [Validators.required]],
    })
   }

  ngOnInit(): void {
    this.getMantenciones();
  }

	open(content) {
    this.isEdit = false;
		this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-mantencion' })
	}

  agregarMantencion(){

    if(this.formMantenciones.invalid){
      Swal.fire("Ups..!","El formulario es inválido","error");
      return;
    } 

    let nuevaMantencion = {} as Mantencion;
    nuevaMantencion.descripcion = this.formMantenciones.get('descripcion')?.value;
    nuevaMantencion.valor = this.formMantenciones.get('valor')?.value;

    if (this.isEdit){
      nuevaMantencion.idMantencion = this.mantencionSeleccionada.idMantencion;
      this.dS.editarMantencion(nuevaMantencion , this.mantencionSeleccionada.idMantencion|| 0 ).subscribe({
        next: (res) =>{
          this.getMantenciones();
          this.isEdit = false;
          return;
        },
        error: (err) => {
          this.isEdit = false;
          return
        }
      })
    } else {
      this.dS.guardarMantencion(nuevaMantencion).subscribe({
        next: (res) =>{
          this.getMantenciones();
        },
        error: (err) => console.log(err)
      })
    }



  }


  getMantenciones(){
    this.dS.obtenerMantenciones().subscribe( (mantenciones) => {
      this.mantenciones = mantenciones;
      this.mantenciones$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));    } );
  }

  editarMantencion( mantencion: Mantencion , content ){
    this.isEdit = true;
    this.mantencionSeleccionada = mantencion;
    console.log(mantencion)
    this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-mantencion' });
    this.formMantenciones.get('descripcion')?.setValue( mantencion.descripcion);
    this.formMantenciones.get('valor')?.setValue( mantencion.valor);
  }

  search(text: string): Mantencion[] {
    return this.mantenciones.filter((Mtn) => {
      const term = text.toLowerCase();
      return (
        Mtn.idMantencion?.toString().toLowerCase().includes(term) ||
        Mtn.descripcion.toLowerCase().includes(term)
      );
    });
  }

  eliminarMantencion(id: number){

    Swal.fire({
      title: 'Seguro que deseas eliminar esta mantencion?',
      text: "Esta acción es IRREVERSIBLE , ¿ estás seguro/a ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dS.borrarMantencion(id).subscribe( (res) => {
          Swal.fire("Mantencion Eliminada","La mantencion fue eliminado correctamente","info");
          this.getMantenciones();
        })
      }
    })
  }

  @HostListener('window:resize', ['$event'])
	onResize() {
		this.w = window.innerWidth;
	}



}
