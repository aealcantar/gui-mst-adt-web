import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component';
import { DetalleControlArticulosComponent } from './control-articulos/detalle-control-articulos/detalle-control-articulos.component';
import { ListaNotasComponent } from './notas-trabajo-social/lista-notas/lista-notas.component';
import { NuevaNotaComponent } from './notas-trabajo-social/nueva-nota/nueva-nota.component';
import { ConsultaNotaComponent } from './notas-trabajo-social/consulta-nota/consulta-nota.component';

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
  { path: 'consulta-notas', component: ListaNotasComponent  },
  { path: 'nueva-nota', component: NuevaNotaComponent  },
  { path: 'detalle-nota', component: ConsultaNotaComponent  },

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class TrabajoSocialRoutingModule { }
