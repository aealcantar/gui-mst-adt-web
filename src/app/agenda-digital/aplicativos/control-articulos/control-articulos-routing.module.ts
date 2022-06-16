import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
import { NuevoControlArticulosComponent } from './nuevo-control-articulos/nuevo-control-articulos.component';
import { ImprimirControlArticulosComponent } from './imprimir-control-articulos/imprimir-control-articulos.component';

const routes: Routes = [
  { path: '', 
    children:[{
      path:'nuevo-articulo',
      component: NuevoControlArticulosComponent
    },{
      path:"imprimir-articulo",
      component:ImprimirControlArticulosComponent
    }]
  
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    
    RouterModule.forChild(routes)
  ]
})
export class ControlArticulosRoutingModule { }
