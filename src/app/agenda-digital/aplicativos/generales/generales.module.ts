import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { CardTemplateComponent } from './card-template/card-template.component';
import { CardTemplateExpandibleComponent } from './card-template-expandible/card-template-expandible.component';
import { TrabajadorSocialClinicoComponent } from './trabajador-social-clinico/trabajador-social-clinico.component';
import { DatosGeneralesPacienteComponent } from './datos-generales-paciente/datos-generales-paciente.component';
import { DatosGeneralesUsuarioComponent } from './datos-generales-usuario/datos-generales-usuario.component';



@NgModule({
  declarations: [
    MenuComponent,
    CardTemplateComponent,
    CardTemplateExpandibleComponent,
    TrabajadorSocialClinicoComponent,
    DatosGeneralesPacienteComponent,
    DatosGeneralesUsuarioComponent
  ],
  imports: [
    CommonModule
  ],exports:[MenuComponent,  CardTemplateComponent,
    CardTemplateExpandibleComponent,TrabajadorSocialClinicoComponent,DatosGeneralesPacienteComponent]
})
export class GeneralesModule { }
