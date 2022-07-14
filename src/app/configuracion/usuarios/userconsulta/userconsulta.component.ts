import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { objAlert } from '../../../common/alerta/alerta.interface';
import { AlertaComponent} from '../../../common/alerta/alerta.component' ;
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValue } from '@angular/common';
import { UsuariosService } from '../usuarios.service';
import { AuthService } from 'src/app/service/auth-service.service';
import { HelperMensajesService } from '../../../services/helper.mensajes.service';
import Swal from 'sweetalert2';

declare var $:any;

interface Usuarios{
  matricula: string,
  nombre: string,
  rolsistema: string,
  rolinstituto: string
}

@Component({
  selector: 'app-userconsulta',
  templateUrl: './userconsulta.component.html',
  styleUrls: ['./userconsulta.component.css']
})
export class UserconsultaComponent implements OnInit {
  alert!: objAlert;
  varid!: any;
  lstUsuarios!: Usuarios[];

  objectKeys = Object.keys;
  items = { 'Matrícula': '', 'Usuario': '', 'Contraseña': '',
  'Nombre(s)':'', 'Primer apellido':'', 'Segundo apellido': '',
  'Correo electrónico': '', 'Unidad médica': '',
  'Rol': '', 'Estatus': '', 'Puesto': '',
  'Escuela de procedencia': '' };

  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

  public keepOriginalOrder = (a: { key: any; }, b: any) => a.key;

  constructor(private authService: AuthService,
    private http: HttpClient, private router: Router,
    private activerouter: ActivatedRoute,
    private userservice: UsuariosService,
    private _Mensajes: HelperMensajesService) { }



  ngOnInit(): void {
    this.authService.setProjectObs("Agenda Digital Transversal");
    this.varid = this.activerouter.snapshot.paramMap.get('id');
    this.buscarusuario(this.varid);
  }

  buscarusuario(id: number){
    this.msjLoading("Cargando...");
    this.userservice.consultaUsuario(id).subscribe({
      next: (resp:any) => {
        console.log(resp);
        this.items.Matrícula = resp.matricula;
        this.items.Usuario = resp.usuario;
        this.items.Contraseña = resp.des_password;
        this.items['Nombre(s)'] = resp.nom_nombre;
        this.items['Primer apellido'] = resp.nom_primer_apellido;
        this.items['Segundo apellido'] = resp.nom_segundo_apellido;
        this.items['Correo electrónico'] = resp.email;
        this.items['Unidad médica'] = resp.des_unidad_medica;
        this.items.Rol = resp.adtc_roles.des_rol;
        this.items.Estatus = resp.ind_estatus? 'Activo' : 'Inactivo';
        this.items.Puesto = resp.des_puesto;
        this.items['Escuela de procedencia'] = resp.des_escuela_procedencia;
        Swal.close();
      },
      error: (err) => {
        Swal.close();
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_CONEXION_USR, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
      }
    })
  }

  editarusuario() {
    if(this.items.Matrícula != ''){
      this.router.navigateByUrl("/editauser/" + this.varid);
    }
  }

  regresaconsulta(){
    this.router.navigateByUrl("/buscauser");
  }

  private msjLoading(titulo: string) {
    Swal.fire({
      title: titulo,

      didOpen: () => {
        Swal.showLoading();
      }
    })
  }

  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string){
    this.alert = new objAlert;
    this.alert = {
      message: mensaje,
      type: estilo,
      visible: true,
      typeMsg: tipoMsj
    }
    setTimeout(() => {
      this.alert = {
        message:'',
        type: 'custom',
        visible: false
      }
    }, 2000);
  }

}
