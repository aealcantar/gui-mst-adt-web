import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTemplateComponent } from './card-template/card-template.component';
import { CardTemplateExpandibleComponent } from './card-template-expandible/card-template-expandible.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TrabajadorSocialClinicoComponent } from './trabajador-social-clinico/trabajador-social-clinico.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AlertaGeneralComponent } from './alerta-general/alerta.component';
import { AppMenuComponent } from './app-menu/app-menu.component';
import { AlertaComponent } from './alerta/alerta.component';
import { MenugralComponent } from './menugral/menugral.component';
import { FichapacienteComponent } from './fichapaciente/fichapaciente.component';
import { DataTablesModule } from 'angular-datatables';
import { MatSelectModule } from '@angular/material/select';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { MatDialogRef } from '@angular/material/dialog';
import { NumberDirective } from './directives/only-numbers.directive';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@NgModule({
  declarations: [
    CardTemplateComponent,
    CardTemplateExpandibleComponent,
    TrabajadorSocialClinicoComponent,
    AlertaGeneralComponent,
    AlertaComponent,
    AppMenuComponent,
    FichapacienteComponent,
    MenugralComponent,
    HeaderMenuComponent,
    NumberDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DataTablesModule,
    MatSelectModule,

  ], exports: [
    CardTemplateComponent,
    CardTemplateExpandibleComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TrabajadorSocialClinicoComponent,
    AlertaGeneralComponent,
    AlertaComponent,
    AppMenuComponent,
    FichapacienteComponent,
    MenugralComponent,
    DataTablesModule,
    HeaderMenuComponent,
    NumberDirective,
  ], providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-mx' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class SharedModulesModule { }
