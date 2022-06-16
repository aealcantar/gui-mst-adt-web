import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlArticulosRoutingModule } from './control-articulos-routing.module';
import { NuevoControlArticulosComponent } from './nuevo-control-articulos/nuevo-control-articulos.component';
import { ImprimirControlArticulosComponent } from './imprimir-control-articulos/imprimir-control-articulos.component';
import { GeneralesModule } from '../generales/generales.module';

 


@NgModule({
  declarations: [
    NuevoControlArticulosComponent,
    ImprimirControlArticulosComponent,
   
  ],
  imports: [
    ControlArticulosRoutingModule,
    CommonModule , 
    GeneralesModule
    
  ],
})
export class ControlArticulosModule { }
