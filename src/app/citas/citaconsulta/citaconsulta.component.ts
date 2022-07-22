import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { objAlert } from '../../common/alerta/alerta.interface';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { DataTableDirective } from 'angular-datatables';
import { CitasService } from '../citas.service';
import { DatePipe, formatDate } from '@angular/common';
import { CitaResponse, ParticipanteCita } from 'src/app/models/cita-model';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth-service.service';
import { HelperMensajesService } from '../../services/helper.mensajes.service';
import { Usuario } from 'src/app/models/usuario.model';


declare var $: any;
declare var $gmx: any;

@Component({
  selector: 'app-citaconsulta',
  templateUrl: './citaconsulta.component.html',
  styleUrls: ['./citaconsulta.component.css']
})
export class CitaconsultaComponent implements OnInit {

  alert!: objAlert;
  varid!: any;
  varidcalendario!: any;
  private _usuario!: Usuario;

  datoscita = {
    'Fecha y hora de inicio de cita': '',
    'Fecha y hora de finalización de cita': '',
    'Duración de cita': '',
    'Ubicación (Lugar de atención)': '',
    'Dirección': '',
    'Unidad médica': '',
    'Estatus de cita': '',
    'Turno': '',
    'Servicio': '',
    'Programa': '',
    'Ocasión de servicio': '',
    'Tipo de cita': '',
    'Trabajadora social responsable': '',
    'Modalidad': ''
  }

  participantes_fam: Array<ParticipanteCita> = [];
  participantes_otrs: Array<ParticipanteCita> = [];
  strpaciente: string = "";

  mod_mensaje: string = "";
  objmodal = {
    mensaje: "",
    tipo: 0
  };

