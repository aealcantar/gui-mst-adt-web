import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'',
  children:[
  {
    path:"control-articulos",
    loadChildren:()=>
    import('./aplicativos/control-articulos/control-articulos.module').then((m)=> m.ControlArticulosModule),
  }]
   
  },

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TrabajoSocialRoutingModule { }
