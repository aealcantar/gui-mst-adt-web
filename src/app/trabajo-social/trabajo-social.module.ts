import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabajoSocialRoutingModule } from './trabajo-social-routing.module';
 import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component';
import { DetalleControlArticulosComponent } from './control-articulos/detalle-control-articulos/detalle-control-articulos.component';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { BusquedaNssComponent } from './pacientes/busqueda-nss/busqueda-nss.component';
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  declarations: [
    NuevoControlArticulosComponent,
    DetalleControlArticulosComponent,
    BusquedaNssComponent,
  ],
  imports: [
    SharedModulesModule,
    TrabajoSocialRoutingModule,
    CommonModule,
    NgxPaginationModule,
  ]
})
export class TrabajoSocialModule { }
