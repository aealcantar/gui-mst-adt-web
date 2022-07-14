import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { SeguridadService } from '../seguridad.service'
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { AuthService } from 'src/app/service/auth-service.service'
import { AdmonPasswordResponse } from 'src/app/models/admon-password-response.model'
import { AdmonPasswordRequest } from 'src/app/models/admon-password-request.model'
import { objAlert } from 'src/app/common/alerta/alerta.interface'
import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material/icon'
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  logindata: any = this.formBuilder.group({
    nvacontrasenia: ['', Validators.required],
    confirmacontrasenia: ['', Validators.required],
  })
  submitted: boolean = false
  validaPassRegex: boolean = false
  correosubmitted: boolean = false
  staticAlertClosed: boolean = true
  mail: string = ''
  admonRequest: AdmonPasswordRequest = new AdmonPasswordRequest()
  admonResponse: AdmonPasswordResponse = new AdmonPasswordResponse()

  alert!: objAlert

  showPassword1: boolean = false
  showPassword2: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private seguridadService: SeguridadService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private router: Router,
    private http: HttpClient,
  ) {
    this.matIconRegistry.addSvgIcon(
      'eye-on',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/eye-on-1.svg',
      ),
    )
    this.matIconRegistry.addSvgIcon(
      'eye-off',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/eye-off.svg',
      ),
    )
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log(params) // { orderby: "price" }
      this.mail = params['email']
      console.log(this.mail) // price
    })
  }

  get f() {
    return this.logindata.controls
  }

  loginusuario(): void {
    this.submitted = true
    console.log('valid' + this.logindata.valid)

    if (
      this.logindata.value.nvacontrasenia !=
      this.logindata.value.confirmacontrasenia
    ) {
      this.muestraAlerta(
        '¡La contraseña no coincide, favor de verificar!',
        'alert-danger',
        'Error',
      )
      return
    }

    if (
      this.logindata.valid &&
      this.logindata.value.nvacontrasenia ==
        this.logindata.value.confirmacontrasenia
    ) {
      const validate = (input: string) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,10}$/.test(
          input,
        )

      console.log(
        `${this.logindata.value.nvacontrasenia} ${validate(
          this.logindata.value.nvacontrasenia,
        )}`,
      )
      if (validate(this.logindata.value.nvacontrasenia)) {
        this.admonRequest.email = this.mail
        this.admonRequest.password = this.logindata.value.nvacontrasenia

        this.authService.actualizarPassword(this.admonRequest).subscribe(
          (result) => {
            console.log(result)
            this.admonResponse = result
            if (this.admonResponse.status == '200') {
              this.showSucces('¡Éxito Contraseña guardada correctamente!', true);
              this.muestraAlerta(
                '¡Éxito Contraseña guardada correctamente!',
                'alert-success',
                null,
              )
              return
            }
          },
          (err: HttpErrorResponse) => {
            console.log('eror ' + err.error.message)
            this.muestraAlerta(
              'Ocurrio un error favor de reportarlo.',
              'alert-danger',
              'Error',
            )
          },
        )
      } else {
        this.muestraAlerta(
          '¡Éxito Contraseña guardada correctamente!',
          'alert-success',
          null,
        )
      }
    } else {
      this.muestraAlerta('¡Contraseña inválida!', 'alert-danger', 'Error')
    }
  }
  cancelarlogin() {
    this.submitted = false
    this.logindata.reset()
    this.router.navigate(['/login'])
  }

  private showError(error: string) {
    this.alert = {
      message: error,
      type: 'error',
      visible: true,
    }
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false,
      }
    }, 5000)
  }
  //success


  private showSucces(msg:string, redirect:boolean) {

    this.alert = {
      message:'<strong>Estatus.</strong>'+msg,
      type: 'success',
      visible: true
    }
    setTimeout(() => {
      this.alert = {
        message:'',
        type: 'custom',
        visible: false
      }
      if(redirect){
        this.router.navigate(["/login"], { skipLocationChange: true });
      }
    }, 5000);
  }

  muestraAlerta(
    mensaje: string,
    estilo: string,
    tipoMsj?: string,
    funxion?: any,
  ) {
    this.alert = new AlertInfo()
    this.alert = {
      message: mensaje,
      type: estilo,
      visible: true,
      typeMsg: tipoMsj,
    }
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false,
      }
      // if (funxion != null) {
      //   funxion()
      // }
    }, 2000)
  }
}
