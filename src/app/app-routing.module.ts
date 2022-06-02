import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DeclarationListEmitMode } from '@angular/compiler';
import { BusquedaNssComponent } from './busqueda-nss/busqueda-nss.component';
import { AppTarjetaPresentacionComponent } from './app-tarjeta-presentacion/app-tarjeta-presentacion.component';
import { NuevaCronicaComponent } from './cronica-grupal/nueva-cronica/nueva-cronica.component';
import { CCGrupalEspecificaComponent } from './cronica-grupal/c-cgrupal-especifica/c-cgrupal-especifica.component';
import { CronicaGuardadaComponent } from './cronica-grupal/cronica-guardada/cronica-guardada.component';
import { ConsultaComponent } from './cronicaGrupal/consulta/consulta.component';
import { LoginComponent } from './seguridad/login/login.component';
import { SeguridadRouter } from './seguridad/seguridad.router';
import { RegistroComponent } from './seguridad/registro/registro.component';
import {NuevaNotaTSocialComponent} from './nueva-nota-tsocial/nueva-nota-tsocial.component';
import { ConsultaListaNotasTSocialComponent } from './consulta-lista-notas-tsocial/consulta-lista-notas-tsocial.component';



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recuperarpassword', component: RegistroComponent },
  { path: 'busqueda', component: BusquedaNssComponent, canActivate: [SeguridadRouter] },
  { path: 'tarjeta', component: AppTarjetaPresentacionComponent, canActivate: [SeguridadRouter] },
  { path: 'busquedaEspecifica', component: CCGrupalEspecificaComponent, canActivate: [SeguridadRouter] },
  { path: 'nuevaCronica', component: NuevaCronicaComponent, canActivate: [SeguridadRouter] },
  { path: 'cronicaGuardada', component: CronicaGuardadaComponent, canActivate: [SeguridadRouter] },
  { path: 'consulta-cronica-grupal', component: ConsultaComponent, canActivate: [SeguridadRouter] },
  { path: 'nueva-nota', component:NuevaNotaTSocialComponent, canActivate: [SeguridadRouter]},
  { path: 'consulta-notas', component:ConsultaListaNotasTSocialComponent, canActivate: [SeguridadRouter]},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    HttpClientModule
  ],
  exports: [
    RouterModule,
    HttpClientModule
  ],
  providers: [SeguridadRouter]
})
export class AppRoutingModule { }
