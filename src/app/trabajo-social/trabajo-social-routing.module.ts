import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component';
import { DetalleControlArticulosComponent } from './control-articulos/detalle-control-articulos/detalle-control-articulos.component';
import { ListaNotasComponent } from './notas-trabajo-social/lista-notas/lista-notas.component';
import { NuevaNotaComponent } from './notas-trabajo-social/nueva-nota/nueva-nota.component';
import { ConsultaNotaComponent } from './notas-trabajo-social/consulta-nota/consulta-nota.component';
import { CCGrupalEspecificaComponent } from './cronica-grupal/consulta-cronica-grupal/c-cgrupal-especifica.component';
import { NuevaCronicaGrupalComponent } from './cronica-grupal/nueva-cronica-grupal/nueva-cronica-grupal.component';
import { CronicaGuardadaComponent } from './cronica-grupal/detalle-nueva-cronica-grupal/cronica-guardada.component';
import { ListaCronicaGrupalComponent } from './cronica-grupal/lista-cronica-grupal/lista-cronica-grupal.component';

import { ConsultaEstudiosMedicosComponent } from './estudio-social-medico/lista-estudios/consulta-estudios-medicos.component';
import { NuevoEstudioSocialMedicoComponent } from './estudio-social-medico/nuevo-estudio/nuevo-estudio-social-medico.component';
import { EstudioMedicoGuardadoComponent } from './estudio-social-medico/consulta-estudio/estudio-medico-guardado.component';
import { BusquedaNssComponent } from './busqueda-nss/busqueda-nss.component';
import { AppTarjetaPresentacionComponent } from '../shared-modules/app-tarjeta-presentacion/app-tarjeta-presentacion.component';
import { ConsultaControlArticulosComponent } from './control-articulos/consulta-control-articulos/consulta-control-articulos.component';

import { ConsultaVolantesDonacionComponent } from './volantes-donacion-sangre/consulta-volantes-donacion/consulta-volantes-donacion.component';
import { NuevoVdonacionSangreComponent } from './volantes-donacion-sangre/nuevo-vdonacion-sangre/nuevo-vdonacion-sangre.component';

import { NuevoAvisoMpComponent } from './avisos-mp/nuevo-aviso-mp/nuevo-aviso-mp.component';
import { ConsultaAvisoMpComponent } from './avisos-mp/consulta-aviso-mp/consulta-aviso-mp.component';

import { ConsultaCertificadosDefuncionComponent } from './certificados-defuncion/consulta-certificados-defuncion/consulta-certificados-defuncion.component';
import { NuevoCertificadoDefuncionComponent } from './certificados-defuncion/nuevo-certificado-defuncion/nuevo-certificado-defuncion.component';

//las rutas serian
// :4200/trabajo-social/nuevo-control-articulos
const routes: Routes = [
  // {path:'',
  // children:[
  // {
  //   path:"control-articulos",
  //   loadChildren:()=>
  //   import('./aplicativos/control-articulos/control-articulos.module').then((m)=> m.ControlArticulosModule),
  // }]
  // },

  { path: 'nuevo-control-articulos', component: NuevoControlArticulosComponent },
  { path: 'detalle-control-articulos/:id', component: DetalleControlArticulosComponent },
  { path: 'consulta-control-articulos', component: ConsultaControlArticulosComponent},
  { path: 'consulta-notas', component: ListaNotasComponent },
  { path: 'nueva-nota', component: NuevaNotaComponent },
  { path: 'detalle-nota', component: ConsultaNotaComponent },
  { path: 'busquedaEspecifica', component: CCGrupalEspecificaComponent },
  { path: 'nuevaCronica', component: NuevaCronicaGrupalComponent },
  { path: 'cronicaGuardada', component: CronicaGuardadaComponent },
  { path: 'consulta-cronica-grupal', component: ListaCronicaGrupalComponent },
  { path: 'busqueda', component: BusquedaNssComponent },
  { path: 'tarjeta', component: AppTarjetaPresentacionComponent  },

  // Estudio medico social
  { path: 'lista-estudios', component: ConsultaEstudiosMedicosComponent },
  { path: 'nuevo-estudio', component: NuevoEstudioSocialMedicoComponent },
  { path: 'detalle-estudio', component: EstudioMedicoGuardadoComponent },

  //volanteDonacion
  { path: 'nuevo-volante', component: NuevoVdonacionSangreComponent },
  { path: 'consulta-volantes', component: ConsultaVolantesDonacionComponent },

  { path: 'nuevo-aviso-mp', component: NuevoVdonacionSangreComponent },
  { path: 'consulta-aviso-mp', component: ConsultaVolantesDonacionComponent },
  { path: 'consulta-cert-defuncion', component: ConsultaCertificadosDefuncionComponent},
  { path: 'nuevo-cert-defuncion', component: NuevoCertificadoDefuncionComponent}

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class TrabajoSocialRoutingModule { }
