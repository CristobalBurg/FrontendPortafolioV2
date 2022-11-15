import { Component, Input, OnInit } from '@angular/core';
import { Departamento } from '../interfaces/departamento.interface';

@Component({
  selector: 'app-card-departamentos',
  templateUrl: './card-departamentos.component.html',
  styleUrls: ['./card-departamentos.component.css']
})
export class CardDepartamentoComponent implements OnInit {


  @Input()
  departamento: Departamento ;

  constructor() { }

  ngOnInit(): void {
  }

}
