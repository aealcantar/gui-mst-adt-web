import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { objAlert } from '../../../common/alerta/alerta.interface';
import { AlertaComponent } from '../../../common/alerta/alerta.component';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValue } from '@angular/common';
import { UsuariosService } from '../usuarios.service';
import { AuthService } from 'src/app/service/auth-service.service';
import { HelperMensajesService } from '../../../services/helper.mensajes.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';

declare var $gmx: any;

@Component({
  selector: 'app-userguarda',
  templateUrl: './userguarda.component.html',
  styleUrls: ['./userguarda.component.css'],
})
export class UserguardaComponent implements OnInit {
  alert!: objAlert;
  varid!: any;
  currentroute: string = '';
  isedit: boolean = false;
  strtitulopag: string = '';
  userdata:any = this.formBuilder.group({
    matricula: ['', Validators.required],
    usuario: '',
    password: '',
    nombres: ['', Validators.required],
    primerapellido: ['', Validators.required],
    segundoapellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    unidadmedica: '',
    rol: ['', Validators.required],
    estatus: ['', Validators.required],
    puesto: '',
    escuelaprocd: '',
    idusuario: '',
  });
  submitted = false;
  objectKeys = Object.keys;

  lstRoles: Array<any> = [];
  rolselected!: object;
  selected = '----';

  originalOrder = (
    a: KeyValue<number, string>,
    b: KeyValue<number, string>
  ): number => {
    return 0;
  };

