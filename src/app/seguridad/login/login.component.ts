import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SeguridadService } from '../seguridad.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/service/auth-service.service';
import { Aplicacion } from 'src/app/models/aplicacion.model';
import { Usuario } from 'src/app/models/usuario.model';
import { MailService } from 'src/app/service/mail-service.service';
import { RecaptchaResponse } from 'src/app/models/recaptcha-response-model';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  signin: FormGroup = new FormGroup({
    usuario: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  logindata: any = this.formBuilder.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required],
    token: ['', Validators.required]
  });

  aplicacion: Aplicacion = new Aplicacion();
  usuario: Usuario = new Usuario();
  boton: boolean = false;
  strMsjError: string = "";
  submitted: boolean = false;
  correosubmitted: boolean = false;
  closeResult!: string;
  correodata: any = this.formBuilder.group({
    correornv: ['', [Validators.required, Validators.email]]
  });
  alert!: AlertInfo;
  showPassword: boolean = false;
  recaptchaResponse: RecaptchaResponse = new RecaptchaResponse();
  token: string | undefined;

  constructor(private formBuilder: FormBuilder,
    private seguridadService: SeguridadService,
    private mailService: MailService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    this.token = undefined;
    this.matIconRegistry.addSvgIcon(
      "eye-on",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "/assets/icons/eye-on-1.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "eye-off",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "/assets/icons/eye-off.svg"
      )
    );
  }

  ngOnInit(): void {
    this.authService.getAppAccesbyAppName("SAD").subscribe(async (resp: Aplicacion) => {
      this.aplicacion = resp;
      console.log(" app " + this.aplicacion.cveUsuario);
    }, (error: HttpErrorResponse) => {
      console.error("Error: ", error);
    });
  }

  public send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }
    console.debug(`Token [${this.token}] generated`);
  }

  get f() {
    return this.logindata.controls;
  }
  get emailInput() { return this.signin.get('email'); }
  get passwordInput() { return this.signin.get('password'); }

  async loginusuario(): Promise<void> {
    this.submitted = true;
    this.boton = true;

    if (this.logindata.invalid) {
      for (const control of Object.keys(this.logindata.controls)) {
        this.logindata.controls[control].markAsTouched();
      }
      return;
    }

    if (this.logindata.valid) {
      this.strMsjError = "";
      try {
        console.log(`Token [${this.token}] generated`);
        this.usuario.strEmail = this.logindata.get("usuario")?.value;
        this.usuario.strPassword = this.logindata.get("password")?.value;
        this.authService.login(this.usuario, this.aplicacion).subscribe(
          (result) => {
            console.log(result);
            this.authService.getUserData(this.usuario.strEmail).subscribe(
              (response: any) => {
                this.authService.guardarUsuarioEnSesion(response);
                this.authService.userLogged$.next(true);
                this.authService.isAuthenticatedObs$.next(true);
              }
            );
            this.authService.guardarToken(result.access_token);
            this.seguridadService.registrarUsuario(this.usuario);
            this.router.navigate(["/catalogos"], { skipLocationChange: true });
          },
          (err: HttpErrorResponse) => {
            window.scroll(0,0);
            console.log("error " + err.error.message);
            if (err.error.message == undefined) {
              this.muestraAlerta('Servicio no esta disponible. Favor de reportarlo!','alert-danger','Error');
              return;
            }
            if (err.status == 400) {
              this.strMsjError = "" + err.status;
            } else {
              this.strMsjError = "" + err.status;
            }
            this.muestraAlerta(err.error.message,'alert-danger','Error');
          }
        );
      } catch (error) {
        // this.muestraAlerta();
      }
    } else {
      this.muestraAlerta('Ingresa los datos obligatorios','alert-danger','Error');
    }
  }

  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string, funxion?:any) {
    this.alert = new AlertInfo;
    this.alert = {

      message: mensaje,
      type: estilo,
      visible: true,
      typeMsg: tipoMsj
    };
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false,
      };
      if(funxion != null){
        funxion();
      }
    }, 2000);
  }

  cancelarlogin() {
    this.submitted = false;
  }

  open(content: any) {
    this.correosubmitted = false;
    this.modalService.open(content, { centered: true });
  }

  modalcarga(content: any) {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    $('#content').modal('show')
  }

  validacorreo() {
    this.correosubmitted = true;
    if (this.correodata.valid) {
      let correo = this.correodata.get('correornv')?.value;
      this.mailService.recuperarPassword(correo).subscribe(
        (result) => {
          $('#content').modal('hide');
          if (result.status == '200') this.muestraAlerta('¡Correo enviado satisfactoriamente!','alert-success',null);
          else this.muestraAlerta(result.status,'alert-danger','Error');
        },
        (err: HttpErrorResponse) => {
          console.log("eror " + err.error.status);
          $('#content').modal('hide');
          this.muestraAlerta('¡Correo no registrado!','alert-danger','Error');
        }
      );
    } else {
      $('#content').modal('hide');
      this.muestraAlerta('¡La cuenta de correo no contiene una estructura válida!','alert-danger','Error');
    }
    this.correodata.reset();
  }

  cancelarenviocorreo() {
    this.correosubmitted = false;
    this.correodata.reset();
    $('#content').modal('hide')
  }

  limpiarMsj() {
    this.strMsjError = "";
  }


}
