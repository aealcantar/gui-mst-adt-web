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
import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component'
import { DetalleControlArticulosComponent } from './control-articulos/detalle-control-articulos/detalle-control-articulos.component'
import { ConsultaControlArticulosComponent } from './control-articulos/consulta-control-articulos/consulta-control-articulos.component'
// import { ConsultaControlArticulosComponent } from './consulta-control-articulos/consulta-control-articulos.component';

import { CargaComponent } from './configuracion/catalogos/carga/carga.component';
import { CatalogosComponent } from './configuracion/catalogos/catalogos.component';
import { HorariosComponent } from './horarios/horarios.component';
import { TrabajoSocialComponent } from './trabajo-social/trabajo-social.component';

import { NuevoAvisoMpComponent } from './nuevo-aviso-mp/nuevo-aviso-mp.component';
import { ConsultaAvisoMpComponent } from './consulta-aviso-mp/consulta-aviso-mp.component';
import { UbicacionesComponent } from './configuracion/catalogos/ubicaciones/ubicaciones.component';


//donacion de sangre 
import { ConsultaVolantesDonacionComponent } from './volantes-donacion-sangre/consulta-volantes-donacion/consulta-volantes-donacion.component';  
import { NuevoVdonacionSangreComponent } from './volantes-donacion-sangre/nuevo-vdonacion-sangre/nuevo-vdonacion-sangre.component'; 
import { DetalleVolantesDonacionSangreComponent } from './volantes-donacion-sangre/detalle-volantes-donacion-sangre/detalle-volantes-donacion-sangre.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recuperarpassword', component: RegistroComponent },
  { path: 'busqueda', component: BusquedaNssComponent },
  { path: 'tarjeta', component: AppTarjetaPresentacionComponent },
  { path: 'busquedaEspecifica', component: CCGrupalEspecificaComponent},
  { path: 'nuevaCronica', component: NuevaCronicaComponent},
  { path: 'cronicaGuardada', component: CronicaGuardadaComponent},
  { path: 'consulta-cronica-grupal', component: ConsultaComponent},
  { path: 'consulta-notas', component: ConsultaListaNotasTSocialComponent},
  { path: 'nueva-nota', component: NuevaNotaTSocialComponent},
  { path: 'detalle-nota', component: ConsultaNotaTSocialComponent},
  { path: 'consulta-estudios-medicos', component: ConsultaEstudiosMedicosComponent },
  { path: 'nuevo-estudio-social-medico', component: NuevoEstudioSocialMedicoComponent },
  { path: 'detalle-estudio-medico', component: EstudioMedicoGuardadoComponent},
  { path: 'buscauser', component: UserbuscaComponent},
 // { path: 'consulta-volantes-donacion', component: ConsultaVolantesDonacionComponent },
  { path: 'consultauser/:id', component: UserconsultaComponent},
  { path: 'guardauser', component: UserguardaComponent},
  { path: 'editauser/:id', component: UserguardaComponent},
  { path: 'buscacita', component: CitabuscaComponent},
  { path: 'consultacita/:id', component: CitaconsultaComponent},
  { path: 'guardacita', component: CitaguardaComponent},
  { path: 'consulta-articulos', component: ConsultaControlArticulosComponent},
  { path: 'detalle-articulos/:id', component: DetalleControlArticulosComponent},
  { path: 'nuevo-articulo', component: NuevoControlArticulosComponent},
 // { path: 'nvdonacion-sangre', component: NuevoVdonacionSangreComponent },
  { path: 'nuevo-aviso-mp', component: NuevoAvisoMpComponent },
  { path: 'consulta-aviso-mp', component: ConsultaAvisoMpComponent },
    //volanteDonacion
    { path: 'agregar-volante-donacion-sangre', component: NuevoVdonacionSangreComponent },
    { path: 'consulta-volantes-donacion', component: ConsultaVolantesDonacionComponent },
    { path: 'detalle-volante-donacion-sangre/:id', component: DetalleVolantesDonacionSangreComponent },
  //{ path: '**', redirectTo: 'login' },
  {
    path: 'catalogos', component: CatalogosComponent, children: [
      { path: '', redirectTo: '/catalogos/cargaCatalogos', pathMatch: 'full' },
      { path: 'cargaCatalogos', component: CargaComponent },
      { path: 'ConfiguracionUbicaciones', component: UbicacionesComponent },
      { path: 'horarios/:cveUbicacion', component: HorariosComponent }
    ]
  }
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
