import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendaDigitalRoutingModule } from './agenda-digital-routing.module';
import { UserconsultaComponent } from './configuracion/usuarios/userconsulta/userconsulta.component';
import { UserguardaComponent } from './configuracion/usuarios/userguarda/userguarda.component';
import { UserbuscaComponent } from './configuracion/usuarios/userbusca/userbusca.component';
import { CitabuscaComponent } from './citas/citabusca/citabusca.component';
import { CitaconsultaComponent } from './citas/citaconsulta/citaconsulta.component';
import { CitaguardaComponent } from './citas/citaguarda/citaguarda.component';
import { LogoutBarComponent } from './components/templates/logout-bar/logout-bar.component';
import { FooterComponent } from './components/templates/footer/footer.component';
import { CitasService } from './citas/citas.service';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { MyFilterPipe } from '../shared-modules/directives/my-filter.pipe';



@NgModule({
  declarations: [ 
    UserconsultaComponent,
    UserguardaComponent,
    UserbuscaComponent,
    CitabuscaComponent,
    CitaconsultaComponent,
    CitaguardaComponent,
    LogoutBarComponent,
    FooterComponent,
    MyFilterPipe,
  ],
  imports: [
    AgendaDigitalRoutingModule,
    CommonModule,
    SharedModulesModule,
  ], providers: [
    CitasService
  ]
})
export class AgendaDigitalModule { }
