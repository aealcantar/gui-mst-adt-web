import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DeclarationListEmitMode } from '@angular/compiler';
import { LoginComponent } from './seguridad/login/login.component';
import { SeguridadRouter } from './seguridad/seguridad.router';
import { RegistroComponent } from './seguridad/registro/registro.component';
// import { NuevoEstudioSocialMedicoComponent } from './nuevo-estudio-social-medico/nuevo-estudio-social-medico.component';
// import { ConsultaEstudiosMedicosComponent } from './consulta-estudios-medicos/consulta-estudios-medicos.component';
// import { EstudioMedicoGuardadoComponent } from './estudio-medico-guardado/estudio-medico-guardado.component';
// import { ConsultaVolantesDonacionComponent } from './trabajo-social/volantes-donacion-sangre/consulta-volantes-donacion/consulta-volantes-donacion.component';
// import { NuevoVdonacionSangreComponent } from './trabajo-social/volantes-donacion-sangre/nuevo-vdonacion-sangre/nuevo-vdonacion-sangre.component';
// import { ConsultaControlArticulosComponent } from './consulta-control-articulos/consulta-control-articulos.component';
import { NuevoAvisoMpComponent } from './trabajo-social/avisos-mp/nuevo-aviso-mp/nuevo-aviso-mp.component';
import { ConsultaAvisoMpComponent } from './trabajo-social/avisos-mp/consulta-aviso-mp/consulta-aviso-mp.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recuperarpassword', component: RegistroComponent },
  // { path: 'consulta-estudios-medicos', component: ConsultaEstudiosMedicosComponent },
  // { path: 'nuevo-estudio-social-medico', component: NuevoEstudioSocialMedicoComponent },
  // { path: 'detalle-estudio-medico', component: EstudioMedicoGuardadoComponent },
  // { path: 'consulta-articulos', component: ConsultaControlArticulosComponent },
  // { path: 'consulta-volantes-donacion', component: ConsultaVolantesDonacionComponent },
  // { path: 'nvdonacion-sangre', component: NuevoVdonacionSangreComponent },
    { path: 'nuevo-aviso-mp', component: NuevoAvisoMpComponent },
    { path: 'consulta-aviso-mp', component: ConsultaAvisoMpComponent },
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
