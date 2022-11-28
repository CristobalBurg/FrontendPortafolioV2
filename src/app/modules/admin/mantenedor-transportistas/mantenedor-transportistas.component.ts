import {Component, HostListener, OnInit} from '@angular/core';
import {Transportista} from "../../../shared/interfaces/reserva.interface";
import {map, Observable, startWith} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {TransportistaService} from "../../../shared/services/transportista.service";

@Component({
  selector: 'app-mantenedor-transportistas',
  templateUrl: './mantenedor-transportistas.component.html',
  styleUrls: ['./mantenedor-transportistas.component.css']
})
export class MantenedorTransportistasComponent implements OnInit {

  transportistas: Transportista[];
  transportistas$: Observable<Transportista[]>;
  formTransportistas: FormGroup;
  isEdit:boolean = false;
  transportistaSeleccionado: Transportista;
  filter = new FormControl('', { nonNullable: true });
  w: number = window.innerWidth


  constructor(private tS:TransportistaService , private modalService: NgbModal , private fb: FormBuilder) {
    this.formTransportistas = this.fb.group({
      rutTransportista: ["", [Validators.required]],
      apellido: ["", [Validators.required]],
      nombre: ["", [Validators.required]],
      contacto: ["", [Validators.required]],
      fechaDesde:["", [Validators.required]],
      fechaHasta:["", [Validators.required]] ,
      vehiculo: ["", [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.isEdit = false;
    this.getTransportistas();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-transportistas' })
  }

  agregarTransportista(){


    if(this.formTransportistas.invalid){
      Swal.fire("Ups..!","El formulario es inválido","error");
      return;
    }

    let nuevoTransportista = {} as Transportista;
    nuevoTransportista.rutTransportista = this.formTransportistas.get('rutTransportista')?.value
    nuevoTransportista.apellido = this.formTransportistas.get('apellido')?.value;
    nuevoTransportista.nombre = this.formTransportistas.get('nombre')?.value;
    nuevoTransportista.contacto = this.formTransportistas.get('contacto')?.value;
    nuevoTransportista.fechaDesde = this.formTransportistas.get('fechaDesde')?.value;
    nuevoTransportista.fechaHasta = this.formTransportistas.get('fechaHasta')?.value;
    nuevoTransportista.vehiculo = this.formTransportistas.get('vehiculo')?.value;

    if (this.isEdit){
      nuevoTransportista.rutTransportista = this.transportistaSeleccionado.rutTransportista;
      this.tS.editarTransportista(nuevoTransportista , this.transportistaSeleccionado.rutTransportista || "" ).subscribe({
        next: (res) =>{
          this.getTransportistas();
          this.isEdit = false;
          return;
        },
        error: (err) => {
          this.isEdit = false;
          return
        }
      })
    } else {
      this.tS.guardarTransportista(nuevoTransportista).subscribe({
        next: (res) =>{
          this.getTransportistas();
        },
        error: (err) => console.log(err)
      })
    }
  }


  getTransportistas(){
    this.tS.obtenerTrasportistas().subscribe( (transportistas) => {
      this.transportistas = transportistas.filter( (t) => t.rutTransportista !== "0");
      this.transportistas$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));    } );
  }

  editarTransportista( transportista: Transportista , content ){
    this.isEdit = true;
    this.transportistaSeleccionado = transportista;
    console.log(transportista)
    this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-transportista' });
    this.formTransportistas.get('rutTransportista')?.setValue( transportista.rutTransportista);
    this.formTransportistas.get('apellido')?.setValue( transportista.apellido);
    this.formTransportistas.get('nombre')?.setValue( transportista.nombre);
    this.formTransportistas.get('contacto')?.setValue( transportista.contacto);
    this.formTransportistas.get('fechaDesde')?.setValue( transportista.fechaDesde);
    this.formTransportistas.get('fechaHasta')?.setValue( transportista.fechaHasta);
    this.formTransportistas.get('vehiculo')?.setValue( transportista.vehiculo);
  }

  search(text: string): Transportista[] {
    return this.transportistas.filter((transportista) => {
      const term = text.toLowerCase();
      return (
        transportista.nombre.toLowerCase().includes(term) ||
        transportista.rutTransportista?.toLowerCase().includes(term) ||
        transportista.apellido.toLowerCase().includes(term) ||
        transportista.contacto.toLowerCase().includes(term) ||
        transportista.vehiculo.toLowerCase().includes(term) ||
        transportista.fechaDesde.toLowerCase().includes(term) ||
        transportista.fechaDesde.toLowerCase().includes(term)
      );
    });
  }

  eliminarTransportista(rut: string){

    Swal.fire({
      title: 'Seguro que deseas eliminar este transportista',
      text: "Esta acción es IRREVERSIBLE , ¿ estás seguro/a ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tS.borrarTransportista(rut).subscribe( (res) => {
          Swal.fire("Transportista Eliminado","El Transportista fue eliminado correctamente","info");
          this.getTransportistas();
        })
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.w = window.innerWidth;
  }



}

