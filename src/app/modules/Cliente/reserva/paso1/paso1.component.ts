import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/shared/interfaces/departamento.interface';
import { DepartamentoService } from 'src/app/shared/services/departamento.service';

@Component({
  selector: 'app-paso1',
  templateUrl: './paso1.component.html',
  styleUrls: ['./paso1.component.css']
})
export class Paso1Component implements OnInit {

  listadoDepartamentos: Departamento[];

  constructor(private dService: DepartamentoService) { }

  ngOnInit(): void {
    this.dService.obtenerDepartamentos().subscribe( (x) => {
      console.log(x)
      this.listadoDepartamentos = x;
    })
  }

}
