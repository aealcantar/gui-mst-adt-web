import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DeclarationListEmitMode } from '@angular/compiler';
import { LoginComponent } from './seguridad/login/login.component';
import { SeguridadRouter } from './seguridad/seguridad.router';
import { RegistroComponent } from './seguridad/registro/registro.component';
import { NuevoAvisoMpComponent } from './trabajo-social/avisos-mp/nuevo-aviso-mp/nuevo-aviso-mp.component';
import { ConsultaAvisoMpComponent } from './trabajo-social/avisos-mp/consulta-aviso-mp/consulta-aviso-mp.component';
import { ConsultaControlArticulosComponent } from './trabajo-social/control-articulos/consulta-control-articulos/consulta-control-articulos.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recuperarpassword', component: RegistroComponent },
    { path: 'nuevo-aviso-mp', component: NuevoAvisoMpComponent },
    { path: 'consulta-aviso-mp', component: ConsultaAvisoMpComponent },
    { path: 'consulta-articulos', component: ConsultaControlArticulosComponent },
  {
    path: 'agenda-digital',
    loadChildren: () =>
      import('./agenda-digital/agenda-digital.module').then((m) => m.AgendaDigitalModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./trabajo-social/trabajo-social.module').then((m) => m.TrabajoSocialModule),
  },
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
