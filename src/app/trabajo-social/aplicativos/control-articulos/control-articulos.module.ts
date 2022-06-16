import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlArticulosRoutingModule } from './control-articulos-routing.module';
import { NuevoControlArticulosComponent } from './nuevo-control-articulos/nuevo-control-articulos.component';
import { GeneralesModule } from '../generales/generales.module';
import { DetalleArticulosComponent } from './detalle-articulos/detalle-articulos.component';

 
@NgModule({
  declarations: [
    NuevoControlArticulosComponent,
    DetalleArticulosComponent

   
  ],
  imports: [
    ControlArticulosRoutingModule,
    CommonModule , 
    GeneralesModule
    
  ],
})
export class ControlArticulosModule { }
