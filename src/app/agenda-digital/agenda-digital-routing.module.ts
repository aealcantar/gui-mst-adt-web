import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserbuscaComponent } from './configuracion/usuarios/userbusca/userbusca.component';
import { UserconsultaComponent } from './configuracion/usuarios/userconsulta/userconsulta.component';
import { UserguardaComponent } from './configuracion/usuarios/userguarda/userguarda.component';
import { CitabuscaComponent } from './citas/citabusca/citabusca.component';
import { CitaconsultaComponent } from './citas/citaconsulta/citaconsulta.component';
import { CitaguardaComponent } from './citas/citaguarda/citaguarda.component';


const routes: Routes = [
  // {path:'',
  // children:[
  // {
  //   path:"control-articulos",
  //   loadChildren:()=>
  //   import('./aplicativos/control-articulos/control-articulos.module').then((m)=> m.ControlArticulosModule),
  // }
  // ]

  //   },
  { path: 'buscauser', component: UserbuscaComponent },
  { path: 'consultauser/:id', component: UserconsultaComponent },
  { path: 'guardauser', component: UserguardaComponent },
  { path: 'editauser/:id', component: UserguardaComponent },
  { path: 'buscacita', component: CitabuscaComponent },
  { path: 'consultacita/:id', component: CitaconsultaComponent },
  { path: 'guardacita', component: CitaguardaComponent },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AgendaDigitalRoutingModule { }
