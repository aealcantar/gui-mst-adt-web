import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component';


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

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class TrabajoSocialRoutingModule { }
