import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, startWith } from 'rxjs';
import { Departamento, InventarioProducto, Producto } from 'src/app/shared/interfaces/reserva.interface';
import { DepartamentoService } from 'src/app/shared/services/departamento.service';
import { ProductoService } from 'src/app/shared/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  departamento: Departamento;
  listadoProductos: InventarioProducto[];
  listadoProductos$: Observable<InventarioProducto[]>;
  filter = new FormControl('', { nonNullable: true });
  maestroProductos: Producto[];
  formAddInventario: FormGroup;
  w: number = window.innerWidth


  constructor(
    private router: Router,
    private dS: DepartamentoService,
    private activatedRoute: ActivatedRoute,
    private modalService : NgbModal,
    private pS: ProductoService,
    private fb: FormBuilder
    ) {
    this.formAddInventario = this.fb.group({
      producto:  [1, [Validators.required]],
      cantidad: [1, [Validators.required]]
    })
    this.departamento = this.router.getCurrentNavigation()?.extras.state?.departamento;
    if (!this.departamento) {
      this.activatedRoute.params.subscribe(params => {
        let id = params['id'];
        this.getDepartamentoById(id);

      });
    } else {
      this.listadoProductos = this.departamento.inventarioProductos;
      this.listadoProductos$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));
    }

  }

  ngOnInit(): void {
    this.getProductos();

  }

  search(text: string): InventarioProducto[] {
    return this.listadoProductos.filter((ip) => {
      const term = text.toLowerCase();
      return (
        ip.producto.nombre.toLowerCase().includes(term)

      );
    });
  }

  open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-productos' })
	}


  getProductos(){
    this.pS.getProductos().subscribe( (p) => {
      this.maestroProductos = p;
      console.log(p)
    })
  }

  agregarProductoInventario(){
    let newInventarioProducto = {} as InventarioProducto;
    newInventarioProducto.cantidad = this.formAddInventario.get('cantidad')?.value;
    newInventarioProducto.producto = this.maestroProductos.find( (x) => x.idProducto == Number(this.formAddInventario.get('producto')?.value)) as Producto;
    let idInventarioProducto = this.listadoProductos.find( (x) => x.producto.idProducto === Number(this.formAddInventario.get('producto')?.value) )?.idInventarioProducto || 0;
    if(idInventarioProducto !== 0){
      newInventarioProducto = { idInventarioProducto  , ... newInventarioProducto }
    }
    this.listadoProductos = this.listadoProductos.filter( (lp) => lp.producto.idProducto != Number(this.formAddInventario.get('producto')?.value));
    this.listadoProductos.push(newInventarioProducto);

    this.departamento.inventarioProductos = this.listadoProductos;

    this.dS.editarDepartamento( this.departamento , Number(this.departamento.idDepartamento)).subscribe({
      next: (n) => {
        this.getDepartamentoById(this.departamento.idDepartamento);
        Swal.fire("Inventario Actualizado","se ha actualizado correctamente el inventario del departamento id: " + this.departamento.idDepartamento , "success");
        this.modalService.dismissAll()
      }
    })
  } 
  borrarInventarioProducto( id:number){
    this.pS.deleteInvetarioProductoById(id).subscribe( (x) => {
      Swal.fire("Producto Eliminado","El Producto fue eliminado del inventario correctamente","success");
      this.getDepartamentoById(this.departamento.idDepartamento);
    })
  }


  getDepartamentoById(id){
    this.dS.obtenerDepartamentoById(id).subscribe((x: Departamento) => {
      this.departamento = x;
      this.listadoProductos = x.inventarioProductos;
      this.listadoProductos$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));
    })
  }
  
  editarDepartamento(){
    this.dS.editarDepartamento( this.departamento , Number(this.departamento.idDepartamento)).subscribe({
      next: (n) => {
        this.getDepartamentoById(this.departamento.idDepartamento);
        Swal.fire("Inventario Acutalizado","se ha actualizado correctamente el inventario del departamento id: " + this.departamento.idDepartamento , "success");
        this.modalService.dismissAll()
      }
    })
  }



}
