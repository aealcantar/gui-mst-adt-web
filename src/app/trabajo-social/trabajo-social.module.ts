import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabajoSocialRoutingModule } from './trabajo-social-routing.module';
 import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component'; 
import { DetalleControlArticulosComponent } from './control-articulos/detalle-control-articulos/detalle-control-articulos.component';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlArticulosService } from './services/control-articulos.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { BusquedaNssComponent } from './pacientes/busqueda-nss/busqueda-nss.component';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
  declarations: [
    NuevoControlArticulosComponent,
    DetalleControlArticulosComponent,
    BusquedaNssComponent,
  ],
  imports: [
    MatDialogModule,
    SharedModulesModule,
    TrabajoSocialRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],providers:[
    ControlArticulosService
  ]
})
export class TrabajoSocialModule { }
