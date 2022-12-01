import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, tap } from 'rxjs';
import { CheckIn, Checkout, Multa, Reserva } from 'src/app/shared/interfaces/reserva.interface';
import { ReservaService } from 'src/app/shared/services/reserva.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],

})
export class ReservasComponent implements OnInit {

  reservas$: Observable<Reserva[]>;
	filter = new FormControl('', { nonNullable: true });
  reservas:Reserva[];
  listadoCheckins: CheckIn[];
  listadoCheckouts: Checkout[];
  formMulta: FormGroup;
  selectedCheckin : CheckIn;

  constructor(private rS:ReservaService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private fb: FormBuilder) {
      this.formMulta = this.fb.group({
        descripcion:  ['Sin Observaciones', [Validators.required]],
        valor: [0, [Validators.required]]
      })
    this.getReservas();
    this.getCheckins();
    this.getCheckouts();


   }

  ngOnInit(): void {

  }

  generarCheckin( reserva:Reserva ){
    let checkIn = {} as CheckIn;
    checkIn.reserva  = reserva;
    console.log(reserva)
    checkIn.firmado = false;
    this.rS.crearCheckin(checkIn).subscribe( (x) => {
      Swal.fire("TODO OK","Checkin registrado correctamente , haz click denuevo para imprimirlo","success")
      console.log(x)
      this.getReservas()
      this.getCheckins();
    })
  }

  imprimirCheckin( idReserva: number) {
    this.spinner.show()
    let selectedCheckin = this.listadoCheckins.find( (ci) =>  ci.reserva.idReserva == idReserva);
    console.log("SC",selectedCheckin)
    this.rS.imprimirCheckin(selectedCheckin?.idCheckIn || 0)
    .subscribe( {
      next: (response) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(new Blob([response.body as Blob], { type: response?.body?.type }));
        let fileName = "checkin_" + selectedCheckin?.idCheckIn + "_" + selectedCheckin?.reserva.usuario.nombre + ".pdf"
        downloadLink.download = fileName as string;
        downloadLink.click();
        this.spinner.hide() 
        Swal.fire("Todo bien!","Acta de check In generada correctamente" , "success")
      },
      error: (err) => {
        this.spinner.hide();
        Swal.fire("Upss..!","No se puede imprimir el acta de Checkin", "error")}
    } )

  }

  imprimirCheckout( idReserva: number) {

    this.spinner.show()
    let selectedCheckout = this.listadoCheckouts.find( (co) =>  co.checkin.reserva.idReserva == idReserva);
    console.log(selectedCheckout)
    if (!selectedCheckout?.checkin.firmado){
      Swal.fire("Ups..!","Primero debes generar un checkin para generar un checkout","error");
      this.spinner.hide()
      return;
    }
    this.rS.imprimirCheckout(selectedCheckout?.checkin.idCheckIn || 0)
    .subscribe( {
      next: (response) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(new Blob([response.body as Blob], { type: response?.body?.type }));
        let fileName = "checkout_" + selectedCheckout?.checkin.idCheckIn + "_" + selectedCheckout?.checkin.reserva.usuario.nombre + ".pdf"
        downloadLink.download = fileName as string;
        downloadLink.click();
        this.spinner.hide() 
        Swal.fire("Todo bien!","Acta de Checkout generada correctamente" , "success")
      },
      error: (err) => {
        this.spinner.hide();
        Swal.fire("Upss..!","No se puede imprimir el acta de Checkout", "error")}
    } )

  }

  search(text: string): Reserva[] {
    return this.reservas.filter((reserva) => {
      const term = text.toLowerCase();
      return (
        reserva.usuario.nombre.toLowerCase().includes(term) ||
        reserva.usuario.apellido.toLowerCase().includes(term) ||
        reserva.departamento.direccion.toLowerCase().includes(term) ||
        reserva.fechaEntrega.toLowerCase().includes(term) ||
        reserva.fechaEntrega.toLowerCase().includes(term)
      );
    });
  }


  getReservas(){
    this.rS.getReservas().subscribe( (x) => {
      this.reservas = x;
      console.log(x);
      this.reservas$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)));
    })
  }

  getCheckins(){
    this.rS.getCheckins().subscribe( (x) => {
      this.listadoCheckins = x ;
      console.log(x)
    })

  }

  getCheckouts(){
    this.rS.getCheckouts().subscribe( (x) => {
      this.listadoCheckouts = x ;
      console.log(x)
    })
  }

  open(content , idReserva: number) {
    this.selectedCheckin = this.listadoCheckins.find( (ci) =>  ci.reserva.idReserva == idReserva) as CheckIn;
    if(!this.selectedCheckin){ 
      Swal.fire("Error", "Debes tener el Checkin generado para generar el checkout","error");
      return;
    }
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
	}

  crearCheckout(){
    if(this.formMulta.invalid){
      Swal.fire("Ups..!","Debes agregar la descripción y el valor de la multa , puedes dejar el valor en 0 si es que no hubo problemas", "info")
      return;
    }
    let checkout = {} as Checkout;
    let multa = {} as Multa;
    multa.descripcion =  this.formMulta.get('descripcion')?.value;
    multa.valor = this.formMulta.get('valor')?.value
    checkout.checkin = this.selectedCheckin
    checkout.multa = multa;
    checkout.firmado = true;


    this.rS.crearCheckout(checkout).subscribe({
      next: (x) => {
        Swal.fire("Checkout Creado","El checkout fue creado , una vez lo imprimas se simulara su firma y posible pago" ,"success");
        this.getCheckouts();
        this.getReservas();
        this.modalService.dismissAll()

      },
      error: (err) => Swal.fire("Error", "No se ha podido genera el Checkout","error")
    })

  }


  cancelarReserva(id){

    Swal.fire({
      title: 'Seguro que deseas Cancelar esta reserva?',
      text: "Esta acción es IRREVERSIBLE , ¿ estás seguro/a ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rS.cancelarReserva(id).subscribe( (res) => {
          Swal.fire("Reserva Cancelada","La reserva fue cancelada correctamente","info");
          this.getReservas();
        })
      }
    })

  }


}
