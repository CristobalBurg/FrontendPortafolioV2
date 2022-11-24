import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Departamento } from '../interfaces/reserva.interface';

@Component({
  selector: 'app-card-departamentos',
  templateUrl: './card-departamentos.component.html',
  styleUrls: ['./card-departamentos.component.css']
})
export class CardDepartamentoComponent implements OnInit {


  @Input()
  departamento: Departamento ;  
  @Input()
  verFechas: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goPaso2( departamento: Departamento){

    const navigationExtras: NavigationExtras = {
      state: {
        departamento
      }
    };
    this.router.navigate(['paso2', departamento.idDepartamento], navigationExtras);

  }

}
