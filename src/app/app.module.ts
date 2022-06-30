import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from "ngx-pagination";

import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { JRInterceptor } from './jrinterceptor.interceptor';
import { environment } from 'src/environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuariosService } from './shared-modules/services/usuarios.service';
import { ReadexcelDirective } from './shared-modules/directives/readexcel.directive';
import { JwtModule } from '@auth0/angular-jwt';
import { DatePipe, registerLocaleData } from '@angular/common';
import '@angular/common/locales/global/es';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { NuevoEstudioSocialMedicoComponent } from './nuevo-estudio-social-medico/nuevo-estudio-social-medico.component';
// import { ConsultaEstudiosMedicosComponent } from './consulta-estudios-medicos/consulta-estudios-medicos.component';
// import { EstudioMedicoGuardadoComponent } from './estudio-medico-guardado/estudio-medico-guardado.component';
// import { ConsultaVolantesDonacionComponent } from './trabajo-social/volantes-donacion-sangre/consulta-volantes-donacion/consulta-volantes-donacion.component';
// import { NuevoVdonacionSangreComponent } from './trabajo-social/volantes-donacion-sangre/nuevo-vdonacion-sangre/nuevo-vdonacion-sangre.component';
import { NuevoAvisoMpComponent } from './trabajo-social/avisos-mp/nuevo-aviso-mp/nuevo-aviso-mp.component';
import { ConsultaAvisoMpComponent } from './trabajo-social/avisos-mp/consulta-aviso-mp/consulta-aviso-mp.component';

import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { SharedModulesModule } from './shared-modules/shared-modules.module';
import { LoginComponent } from './shared-modules/login/login.component';
import { RegistroComponent } from './shared-modules/registro/registro.component';
import { SeguridadService } from './shared-modules/services/seguridad.service';

registerLocaleData('es');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    ReadexcelDirective,
    NuevoAvisoMpComponent,
    ConsultaAvisoMpComponent,
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
    MatAutocompleteModule,
    NgbModule,
    MatIconModule,
    MatFormFieldModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxPaginationModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressBarModule,
    MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModulesModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return sessionStorage.getItem('token');
        },
        allowedDomains: ['localhost:4200', 'localhost:8080', 'localhost:8081', 'localhost:8082'],
        disallowedRoutes: ['http://localhost:8080/login', 'http://localhost:8081/login']
      }
    })
  ],
  providers:
    [DatePipe, UsuariosService, SeguridadService, {
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
      { provide: MAT_DATE_LOCALE, useValue: 'es-MX' }
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    sessionStorage.setItem('token', 'token is null');
  }
}
