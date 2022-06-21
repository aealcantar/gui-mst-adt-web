import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component';
import { DetalleControlArticulosComponent } from './control-articulos/detalle-control-articulos/detalle-control-articulos.component';
import { ConsultaListaNotasTSocialComponent } from './notas-trabajo-social/consulta-lista-notas-tsocial/consulta-lista-notas-tsocial.component';
import { NuevaNotaTSocialComponent } from './notas-trabajo-social/nueva-nota-tsocial/nueva-nota-tsocial.component';
import { ConsultaNotaTSocialComponent } from './notas-trabajo-social/consulta-nota-tsocial/consulta-nota-tsocial.component';

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
  { path: 'detalle-control-articulos/:id', component: DetalleControlArticulosComponent },
  { path: 'consulta-notas', component: ConsultaListaNotasTSocialComponent  },
  { path: 'nueva-nota', component: NuevaNotaTSocialComponent  },
  { path: 'detalle-nota', component: ConsultaNotaTSocialComponent  },

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class TrabajoSocialRoutingModule { }
