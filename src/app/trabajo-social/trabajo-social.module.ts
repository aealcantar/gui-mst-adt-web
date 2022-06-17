import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabajoSocialRoutingModule } from './trabajo-social-routing.module';
import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component';
import { DetalleControlArticulosComponent } from './control-articulos/detalle-control-articulos/detalle-control-articulos.component';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
// import { NuevaCronicaComponent } from './cronicas-grupales/nueva-cronica/nueva-cronica.component';
// import { CronicaGuardadaComponent } from './cronicas-grupales/detalle-cronica/cronica-guardada.component';
// import { ConsultaComponent } from './cronicas-grupales/list-cronica/consulta.component';

@NgModule({
  declarations: [
    NuevoControlArticulosComponent,
    DetalleControlArticulosComponent,
    // NuevaCronicaComponent,
    // CronicaGuardadaComponent,
    // ConsultaComponent,
  ],
  imports: [
    SharedModulesModule,
    TrabajoSocialRoutingModule,
    CommonModule
  ]
})
export class TrabajoSocialModule { }