  public keepOriginalOrder = (a: { key: any; }, b: any) => a.key;

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private http: HttpClient, private router: Router,
    private activerouter: ActivatedRoute,
    private citaservice: CitasService,
    public datePipe: DatePipe,
    private _Mensajes: HelperMensajesService) {
    this.authService.userLogged$.next(true);
    this.authService.isAuthenticatedObs$.next(true);
  }

  ngOnInit(): void {
    this.authService.setProjectObs("Agenda Digital Transversal");
    let estatus = localStorage.getItem('catalogosCompletos');
    if (estatus === 'false') {
      this.router.navigate(["/catalogos/cargaCatalogos/1"], { skipLocationChange: true });
    } else {
      this.varid = this.activerouter.snapshot.paramMap.get('id');
      this._usuario = JSON.parse(sessionStorage.getItem('usuario') as string) as Usuario;
      //console.log("usr:", this._usuario);
      this.buscarcita(this.varid);
    }
  }

  regresar() {
    this.router.navigateByUrl('/buscacita');
  }

  citaResponse: CitaResponse;
  buscarcita(id: number) {
    this.msjLoading("Cargando...");
    this.strpaciente = "";
    this.citaResponse = new CitaResponse();
    this.citaservice.consultacita(id).subscribe({
      next: (resp: CitaResponse) => {
        //console.log("buscarCita: ", resp);

        //console.log("inicio: ",this.datePipe.transform(new Date(resp.cita.fechaInicio + " " + resp.cita.horaInicio), 'dd-MM-yyyy - HH:mm:ss') );
        this.citaResponse = resp;
        this.citaResponse.cita.fechaInicio = this.datePipe.transform(new Date(resp.cita.fechaInicio + " " + resp.cita.horaInicio), 'dd-MM-yyyy - HH:mm:ss');
        this.citaResponse.cita.fechaFin = this.datePipe.transform(new Date(resp.cita.fechaFin + " " + resp.cita.horaFin), 'dd-MM-yyyy - HH:mm:ss');
        this.varidcalendario = resp.cita.cveCalendarioAnual;

        /*
        El campo tipo en el objeto participantes se desglosa de la siguiente manera.
        1: Paciente.
        2: Núcleo familiar
        3: otros
        */

        for (var part of this.citaResponse.participantes) {
          if (part.CVE_TIPO_PACIENTE == 1) {
            this.strpaciente = part.NOM_COMPLETO;
          } else if (part.CVE_TIPO_PACIENTE == 3) {
            this.participantes_otrs.push(part);
          } else if (part.CVE_TIPO_PACIENTE == 2) {
            this.participantes_fam.push(part);
          }
        }

        Swal.close();
        //console.log("otros", this.participantes_otrs);
        //console.log("fam", this.participantes_fam);
      },
      error: (err) => {
        Swal.close();
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_CONSULTA_CITA, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
      }
    })

  }

  confirmarcita() {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    this.objmodal.mensaje = "¿Está seguro de confirmar<br/>la asistencia de la cita seleccionada?";
    this.objmodal.tipo = 1;
    $('#content').modal('show')
  }

  cancelarcita() {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    this.objmodal.mensaje = "¿Está seguro de cancelar<br/>la cita seleccionada?";
    this.objmodal.tipo = 2;
    $('#content').modal('show')
  }

  imprimir() {
    if(this.varid && this._usuario.cveUsuario){
      window.open(this.citaservice.obtinerutaimpresioncita(this.varid, this._usuario.cveUsuario), '_blank');
    } else {
      console.log("Warning!", "No se puede mostrar el PDF, falta un parámetro.")
    }

  }

  cancelarmod() {
    this.objmodal.mensaje = "";
    this.objmodal.tipo = 0;
    $('#content').modal('hide');

  }

  aceptarmod() {
    if (this.objmodal.tipo == 2) {
      this.citaservice.cancelarcitacal(this.varidcalendario).subscribe({
        next: (resp: any) => {
          //console.log(resp);

          this.citaservice.cancelarcita(this.varid).subscribe({
            next: (resp: any) => {
              //console.log(resp);
              this.objmodal.mensaje = "";
              this.objmodal.tipo = 0;
              $('#content').modal('hide');

              this.muestraAlerta(this._Mensajes.MSJ_EXITO_CANCELAR_CITA, this._Mensajes.ALERT_SUCCESS, this._Mensajes.EXITO, this.callback);
            },
            error: (err) => {
              this.objmodal.mensaje = "";
              this.objmodal.tipo = 0;
              $('#content').modal('hide');

              this.muestraAlerta(err.error.mensaje ? err.error.mensaje : this._Mensajes.MSJ_ERROR_CANCELAR_CITA, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
            }
          })
        },
        error: (err) => {
          this.objmodal.mensaje = "";
          this.objmodal.tipo = 0;
          $('#content').modal('hide');

          this.muestraAlerta(this._Mensajes.MSJ_ERROR_CANCELAR_CITA, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
        }
      })

    } else {
      this.citaservice.confirmarasistencia(this.varid).subscribe({
        next: (resp: any) => {
          //console.log(resp);

          this.objmodal.mensaje = "";
          this.objmodal.tipo = 0;
          $('#content').modal('hide');

          if (resp.estatus == true) {
            this.muestraAlerta(this._Mensajes.MSJ_EXITO_CONFIRMAR_CITA, this._Mensajes.ALERT_SUCCESS, this._Mensajes.EXITO, this.callback);
          } else {
            this.muestraAlerta(resp.mensaje ? resp.mensaje : this._Mensajes.MSJ_ERROR_CONFIRMAR_CITA, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
          }


        },
        error: (err) => {
          this.objmodal.mensaje = "";
          this.objmodal.tipo = 0;
          $('#content').modal('hide');

          this.muestraAlerta(this._Mensajes.MSJ_ERROR_CONFIRMAR_CITA, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
        }
      })
    }

  }

  callback = () => {
    this.regresar();
  }

  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string, funxion?: any) {
    this.alert = new objAlert;
    this.alert = {
      message: mensaje,
      type: estilo,
      visible: true,
      typeMsg: tipoMsj
    }
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false
      }
      if (funxion != null) {
        funxion();
      }
    }, 2000);
  }


  private msjLoading(titulo: string) {
    Swal.fire({
      title: titulo,

      didOpen: () => {
        Swal.showLoading();
      }


    })
  }


}
