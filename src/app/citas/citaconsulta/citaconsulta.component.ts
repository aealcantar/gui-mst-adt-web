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

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient, private router: Router,
    private activerouter: ActivatedRoute,
    private citaservice: CitasService,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    // this.datoscita = {
    //   'Fecha y hora de inicio de cita': '29/03/2022 - 10:00:00',
    //   'Fecha y hora de finalización de cita': '10:30:00',
    //   'Duración de cita': '30:00',
    //   'Ubicación (Lugar de atención)': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusumod',
    //   'Dirección': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusumod tempor',
    //   'Unidad médica': 'Lorem ipsum dolor sit amet, consectetur',
    //   'Estatus de cita': 'Lorem ipsum',
    //   'Turno': 'Lorem ipsum',
    //   'Servicio': 'Adrian Cristian',
    //   'Programa': 'Lorem ipsum',
    //   'Ocasión de servicio': 'Inicial',
    //   'Tipo de cita': 'Individual',
    //   'Trabajadora social responsable': 'Roberto Garcia',
    //   'Modalidad': 'Presencial'
    // };
    this.varid = this.activerouter.snapshot.paramMap.get('id');
    this.buscarcita(this.varid);
  }

  regresar() {
    this.router.navigateByUrl('/buscacita', {skipLocationChange: true});
  }

  citaResponse: CitaResponse;
  buscarcita(id: number) {
    this.msjLoading("Cargando...");
    this.strpaciente= "";
    this.citaResponse = new CitaResponse();
    this.citaservice.consultacita(id).subscribe({
      next: (resp: CitaResponse) => {
        console.log("buscarCita: ", resp);

        //console.log("inicio: ",this.datePipe.transform(new Date(resp.cita.fechaInicio + " " + resp.cita.horaInicio), 'dd-MM-yyyy - HH:mm:ss') );
        this.citaResponse = resp;
        this.citaResponse.cita.fechaInicio = this.datePipe.transform(new Date(resp.cita.fechaInicio + " " + resp.cita.horaInicio), 'dd-MM-yyyy - HH:mm:ss') ;
        this.citaResponse.cita.fechaFin = this.datePipe.transform(new Date(resp.cita.fechaFin + " " + resp.cita.horaFin), 'dd-MM-yyyy - HH:mm:ss') ;

        // this.datoscita = {
        //   'Fecha y hora de inicio de cita': resp.cita.fechaInicio ? this.datePipe.transform(new Date(resp.cita.fechaInicio + " " + resp.cita.horaInicio), 'dd-MM-yyyy - HH:mm:ss') : "",
        //   'Fecha y hora de finalización de cita': resp.cita.fechaFin ? this.datePipe.transform(new Date(resp.cita.fechaFin + " " + resp.cita.horaFin), 'dd-MM-yyyy - HH:mm:ss') : "",
        //   'Duración de cita': resp.cita.duracion,
        //   'Ubicación (Lugar de atención)': resp.cita.ubicacion,
        //   'Dirección': resp.cita.direccion,
        //   'Unidad médica': resp.cita.unidadMedica,
        //   'Estatus de cita': resp.cita.estatus,
        //   'Turno': resp.cita.turno,
        //   'Servicio': resp.cita.descripcionServicio,
        //   'Programa': resp.cita.grupoPrograma,
        //   'Ocasión de servicio': resp.cita.ocasionServicio,
        //   'Tipo de cita': resp.cita.tipoCita,
        //   'Trabajadora social responsable': resp.cita.trabajadorSocial,
        //   'Modalidad': resp.cita.modalidad
        // };


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
        console.log("otros", this.participantes_otrs);
        console.log("fam", this.participantes_fam);
      },
      error: (err) => {
        Swal.close();
        this.muestraAlerta(err.error.message.toString(), 'alert-danger', 'Error');
      }
    })

  }

  confirmarcita() {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    //this.mod_mensaje="¿Está seguro de confirmar<br/>la asistencia de la cita seleccionada?"
    this.objmodal.mensaje = "¿Está seguro de confirmar<br/>la asistencia de la cita seleccionada?";
    this.objmodal.tipo = 1;
    $('#content').modal('show')
  }

  cancelarcita() {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    //this.mod_mensaje="¿Está seguro de cancelar<br/>la cita seleccionada?"
    this.objmodal.mensaje = "¿Está seguro de cancelar<br/>la cita seleccionada?";
    this.objmodal.tipo = 2;
    $('#content').modal('show')
  }

  imprimir() { }

  cancelarmod() {
    //this.mod_mensaje = "";
    this.objmodal.mensaje = "";
    this.objmodal.tipo = 0;
    $('#content').modal('hide');

  }

  aceptarmod() {
    if (this.objmodal.tipo == 2) {
      this.citaservice.cancelarcitacal(this.varid).subscribe({
        next: (resp: any) => {
          console.log(resp);

          this.citaservice.cancelarcita(this.varid).subscribe({
            next: (resp: any) => {
              console.log(resp);
              this.objmodal.mensaje = "";
              this.objmodal.tipo = 0;
              $('#content').modal('hide');
              this.muestraAlerta("La cita fué cancelada correctamente", 'alert-success', 'Éxito', this.callback);
            },
            error: (err) => {
              this.objmodal.mensaje = "";
              this.objmodal.tipo = 0;
              $('#content').modal('hide');
              this.muestraAlerta(err.error.mensaje ? err.error.mensaje : err.error.message, 'alert-danger', 'Error');
            }
          })
        },
        error: (err) => {
          this.objmodal.mensaje = "";
          this.objmodal.tipo = 0;
          $('#content').modal('hide');
          this.muestraAlerta(err.error.mensaje ? err.error.mensaje : err.error.message, 'alert-danger', 'Error');
        }
      })

    } else {
      //this.mod_mensaje = "";
      this.objmodal.mensaje = "";
      this.objmodal.tipo = 0;
      $('#content').modal('hide');
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
