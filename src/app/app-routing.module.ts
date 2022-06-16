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
import { NuevaNotaTSocialComponent } from './nueva-nota-tsocial/nueva-nota-tsocial.component';
import { ConsultaListaNotasTSocialComponent } from './consulta-lista-notas-tsocial/consulta-lista-notas-tsocial.component';
import { NuevoEstudioSocialMedicoComponent } from './nuevo-estudio-social-medico/nuevo-estudio-social-medico.component';
import { ConsultaNotaTSocialComponent } from './consulta-nota-tsocial/consulta-nota-tsocial.component';
import { ConsultaEstudiosMedicosComponent } from './consulta-estudios-medicos/consulta-estudios-medicos.component';
import { EstudioMedicoGuardadoComponent } from './estudio-medico-guardado/estudio-medico-guardado.component';
import { ConsultaVolantesDonacionComponent } from './consulta-volantes-donacion/consulta-volantes-donacion.component';

import { UserbuscaComponent } from './configuracion/usuarios/userbusca/userbusca.component';
import { UserconsultaComponent } from './configuracion/usuarios/userconsulta/userconsulta.component';
import { UserguardaComponent } from './configuracion/usuarios/userguarda/userguarda.component';
import { CitabuscaComponent } from './citas/citabusca/citabusca.component';
import { CitaconsultaComponent } from './citas/citaconsulta/citaconsulta.component';
import { CitaguardaComponent } from './citas/citaguarda/citaguarda.component';
import { ConsultaControlArticulosComponent } from './consulta-control-articulos/consulta-control-articulos.component';


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
  { path: 'consulta-notas', component: ConsultaListaNotasTSocialComponent, canActivate: [SeguridadRouter] },
  { path: 'nueva-nota', component: NuevaNotaTSocialComponent, canActivate: [SeguridadRouter] },
  { path: 'detalle-nota', component: ConsultaNotaTSocialComponent, canActivate: [SeguridadRouter] },
  { path: 'consulta-estudios-medicos', component: ConsultaEstudiosMedicosComponent, canActivate: [SeguridadRouter] },
  { path: 'nuevo-estudio-social-medico', component: NuevoEstudioSocialMedicoComponent, canActivate: [SeguridadRouter] },
  { path: 'detalle-estudio-medico', component: EstudioMedicoGuardadoComponent, canActivate: [SeguridadRouter] },
  { path: 'buscauser', component: UserbuscaComponent, canActivate: [SeguridadRouter] },
  { path: 'consulta-volantes-donacion', component: ConsultaVolantesDonacionComponent, canActivate: [SeguridadRouter] },
  { path: 'consultauser/:id', component: UserconsultaComponent, canActivate: [SeguridadRouter] },
  { path: 'guardauser', component: UserguardaComponent, canActivate: [SeguridadRouter] },
  { path: 'editauser/:id', component: UserguardaComponent, canActivate: [SeguridadRouter] },
  { path: 'buscacita', component: CitabuscaComponent, canActivate: [SeguridadRouter] },
  { path: 'consultacita/:id', component: CitaconsultaComponent, canActivate: [SeguridadRouter] },
  { path: 'guardacita', component: CitaguardaComponent, canActivate: [SeguridadRouter] },
  { path: 'consulta-articulos', component: ConsultaControlArticulosComponent, canActivate: [SeguridadRouter]  },
  {path:'agenda-digital',
    loadChildren:()=>
    import('./agenda-digital/agenda-digital.module').then((m)=> m.AgendaDigitalModule),
  },
  {path:'trabajo-social',
  loadChildren:()=>
  import('./trabajo-social/trabajo-social.module').then((m)=> m.TrabajoSocialModule),
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
