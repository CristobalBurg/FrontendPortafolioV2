import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './modules/Cliente/landing/landing.component';
import { Paso1Component } from './modules/Cliente/reserva/paso1/paso1.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { Paso2Component } from './modules/Cliente/reserva/paso2/paso2.component';

const routes: Routes = [
  {path: "", redirectTo: 'home', pathMatch:'full'},
  {path: 'home' , component: LandingComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'register' , component: RegisterComponent},
  {path: 'paso1' , component: Paso1Component},
  {path: 'paso2/:id' , component: Paso2Component},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