  public keepOriginalOrder = (a: { key: any }, b: any) => a.key;
  private _usuario!: Usuario;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activerouter: ActivatedRoute,
    private userservice: UsuariosService,
    private _Mensajes: HelperMensajesService,
  ) {}

  ngOnInit(): void {
    this.authService.setProjectObs("Agenda Digital Transversal");
    this.consultarRoles();
    this._usuario = JSON.parse(sessionStorage.getItem('usuario') as string) as Usuario;
    this.varid = this.activerouter.snapshot.paramMap.get('id');
    this.currentroute = this.router.url;
    this.isedit = this.router.url.indexOf('guarda') > 0 ? false : true;
    this.userdata.controls['usuario'].setValue('');
    this.userdata.controls['password'].setValue('');
    this.userdata.controls['estatus'].setValue("true");
    this.userdata.controls['unidadmedica'].setValue(this._usuario.unidadMedica);
    if (this.isedit) {
      this.buscarusuario(this.varid);
    }

  }

  cargaprincipal() {
    this.varid = this.activerouter.snapshot.paramMap.get('id');
    this.currentroute = this.router.url;
    this.isedit = this.router.url.indexOf('guarda') > 0 ? false : true;
  }

  get f() {
    return this.userdata.controls;
  }

  update(e: any) {
    this.rolselected = e.target.value;
    console.log(this.rolselected);
  }

  callback = () =>{
    this.regresar();
  }

  buscarusuario(id: number) {
    this.msjLoading("Cargando...");
    this.userservice.consultaUsuario(id).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.userdata.setValue({
          idusuario: resp.cve_personal,
          matricula: resp.matricula,
          usuario: resp.usuario,
          password: resp.des_password,
          nombres: resp.nom_nombre,
          primerapellido: resp.nom_primer_apellido,
          segundoapellido: resp.nom_segundo_apellido,
          correo: resp.email,
          unidadmedica: resp.des_unidad_medica,
          rol: resp.adtc_roles.cve_rol,
          estatus: resp.ind_estatus.toString(),
          puesto: resp.des_puesto,
          escuelaprocd: resp.des_escuela_procedencia,
        });
        this.rolselected = resp.adtc_roles.cve_rol;
        //this.userdata.controls['matricula'].setValue(resp.des_matricula);
        Swal.close();
      },
      error: (err) => {
        Swal.close();
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_BUSCA_USR, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR, null);
      },
    });
  }

  guardausuario() {
    if (this.isedit) {
      this.actualizausuario();
    } else {
      this.submitted = true;

      if (this.userdata.valid) {
        this.msjLoading("Cargando...");
        let data = {
          nom_primer_apellido: this.userdata.value.primerapellido,
          nom_segundo_apellido: this.userdata.value.segundoapellido,
          nom_nombre: this.userdata.value.nombres,
          matricula: this.userdata.value.matricula,
          nombreCompleto:
            this.userdata.value.nombres +
            ' ' +
            this.userdata.value.primerapellido +
            ' ' +
            this.userdata.value.segundoapellido,
          usuario: this.userdata.value.usuario,
          email: this.userdata.value.correo,
          des_password: this.userdata.value.password,
          des_unidad_medica: this.userdata.value.unidadmedica,
          ind_estatus: this.userdata.value.estatus,
          des_puesto: this.userdata.value.puesto,
          des_escuela_procedencia: this.userdata.value.escuelaprocd,
          adtc_roles: { cve_rol: this.rolselected },
        };
        this.userservice.guardaUsuario(data).subscribe({
          next: (resp: any) => {
            console.log(resp);
            Swal.close();
            this.muestraAlerta(this._Mensajes.MSJ_EXITO_GUARDA_USR, this._Mensajes.ALERT_SUCCESS, this._Mensajes.EXITO, this.callback);

          },
          error: (err) => {
            console.log(err);
            Swal.close();
            this.muestraAlerta(this._Mensajes.MSJ_ERROR_GUARDA_USR, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR, null);
          }
        });
      } else {
        this.muestraAlerta(this._Mensajes.MSJ_DATOS_OBLIGATORIOS, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR, null);
      }
    }
  }

  actualizausuario() {
    this.submitted = true;

    if (this.userdata.valid) {
      this.msjLoading("Cargando...");
      let data = {
        nom_primer_apellido: this.userdata.value.primerapellido,
        nom_segundo_apellido: this.userdata.value.segundoapellido,
        nom_nombre: this.userdata.value.nombres,
        matricula: this.userdata.value.matricula,
        nombreCompleto:
          this.userdata.value.nombres +
          ' ' +
          this.userdata.value.primerapellido +
          ' ' +
          this.userdata.value.segundoapellido,
        usuario: this.userdata.value.usuario,
        email: this.userdata.value.correo,
        des_password: this.userdata.value.password,
        des_unidad_medica: this.userdata.value.unidadmedica,
        ind_estatus: this.userdata.value.estatus,
        des_puesto: this.userdata.value.puesto,
        des_escuela_procedencia: this.userdata.value.escuelaprocd,
        adtc_roles: { cve_rol: this.rolselected },
      };
      this.userservice.actualizaUsuario(this.varid, data).subscribe({
        next: (resp: any) => {
          console.log(resp);
          Swal.close();
          this.muestraAlerta(this._Mensajes.MSJ_EXITO_EDITA_USR, this._Mensajes.ALERT_SUCCESS, this._Mensajes.EXITO, this.callback);
        },
        error: (err) => {
          console.log(err);
          Swal.close();
          this.muestraAlerta(this._Mensajes.MSJ_ERROR_EDITA_USR, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR, null);
        }
      });
    } else {
      this.muestraAlerta(this._Mensajes.MSJ_DATOS_OBLIGATORIOS, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR, null);
    }
  }

  private msjLoading(titulo: string) {
    Swal.fire({
      title: titulo,

      didOpen: () => {
        Swal.showLoading();
      }
    })
  }

  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string, funxion?:any) {
    this.alert = new objAlert;
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

  cancelar() {
    this.regresar();
  }

  regresar() {
    var ruta: string = '/buscauser';
    if (this.isedit) {
      ruta = '/consultauser/' + this.varid;
    }
    this.router.navigateByUrl(ruta, { skipLocationChange: true });
  }

  onKeyUpEvent(event: any) {
    this.userdata.controls['usuario'].setValue(event.target.value);
    this.userdata.controls['password'].setValue(event.target.value);
    // this.userdata.patchValue({
    //   usuario:event.target.value,
    //   password:event.target.value
    // });
    // this.userdata.setValue({
    //   usuario: event.target.value,
    //   password: event.target.value
    // });
    //console.log(this.userdata);
  }

  consultarRoles() {
    this.userservice.getRoles().subscribe({
      next: (resp: any) => {
        //console.log(resp);
        this.lstRoles = resp;
      },
      error: (err) => {
        console.log(err);
        this.lstRoles = [];
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_ROLES_USR, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR, null);
      }
    });
  }
}
