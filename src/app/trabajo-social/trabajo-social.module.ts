import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabajoSocialRoutingModule } from './trabajo-social-routing.module';
 import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component'; 
import { DetalleControlArticulosComponent } from './control-articulos/detalle-control-articulos/detalle-control-articulos.component';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlArticulosService } from './services/control-articulos.service';

@NgModule({
  declarations: [
    NuevoControlArticulosComponent,
    DetalleControlArticulosComponent,
  ],
  imports: [
 
    SharedModulesModule,
    TrabajoSocialRoutingModule,
    CommonModule,
    ReactiveFormsModule
  ],providers:[
    ControlArticulosService
  ]
})
export class TrabajoSocialModule { }
