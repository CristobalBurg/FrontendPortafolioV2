import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Departamento } from 'src/app/shared/interfaces/reserva.interface';
import { DepartamentoService } from 'src/app/shared/services/departamento.service';



@Component({
  selector: 'app-admin-departamentos',
  templateUrl: './admin-departamentos.component.html',
  styleUrls: ['./admin-departamentos.component.css']
})
export class AdminDepartamentosComponent implements OnInit {

  departamentos$: Observable<Departamento[]>;
  departamentos:Departamento[];


  ngOnInit(): void {
  }

	filter = new FormControl('', { nonNullable: true });

	constructor( private dS:DepartamentoService , private route: ActivatedRoute, private router: Router) {
    this.getDeptos();

	}

  getDeptos(){
    this.dS.obtenerDepartamentos().subscribe( (x) => {
      this.departamentos = x;
      this.departamentos$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));
    })
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


  inventario( departamento: Departamento){

    const navigationExtras: NavigationExtras = {
      state: {
        departamento
      }
    };
    this.router.navigate(['inventario', departamento.idDepartamento], navigationExtras);

  }

  mantenciones( departamento: Departamento){

    const navigationExtras: NavigationExtras = {
      state: {
        departamento
      }
    };
    this.router.navigate(['mantenciones', departamento.idDepartamento], navigationExtras);

  }

}
