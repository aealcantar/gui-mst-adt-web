import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SeguridadService } from '../seguridad.service';
import { HttpErrorResponse } from '@angular/common/http';
import { objAlert } from '../../common/alerta/alerta.interface';
import { AuthService } from 'src/app/service/auth-service.service';
import { Aplicacion } from 'src/app/models/aplicacion.model';
import { Usuario } from 'src/app/models/usuario.model';
import { MailService } from 'src/app/service/mail-service.service';
import { RecaptchaResponse } from 'src/app/models/recaptcha-response-model';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

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
  alert!: objAlert;
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
      // this.msjError("Hubo error en la conexión con los servicios");
      // this.mostrarMensaje(4, this._Mensajes.MSJ_ERROR_CONEXION_API);
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
      /*
        this.seguridadService.login({
          email: this.logindata.value.email,
          password: this.logindata.value.password
        })*/
      try {
        // this.recaptchaV3Service.execute('importantAction')
        //   .subscribe((token: string) => {
        console.log(`Token [${this.token}] generated`);
        // this.authService.validateRecaptcha(token).subscribe(
        //   (result) => {
        //     console.log(result);
        //     this.recaptchaResponse = result;
        // if (this.recaptchaResponse.success == true) {
        //login
        this.usuario.strEmail = this.logindata.get("usuario")?.value;
        this.usuario.strPassword = this.logindata.get("password")?.value;

        this.authService.login(this.usuario, this.aplicacion).subscribe(
          (result) => {
            console.log(result);
            this.authService.userLogged$.next(true);
            this.authService.getUserData(this.usuario.strEmail).subscribe(
              (response: any) => {
                // console.log("RESPONSE: ", response);
                this.authService.guardarUsuarioEnSesion(response);
              }
            );
            this.authService.guardarToken(result.access_token);
            this.seguridadService.registrarUsuario(this.usuario);
            this.router.navigate(["/busqueda"], { skipLocationChange: true });
          },
          (err: HttpErrorResponse) => {
            console.log("error " + err.error.message);
            if (err.error.message == undefined) {
              this.showError("<strong>Error.</strong> Servicio no esta disponible. Favor de reportarlo!.");
              return;
            }
            if (err.status == 400) {
              this.strMsjError = "" + err.status;
            } else {
              this.strMsjError = "" + err.status;
            }
            this.showError(err.error.message);
            //this.showError(err.error.message?err.message:err.error.message);
          }
        );
        // } else {
        //   this.showError(" Eres un robot");
        // }
        //   },
        //   (err: HttpErrorResponse) => {
        //     console.log("eror " + err.error.message);
        //     if (err.status == 400) {
        //       this.strMsjError = "" + err.status;
        //     } else {
        //       this.strMsjError = "" + err.status;
        //     }
        //     this.showError(err.error.message ? err.message : err.message);
        //   }
        // );
        // });
        // } else {
        //  this.showError();
        // }
      } catch (error) {
        // this.showError();
      }
    } else {
      this.showError('<strong>Error.</strong> Ingresa los datos obligatorios');
    }
  }

  private showError(error: string) {
    this.alert = {
      message: error,
      type: 'error',
      visible: true
    }
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false
      }
    }, 5000);
  }

  //Success
  private showSucces(msg: string) {
    this.alert = {
      message: '<strong>Estatus.</strong>' + msg,
      type: 'success',
      visible: true
    }
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false
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
    //this.modalService.open(content, {centered: true,size: 'lg', backdrop: 'static', keyboard: false})
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
          if (result.status == '200') this.showSucces(" Correo enviado satisfactoriamente!");
          else this.showError(result.status);
        },
        (err: HttpErrorResponse) => {
          console.log("eror " + err.error.status);
          $('#content').modal('hide');
          this.showError(" Correo no registrado!");
        }
      );
    } else {
      $('#content').modal('hide');
      this.showError(" ¡La cuenta de correo no contiene una estructura válida!");
    }
    this.correodata.reset();
  }

  cancelarenviocorreo() {
    this.correosubmitted = false;
    //this.modalService.dismissAll();
    this.correodata.reset();
    $('#content').modal('hide')
  }

  limpiarMsj() {
    this.strMsjError = "";
  }


}
