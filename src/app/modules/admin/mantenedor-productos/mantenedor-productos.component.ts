import {Component, HostListener, OnInit} from '@angular/core';
import {Producto} from "../../../shared/interfaces/reserva.interface";
import {map, Observable, startWith} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {ProductoService} from "../../../shared/services/producto.service";

@Component({
  selector: 'app-mantenedor-productos',
  templateUrl: './mantenedor-productos.component.html',
  styleUrls: ['./mantenedor-productos.component.css']
})
export class MantenedorProductosComponent implements OnInit {

  productos: Producto[];
  productos$: Observable<Producto[]>;
  formProductos: FormGroup;
  isEdit:boolean = false;
  productoSeleccionado: Producto;
  filter = new FormControl('', { nonNullable: true });
  w: number = window.innerWidth


  constructor(private pS:ProductoService , private modalService: NgbModal , private fb: FormBuilder) {
    this.formProductos = this.fb.group({
      nombre: ["", [Validators.required]],
      valor: [1, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.isEdit = false;
    this.getProductos();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-productos' })
  }

  agregarProducto(){


    if(this.formProductos.invalid){
      Swal.fire("Ups..!","El formulario es inválido","error");
      return;
    }

    let nuevoProducto = {} as Producto;
    nuevoProducto.nombre = this.formProductos.get('nombre')?.value;
    nuevoProducto.valor = this.formProductos.get('valor')?.value;

    if (this.isEdit){
      nuevoProducto.idProducto = this.productoSeleccionado.idProducto;
      this.pS.editarProducto(nuevoProducto , this.productoSeleccionado.idProducto || 0 ).subscribe({
        next: (res) =>{
          this.getProductos();
          this.isEdit = false;
          return;
        },
        error: (err) => {
          this.isEdit = false;
          return
        }
      })
    } else {
      this.pS.guardarProducto(nuevoProducto).subscribe({
        next: (res) =>{
          this.getProductos();
        },
        error: (err) => console.log(err)
      })
    }
  }


  getProductos(){
    this.pS.getProductos().subscribe( (productos) => {
      this.productos = productos;
      this.productos$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));    } );
  }

  editarProducto( producto: Producto , content ){
    this.isEdit = true;
    this.productoSeleccionado = producto;
    console.log(producto)
    this.modalService.open(content, { ariaLabelledBy: 'modal-mantenedor-producto' });
    this.formProductos.get('nombre')?.setValue( producto.nombre);
    this.formProductos.get('valor')?.setValue( producto.valor);
  }

  search(text: string): Producto[] {
    return this.productos.filter((prod) => {
      const term = text.toLowerCase();
      return (
        prod.nombre.toLowerCase().includes(term) || 
        prod.idProducto?.toString().includes(term)
      );
    });
  }

  eliminarProducto(id: number){

    Swal.fire({
      title: 'Seguro que deseas eliminar este producto',
      text: "Esta acción es IRREVERSIBLE , ¿ estás seguro/a ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pS.borrarProducto(id).subscribe( (res) => {
          Swal.fire("Producto Eliminado","El Producto fue eliminado correctamente","info");
          this.getProductos();
        })
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.w = window.innerWidth;
  }



}

