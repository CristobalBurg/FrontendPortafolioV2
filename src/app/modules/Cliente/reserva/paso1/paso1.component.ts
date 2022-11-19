import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/shared/interfaces/reserva.interface';
import { DepartamentoService } from 'src/app/shared/services/departamento.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ReservaService } from 'src/app/shared/services/reserva.service';


@Component({
  selector: 'app-paso1',
  templateUrl: './paso1.component.html',
  styleUrls: ['./paso1.component.css']
})
export class Paso1Component implements OnInit {

  listadoDepartamentos: Departamento[];

  constructor(private dService: DepartamentoService , private rS: ReservaService) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.rS.removeLocalReserva();

    this.dService.obtenerDepartamentos().subscribe( (x) => {
      console.log(x)
      this.listadoDepartamentos = x;
    })
  }

}
