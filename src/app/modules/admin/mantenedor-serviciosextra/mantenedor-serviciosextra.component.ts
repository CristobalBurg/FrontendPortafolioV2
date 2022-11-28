import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { ServicioExtra } from 'src/app/shared/interfaces/reserva.interface';
import { ServicioExtraService } from 'src/app/shared/services/servicioseextra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenedor-serviciosextra',
  templateUrl: './mantenedor-serviciosextra.component.html',
  styleUrls: ['./mantenedor-serviciosextra.component.css']
})
export class MantenedorServiciosExtraComponent implements OnInit {


  serviciosextra: ServicioExtra[];
  serviciosextra$: Observable<ServicioExtra[]>;
  formServiciosExtra: FormGroup;
  isEdit:boolean = false;
  servicioExtraSeleccionado: ServicioExtra;
  filter = new FormControl('', { nonNullable: true });
  w: number = window.innerWidth
  fotoSeleccionada: File;


  constructor(private dS:ServicioExtraService , private modalService: NgbModal , private fb: FormBuilder) {
    this.formServiciosExtra = this.fb.group({
      descripcion: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      tipoPrecio: ['', [Validators.required]],
      valor:['', [Validators.required]],
    })
   }

  ngOnInit(): void {
    this.getServiciosExtra();
  }

	open(content) {
    this.isEdit = false;
		this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-servicioextra' })
	}

  agregarServicioExtra(){

    console.log(this.formServiciosExtra.value)
    

    if(this.formServiciosExtra.invalid){
      Swal.fire("Ups..!","El formulario es inválido","error");
      return;
    } 

    let nuevoServicioExtra = {} as ServicioExtra;
    nuevoServicioExtra.descripcion = this.formServiciosExtra.get('descripcion')?.value;
    nuevoServicioExtra.nombre = this.formServiciosExtra.get('nombre')?.value;
    nuevoServicioExtra.tipoPrecio = this.formServiciosExtra.get('tipoPrecio')?.value;
    nuevoServicioExtra.valor= this.formServiciosExtra.get('valor')?.value;
    
    if (this.isEdit){
      nuevoServicioExtra.idServicioExtra = this.servicioExtraSeleccionado.idServicioExtra;
      nuevoServicioExtra.foto = this.servicioExtraSeleccionado.foto
      this.dS.editarServicioExtra(nuevoServicioExtra , this.servicioExtraSeleccionado.idServicioExtra|| 0 ).subscribe({
        next: (res) =>{
          this.getServiciosExtra();
          this.isEdit = false;
          return;
        },
        error: (err) => {
          this.isEdit = false;
          return
        }
      })
    } else {
      this.dS.guardarServicioExtra(nuevoServicioExtra).subscribe({
        next: (res) =>{
          this.getServiciosExtra();
        },
        error: (err) => console.log(err)
      })
    }



  }


  getServiciosExtra(){
    this.dS.obtenerServiciosExtra().subscribe( (serviciosextra) => {
      this.serviciosextra = serviciosextra;
      this.serviciosextra$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));    } );
  }

  editarServicioExtra( servicioextra: ServicioExtra , content ){
    this.isEdit = true;
    this.servicioExtraSeleccionado = servicioextra;
    console.log(servicioextra)
    this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-servicioextra' });
    this.formServiciosExtra.get('descripcion')?.setValue( servicioextra.descripcion);
    this.formServiciosExtra.get('nombre')?.setValue( servicioextra.nombre);
    this.formServiciosExtra.get('tipoPrecio')?.setValue( servicioextra.tipoPrecio);
    this.formServiciosExtra.get('valor')?.setValue( servicioextra.valor);
  }

  search(text: string): ServicioExtra[] {
    return this.serviciosextra.filter((sre) => {
      const term = text.toLowerCase();
      return (
        sre.idServicioExtra?.toString().toLowerCase().includes(term) ||
        sre.nombre.toLowerCase().includes(term) ||
        sre.descripcion.toLowerCase().includes(term) ||
        sre.tipoPrecio.toLowerCase().includes(term) ||
        sre.valor.toString().toLowerCase().includes(term)

      );
    });
  }

  eliminarServicioExtra(id: number){

    Swal.fire({
      title: 'Seguro que deseas eliminar este servicio extra?',
      text: "Esta acción es IRREVERSIBLE , ¿ estás seguro/a ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dS.borrarServicioExtra(id).subscribe( (res) => {
          Swal.fire("Serivio Extra Eliminado","El Servicio Extra fue eliminado correctamente","info");
          this.getServiciosExtra();
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
        this.getServiciosExtra();
      })
    }

  }



}

