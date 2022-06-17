import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { CardTemplateComponent } from './card-template/card-template.component';
import { CardTemplateExpandibleComponent } from './card-template-expandible/card-template-expandible.component';
import { TrabajadorSocialClinicoComponent } from './trabajador-social-clinico/trabajador-social-clinico.component';
import { DatosGeneralesPacienteComponent } from './datos-generales-paciente/datos-generales-paciente.component';
import { DatosGeneralesUsuarioComponent } from './datos-generales-usuario/datos-generales-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



@NgModule({
  declarations: [
    MenuComponent,
    CardTemplateComponent,
    CardTemplateExpandibleComponent,
    TrabajadorSocialClinicoComponent,
    DatosGeneralesPacienteComponent,
    DatosGeneralesUsuarioComponent,
  
  ],
  imports: [
    CommonModule,  FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
  ],exports:[MenuComponent,  CardTemplateComponent,
    CardTemplateExpandibleComponent,TrabajadorSocialClinicoComponent,DatosGeneralesPacienteComponent,  FormsModule,
    ReactiveFormsModule,MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ]
})
export class GeneralesModule { }
