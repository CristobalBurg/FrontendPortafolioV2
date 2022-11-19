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
import { Paso4Component } from './modules/reserva/paso4/paso4.component';
import { NgxSpinnerModule } from 'ngx-spinner';


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
    Paso4Component
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
