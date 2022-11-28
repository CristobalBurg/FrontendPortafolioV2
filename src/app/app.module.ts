import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LandingComponent } from './modules/Cliente/landing/landing.component';
import { CardDepartamentoComponent } from './shared/card-departamento/card-departamentos.component';
import { Paso1Component } from './modules/Cliente/reserva/paso1/paso1.component';
import { Paso2Component } from './modules/Cliente/reserva/paso2/paso2.component';
import { Paso3Component } from './modules/Cliente/reserva/paso3/paso3.component';
import { DepartamentoService } from './shared/services/departamento.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './modules/auth/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { authInterceptorProviders } from './shared/interceptors/auth.interceptor';
import { RegisterComponent } from './modules/auth/register/register.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdDatepickerRange } from './shared/datepicker-range/datepicker-range.component';
import { CardServicioExtraComponent } from './shared/card-servicio-extra/card-servicio-extra.component';
import { Paso4Component } from './modules/Cliente/reserva/paso4/paso4.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminHomeComponent } from './modules/admin/admin-home/admin-home.component';
import { ReservasComponent } from './modules/admin/reservas/reservas.component';
import { AdminDepartamentosComponent } from './modules/admin/admin-departamentos/admin-departamentos.component';
import { InventarioComponent } from './modules/admin/admin-departamentos/inventario/inventario.component';
import { MantencionesComponent } from './modules/admin/admin-departamentos/mantenciones/mantenciones.component';
import { AdminMantenedoresComponent } from './modules/admin/admin-mantenedores/admin-mantenedores.component';
import { MantenedorDepartamentosComponent } from './modules/admin/mantenedor-departamentos/mantenedor-departamentos.component';
import { MantenedorUsuariosComponent } from './modules/admin/mantenedor-usuarios/mantenedor-usuarios.component';
import { MantenedorMantencionesComponent } from './modules/admin/mantenedor-mantenciones/mantenedor-mantenciones.component';
import { MantenedorServiciosExtraComponent } from './modules/admin/mantenedor-serviciosextra/mantenedor-serviciosextra.component';
import { MantenedorTransportistasComponent } from './modules/admin/mantenedor-transportistas/mantenedor-transportistas.component';
import { MantenedorProductosComponent } from './modules/admin/mantenedor-productos/mantenedor-productos.component';
import { AdminReportesComponent } from './modules/admin/admin-reportes/admin-reportes.component';
import { ErrorLandingComponent } from './shared/error-landing/error-landing.component';
import { NotFoundLandingComponent } from './shared/not-found-landing/not-found-landing.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LandingComponent,
    CardDepartamentoComponent,
    Paso1Component,
    Paso2Component,
    Paso3Component,
    LoginComponent,
    RegisterComponent,
    NgbdDatepickerRange,
    CardServicioExtraComponent,
    Paso4Component,
    AdminHomeComponent,
    ReservasComponent,
    AdminDepartamentosComponent,
    InventarioComponent,
    MantencionesComponent,
    AdminMantenedoresComponent,
    MantenedorDepartamentosComponent,
    MantenedorUsuariosComponent,
    MantenedorMantencionesComponent,
    MantenedorServiciosExtraComponent,
    MantenedorTransportistasComponent,
    MantenedorProductosComponent,
    AdminReportesComponent,
    ErrorLandingComponent,
    NotFoundLandingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),

  ],
  providers: [
    DepartamentoService,
    authInterceptorProviders
  ],
  exports:[NgbdDatepickerRange],
  bootstrap: [AppComponent,]
})
export class AppModule { }
