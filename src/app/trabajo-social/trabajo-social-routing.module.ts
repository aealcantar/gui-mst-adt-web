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
import { ConsultaControlArticulosComponent } from './control-articulos/consulta-control-articulos/consulta-control-articulos.component';

import { ConsultaVolantesDonacionComponent } from './volantes-donacion-sangre/consulta-volantes-donacion/consulta-volantes-donacion.component';
import { NuevoVdonacionSangreComponent } from './volantes-donacion-sangre/nuevo-vdonacion-sangre/nuevo-vdonacion-sangre.component';

import { NuevoAvisoMpComponent } from './avisos-mp/nuevo-aviso-mp/nuevo-aviso-mp.component';
import { ConsultaAvisoMpComponent } from './avisos-mp/consulta-aviso-mp/consulta-aviso-mp.component';
import { DetalleVolantesDonacionSangreComponent } from './volantes-donacion-sangre/detalle-volantes-donacion-sangre/detalle-volantes-donacion-sangre.component';

import { ConsultaInformeServiciosComponent } from './informe-servicios-profesionales/consulta-informe-servicios/consulta-informe-servicios.component';
import { DetalleInformeServiciosComponent } from './informe-servicios-profesionales/detalle-informe-servicios/detalle-informe-servicios.component';


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

  { path: 'agregar-control-articulos', component: NuevoControlArticulosComponent },
  { path: 'detalle-control-articulos/:id', component: DetalleControlArticulosComponent },
  { path: 'consulta-control-articulos', component: ConsultaControlArticulosComponent},
  { path: 'consulta-notas', component: ListaNotasComponent },
  { path: 'agregar-notas', component: NuevaNotaComponent },
  { path: 'detalle-notas', component: ConsultaNotaComponent },
  { path: 'busqueda-especifica', component: CCGrupalEspecificaComponent },
  { path: 'agregar-cronica-grupal', component: NuevaCronicaGrupalComponent },
  { path: 'detalle-cronica-grupal', component: CronicaGuardadaComponent },
  { path: 'consulta-cronica-grupal', component: ListaCronicaGrupalComponent },
  { path: 'busqueda', component: BusquedaNssComponent },

  // Estudio medico social
  { path: 'consulta-estudios-medicos', component: ConsultaEstudiosMedicosComponent },
  { path: 'agregar-estudios-medicos', component: NuevoEstudioSocialMedicoComponent },
  { path: 'detalle-estudios-medicos', component: EstudioMedicoGuardadoComponent },

  //volanteDonacion
  { path: 'agregar-volante-donacion-sangre', component: NuevoVdonacionSangreComponent },
  { path: 'consulta-volante', component: ConsultaVolantesDonacionComponent },
  { path: 'detalle-volante-donacion-sangre/:id', component: DetalleVolantesDonacionSangreComponent },
  

  { path: 'agregar-aviso-mp', component: NuevoVdonacionSangreComponent },
  { path: 'consulta-aviso-mp', component: ConsultaVolantesDonacionComponent },

  //Informe servicios profecionales
  { path: 'consulta-informe-servicios', component:   ConsultaInformeServiciosComponent},
  { path: 'detalle-informe-servicios/:id', component: DetalleInformeServiciosComponent },

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class TrabajoSocialRoutingModule { }
