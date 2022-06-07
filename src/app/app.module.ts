import { LOCALE_ID, NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule} from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { BusquedaNssComponent } from './busqueda-nss/busqueda-nss.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppMenuComponent } from './app-menu/app-menu.component';
import { AppInfoBottomComponent } from './app-info-bottom/app-info-bottom.component';
import { AppAlertsComponent } from './app-alerts/app-alerts.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from "ngx-pagination";
import { AppTarjetaPresentacionComponent } from './app-tarjeta-presentacion/app-tarjeta-presentacion.component';
import { CCGrupalEspecificaComponent } from './cronica-grupal/c-cgrupal-especifica/c-cgrupal-especifica.component';
import { NuevaCronicaComponent } from './cronica-grupal/nueva-cronica/nueva-cronica.component';
import { CronicaGuardadaComponent } from './cronica-grupal/cronica-guardada/cronica-guardada.component';
import { ConsultaComponent } from './cronicaGrupal/consulta/consulta.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { CardTemplateComponent } from './commons/card-template/card-template.component';
import { AlertaComponent } from './common/alerta/alerta.component';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { JRInterceptor } from './jrinterceptor.interceptor';
import { environment } from 'src/environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuariosService } from './service/usuarios.service';
import { SeguridadService } from './seguridad/seguridad.service';
import { LoginComponent } from './seguridad/login/login.component';
import { RegistroComponent } from './seguridad/registro/registro.component';
import { PrincipalComponent } from './principal/principal.component';
import { UserconsultaComponent } from './configuracion/usuarios/userconsulta/userconsulta.component';
import { UserguardaComponent } from './configuracion/usuarios/userguarda/userguarda.component';
import { UserbuscaComponent } from './configuracion/usuarios/userbusca/userbusca.component';

import { ReadexcelDirective } from './directives/readexcel.directive';
import { DataTablesModule } from 'angular-datatables';
import { AgregarParticipanteDialogComponent } from './cronica-grupal/nueva-cronica/agregar-participante-dialog/agregar-participante-dialog.component';
import { JwtModule } from '@auth0/angular-jwt';
import { DatePipe, registerLocaleData } from '@angular/common';
import '@angular/common/locales/global/es';
import { NumberDirective } from './directives/only-numbers.directive';
import { NuevaNotaTSocialComponent } from './nueva-nota-tsocial/nueva-nota-tsocial.component';
import { ConsultaListaNotasTSocialComponent } from './consulta-lista-notas-tsocial/consulta-lista-notas-tsocial.component';

import { MatPaginatorModule } from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CitabuscaComponent } from './citas/citabusca/citabusca.component';
import { CitaconsultaComponent } from './citas/citaconsulta/citaconsulta.component';
import { CitaguardaComponent } from './citas/citaguarda/citaguarda.component';
import { FichapacienteComponent } from './common/fichapaciente/fichapaciente.component';
import { MenugralComponent } from './common/menugral/menugral.component';
import { CitasService } from './citas/citas.service';

import { LogoutBarComponent } from './components/templates/logout-bar/logout-bar.component';
import { FooterComponent } from './components/templates/footer/footer.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import { MAT_DATE_LOCALE,MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MyFilterPipe } from './directives/my-filter.pipe';

registerLocaleData('es');

@NgModule({
  declarations: [
    AppComponent,
    AlertaComponent,
    LoginComponent,
    RegistroComponent,
    PrincipalComponent,
    BusquedaNssComponent,
    AppMenuComponent,
    AppInfoBottomComponent,
    AppAlertsComponent,
    AppTarjetaPresentacionComponent,
    CCGrupalEspecificaComponent,
    NuevaCronicaComponent,
    CronicaGuardadaComponent,
    ConsultaComponent,
    HeaderMenuComponent,
    CardTemplateComponent,
    AgregarParticipanteDialogComponent,
    NumberDirective,
    NuevaNotaTSocialComponent,
    ConsultaListaNotasTSocialComponent,
    UserconsultaComponent,
    UserguardaComponent,
    UserbuscaComponent,
    ReadexcelDirective,
    CitabuscaComponent,
    CitaconsultaComponent,
    CitaguardaComponent,
    FichapacienteComponent,
    MenugralComponent,
    LogoutBarComponent,
    FooterComponent,
    MyFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatDialogModule,
    NgbModule,
    MatIconModule,
    MatFormFieldModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxPaginationModule,
    DataTablesModule,
    MatPaginatorModule,
    MatTableModule,
	  MatProgressBarModule,
    MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return sessionStorage.getItem('token');
        },
        allowedDomains: ['localhost:4200','localhost:8080','localhost:8081','localhost:8082'],
        disallowedRoutes: ['http://localhost:8080/login','http://localhost:8081/login']
      }
    })
  ],
  providers:
    [DatePipe, UsuariosService, SeguridadService, CitasService, {
      provide:
        RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings
    }, {
        provide:
            HTTP_INTERCEPTORS, useClass: JRInterceptor, multi: true
      }, {
        provide:
            LOCALE_ID, useValue: 'es'
      },
      {provide: MAT_DATE_LOCALE, useValue: 'es-MX'}
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){
   sessionStorage.setItem('token','token is null');
  }
}
