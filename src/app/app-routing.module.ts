import { CanActivate } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// import { DeclarationListEmitMode } from '@angular/compiler';

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

import { UserbuscaComponent } from './configuracion/usuarios/userbusca/userbusca.component';
import { UserconsultaComponent } from './configuracion/usuarios/userconsulta/userconsulta.component';
import { UserguardaComponent } from './configuracion/usuarios/userguarda/userguarda.component';
import { CitabuscaComponent } from './citas/citabusca/citabusca.component';
import { CitaconsultaComponent } from './citas/citaconsulta/citaconsulta.component';
import { CitaguardaComponent } from './citas/citaguarda/citaguarda.component';
import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component';
import { DetalleControlArticulosComponent } from './control-articulos/detalle-control-articulos/detalle-control-articulos.component';
import { ConsultaControlArticulosComponent } from './control-articulos/consulta-control-articulos/consulta-control-articulos.component';
// import { ConsultaControlArticulosComponent } from './consulta-control-articulos/consulta-control-articulos.component';

import { CargaComponent } from './configuracion/catalogos/carga/carga.component';
import { CatalogosComponent } from './configuracion/catalogos/catalogos.component';
import { HorariosComponent } from './horarios/horarios.component';
import { TrabajoSocialComponent } from './trabajo-social/trabajo-social.component';

import { NuevoAvisoMpComponent } from './nuevo-aviso-mp/nuevo-aviso-mp.component';
import { ConsultaAvisoMpComponent } from './consulta-aviso-mp/consulta-aviso-mp.component';
import { ConsultaMpAdministracionComponent } from './aviso-mp/consulta-mp-administracion/consulta-mp-administracion.component';
import { UbicacionesComponent } from './configuracion/catalogos/ubicaciones/ubicaciones.component';
import { DetalleAvisoMpComponent } from './avisos-ministerio-publico/detalle-avisos-mp/detalle-avisos-mp.component';

//donacion de sangre
import { ConsultaVolantesDonacionComponent } from './volantes-donacion-sangre/consulta-volantes-donacion/consulta-volantes-donacion.component';
import { NuevoVdonacionSangreComponent } from './volantes-donacion-sangre/nuevo-vdonacion-sangre/nuevo-vdonacion-sangre.component';
import { DetalleVolantesDonacionSangreComponent } from './volantes-donacion-sangre/detalle-volantes-donacion-sangre/detalle-volantes-donacion-sangre.component';
import { NuevoCertificadoComponent } from './certificado-defuncion/nuevo-certificado/nuevo-certificado.component';
import { DetalleCertificadoComponent } from './certificado-defuncion/detalle-certificado/detalle-certificado.component';
import { ConsultaCertificadoDefuncionComponent } from './certificado-defuncion/consulta-certificado-defuncion/consulta-certificado-defuncion.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'recuperarpassword', component: RegistroComponent },
  { path: 'busqueda', component: BusquedaNssComponent, canActivate: [SeguridadRouter] },
  {
    path: 'tarjeta',
    component: AppTarjetaPresentacionComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'busquedaEspecifica',
    component: CCGrupalEspecificaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'nuevaCronica',
    component: NuevaCronicaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'cronicaGuardada',
    component: CronicaGuardadaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'consulta-cronica-grupal',
    component: ConsultaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'consulta-notas',
    component: ConsultaListaNotasTSocialComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'nueva-nota',
    component: NuevaNotaTSocialComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'detalle-nota',
    component: ConsultaNotaTSocialComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'consulta-estudios-medicos',
    component: ConsultaEstudiosMedicosComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'nuevo-estudio-social-medico',
    component: NuevoEstudioSocialMedicoComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'detalle-estudio-medico',
    component: EstudioMedicoGuardadoComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'buscauser',
    component: UserbuscaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'consultauser/:id',
    component: UserconsultaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'guardauser',
    component: UserguardaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'editauser/:id',
    component: UserguardaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'buscacita',
    component: CitabuscaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'consultacita/:id',
    component: CitaconsultaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'guardacita',
    component: CitaguardaComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'consulta-articulos',
    component: ConsultaControlArticulosComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'detalle-articulos/:id',
    component: DetalleControlArticulosComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'nuevo-articulo',
    component: NuevoControlArticulosComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'nuevo-aviso-mp',
    component: NuevoAvisoMpComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'consulta-aviso-mp',
    component: ConsultaAvisoMpComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'detalle-aviso-mp',
    component: DetalleAvisoMpComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'consulta-aviso-mp-administracion',
    component: ConsultaMpAdministracionComponent,
    // canActivate: [SeguridadRouter]
  },
  //volanteDonacion
  {
    path: 'agregar-volante-donacion-sangre',
    component: NuevoVdonacionSangreComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'consulta-volantes-donacion',
    component: ConsultaVolantesDonacionComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'detalle-volante-donacion-sangre/:id',
    component: DetalleVolantesDonacionSangreComponent,
    canActivate: [SeguridadRouter]
  },
  {
    path: 'catalogos',
    component: CatalogosComponent,
    canActivate: [SeguridadRouter],
    canActivateChild: [SeguridadRouter],
    children: [
      { path: '', redirectTo: '/catalogos/cargaCatalogos', pathMatch: 'full' },
      {
        path: 'cargaCatalogos/:idOrigen',
        component: CargaComponent,
      },
      {
        path: 'ConfiguracionUbicaciones',
        component: UbicacionesComponent,
      },
      {
        path: 'horarios/:cveUbicacion',
        component: HorariosComponent,
      },
    ],
  },
  { path: 'nuevo-certificado-defuncion', component: NuevoCertificadoComponent, canActivate: [SeguridadRouter] },
  {
    path: 'detalle-certificado-defuncion',
    component: DetalleCertificadoComponent,
    canActivate: [SeguridadRouter]
  },
  { path: 'consulta-certificado-defuncion', component: ConsultaCertificadoDefuncionComponent, canActivate: [SeguridadRouter] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule, HttpClientModule],
  providers: [SeguridadRouter],
})
export class AppRoutingModule { }
