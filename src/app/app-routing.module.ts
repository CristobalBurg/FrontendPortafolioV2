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
import { MantenedorProductosComponent } from './modules/admin/mantenedor-productos/mantenedor-productos.component';
import { MantenedorTransportistasComponent } from './modules/admin/mantenedor-transportistas/mantenedor-transportistas.component';
import { AdminReportesComponent } from './modules/admin/admin-reportes/admin-reportes.component';
import { ErrorLandingComponent } from './shared/error-landing/error-landing.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { TestimoniosComponent } from './modules/Cliente/testimonios/testimonios.component';
import { NotFoundLandingComponent } from './shared/not-found-landing/not-found-landing.component';
import { ContactanosComponent } from './modules/Cliente/contactanos/contactanos.component';
import { PoliticasComponent } from './modules/Cliente/politicas/politicas.component';
import { AcercaDeComponent } from './modules/Cliente/acerca-de/acerca-de.component';
import { TerminosComponent } from './modules/Cliente/terminos/terminos.component';





const routes: Routes = [
  {path: "", redirectTo: 'home', pathMatch:'full'},
  {path: 'home' , component: LandingComponent , },
  {path: 'login' , component: LoginComponent},
  {path: 'register' , component: RegisterComponent},
  {path: 'paso1' , component: Paso1Component , canActivate:[AuthGuard]},
  {path: 'paso2/:id' , component: Paso2Component ,  canActivate:[AuthGuard]},
  {path: 'paso3' , component: Paso3Component ,  canActivate:[AuthGuard]},
  {path: 'paso4' , component: Paso4Component ,  canActivate:[AuthGuard]},
  {path: 'admin-home' , component: AdminHomeComponent, canActivate:[AuthGuard, AdminGuard]},
  {path: 'admin-reservas' , component: ReservasComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'admin-departamentos', component: AdminDepartamentosComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'inventario/:id', component: InventarioComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'mantenciones/:id', component: MantencionesComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'mantenedores', component: AdminMantenedoresComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'mantenedor-departamento', component: MantenedorDepartamentosComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'mantenedor-usuarios', component: MantenedorUsuariosComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'mantenedor-mantenciones', component: MantenedorMantencionesComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'mantenedor-serviciosextra', component: MantenedorServiciosExtraComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'mantenedor-transportistas', component: MantenedorTransportistasComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'mantenedor-productos', component: MantenedorProductosComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'admin-reportes', component: AdminReportesComponent ,  canActivate:[AuthGuard,AdminGuard]},
  {path: 'error', component: ErrorLandingComponent},
  {path: 'testimonios' , component: TestimoniosComponent , },
  {path: 'contactanos' , component: ContactanosComponent , },
  {path: 'politicas' , component: PoliticasComponent , },
  {path: 'acerca-de' , component: AcercaDeComponent , },
  {path: 'terminos' , component: TerminosComponent , },
  {path: '**', component: NotFoundLandingComponent },

  




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
