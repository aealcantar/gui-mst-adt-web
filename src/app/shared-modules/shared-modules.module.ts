import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTemplateComponent } from './card-template/card-template.component';
import { CardTemplateExpandibleComponent } from './card-template-expandible/card-template-expandible.component';
import { DatosGeneralesPacienteComponent } from './datos-generales-paciente/datos-generales-paciente.component';
import { DatosGeneralesUsuarioComponent } from './datos-generales-usuario/datos-generales-usuario.component';
import { MenuComponent } from './menu/menu.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TrabajadorSocialClinicoComponent } from './trabajador-social-clinico/trabajador-social-clinico.component';

@NgModule({
  declarations: [  CardTemplateComponent,
    CardTemplateExpandibleComponent,
    DatosGeneralesPacienteComponent,
    DatosGeneralesUsuarioComponent,
    MenuComponent,
    TrabajadorSocialClinicoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],exports:[
    CardTemplateComponent,
     CardTemplateExpandibleComponent,
     DatosGeneralesPacienteComponent,
     DatosGeneralesUsuarioComponent,
     MenuComponent,
     FormsModule,
     ReactiveFormsModule,
     MatInputModule,
     NgxMatDatetimePickerModule,
     NgxMatTimepickerModule,
     NgxMatNativeDateModule,
     MatDatepickerModule,
     MatNativeDateModule,
     TrabajadorSocialClinicoComponent,
    ],
})
export class SharedModulesModule { }
