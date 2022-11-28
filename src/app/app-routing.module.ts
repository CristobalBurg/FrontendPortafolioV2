import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './modules/Cliente/landing/landing.component';
import { Paso1Component } from './modules/Cliente/reserva/paso1/paso1.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { Paso2Component } from './modules/Cliente/reserva/paso2/paso2.component';
import { Paso3Component } from './modules/Cliente/reserva/paso3/paso3.component';
import { Paso4Component } from './modules/Cliente/reserva/paso4/paso4.component';
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

const routes: Routes = [
  {path: "", redirectTo: 'home', pathMatch:'full'},
  {path: 'home' , component: LandingComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'register' , component: RegisterComponent},
  {path: 'paso1' , component: Paso1Component},
  {path: 'paso2/:id' , component: Paso2Component},
  {path: 'paso3' , component: Paso3Component},
  {path: 'paso4' , component: Paso4Component},
  {path: 'admin-home' , component: AdminHomeComponent},
  {path: 'admin-reservas' , component: ReservasComponent},
  {path: 'admin-departamentos', component: AdminDepartamentosComponent},
  {path: 'inventario/:id', component: InventarioComponent},
  {path: 'mantenciones/:id', component: MantencionesComponent},
  {path: 'mantenedores', component: AdminMantenedoresComponent},
  {path: 'mantenedor-departamento', component: MantenedorDepartamentosComponent},
  {path: 'mantenedor-usuarios', component: MantenedorUsuariosComponent},
  {path: 'mantenedor-mantenciones', component: MantenedorMantencionesComponent},
  {path: 'mantenedor-serviciosextra', component: MantenedorServiciosExtraComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
