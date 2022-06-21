import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrabajoSocialRoutingModule } from './trabajo-social-routing.module';
import { NuevoControlArticulosComponent } from './control-articulos/nuevo-control-articulos/nuevo-control-articulos.component';
import { DetalleControlArticulosComponent } from './control-articulos/detalle-control-articulos/detalle-control-articulos.component';
import { SharedModulesModule } from '../shared-modules/shared-modules.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlArticulosService } from './services/control-articulos.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { BusquedaNssComponent } from './pacientes/busqueda-nss/busqueda-nss.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NuevaNotaComponent } from './notas-trabajo-social/nueva-nota/nueva-nota.component';
import { ListaNotasComponent } from './notas-trabajo-social/lista-notas/lista-notas.component';
import { ConsultaNotaComponent } from './notas-trabajo-social/consulta-nota/consulta-nota.component';
import { CCGrupalEspecificaComponent } from './cronica-grupal/consulta-cronica-grupal/c-cgrupal-especifica.component';
import { CronicaGuardadaComponent } from './cronica-grupal/detalle-nueva-cronica-grupal/cronica-guardada.component';
import { AgregarParticipanteDialogComponent } from './cronica-grupal/nueva-cronica-grupal/agregar-participante-dialog/agregar-participante-dialog.component';
import { NuevaCronicaGrupalComponent } from './cronica-grupal/nueva-cronica-grupal/nueva-cronica-grupal.component';
import { ListaCronicaGrupalComponent } from './cronica-grupal/lista-cronica-grupal/lista-cronica-grupal.component';
import { EstudioMedicoGuardadoComponent } from './estudio-social-medico/consulta-estudio/estudio-medico-guardado.component';
import { ConsultaEstudiosMedicosComponent } from './estudio-social-medico/lista-estudios/consulta-estudios-medicos.component';
import { NuevoEstudioSocialMedicoComponent } from './estudio-social-medico/nuevo-estudio/nuevo-estudio-social-medico.component';
import { objAlert } from '../shared-modules/models/alerta.interface';

@NgModule({
  declarations: [
    NuevoControlArticulosComponent,
    DetalleControlArticulosComponent,
    BusquedaNssComponent,
    NuevaNotaComponent,
    ListaNotasComponent,
    ConsultaNotaComponent,
    CCGrupalEspecificaComponent,
    NuevaCronicaGrupalComponent,
    CronicaGuardadaComponent,
    ListaCronicaGrupalComponent,
    AgregarParticipanteDialogComponent,
    EstudioMedicoGuardadoComponent,
    ConsultaEstudiosMedicosComponent,
    NuevoEstudioSocialMedicoComponent,
  ],
  imports: [
    MatDialogModule,
    SharedModulesModule,
    TrabajoSocialRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ], providers: [
    ControlArticulosService
  ]
})
export class TrabajoSocialModule { }
