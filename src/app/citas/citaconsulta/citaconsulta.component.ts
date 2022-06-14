import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { objAlert } from '../../common/alerta/alerta.interface';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { DataTableDirective } from 'angular-datatables';
import { CitasService } from '../citas.service';
import { DatePipe, formatDate } from '@angular/common';


declare var $:any;
declare var $gmx:any;

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

  participantes_fam: Array<any> = [];
  participantes_otrs: Array<any> = [];
  strpaciente: string = "";

  mod_mensaje: string = "";

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

  regresar(){
    this.router.navigate(['/buscacita']);
  }

  buscarcita(id: number){
    this.citaservice.consultacita(id).subscribe({
      next: (resp:any) => {
        console.log(resp);
        this.datoscita = {
          'Fecha y hora de inicio de cita': resp.cita.fechaInicio? this.datePipe.transform(new Date(resp.cita.fechaInicio + " " + resp.cita.horaInicio), 'dd-MM-yyyy - HH:mm:ss')  : "",
          'Fecha y hora de finalización de cita': resp.cita.fechaFin? this.datePipe.transform(new Date(resp.cita.fechaFin + " " + resp.cita.horaFin), 'dd-MM-yyyy - HH:mm:ss')  : "",
          'Duración de cita': resp.cita.duracion,
          'Ubicación (Lugar de atención)': resp.cita.ubicacion,
          'Dirección': resp.cita.direccion,
          'Unidad médica': resp.cita.unidadMedica,
          'Estatus de cita': resp.cita.status,
          'Turno': resp.cita.turno,
          'Servicio': resp.cita.descripcionServicio,
          'Programa': resp.cita.grupoPrograma,
          'Ocasión de servicio': resp.cita.ocacionServicio,
          'Tipo de cita': resp.cita.tipoCita,
          'Trabajadora social responsable': resp.cita.trabajadorSocial,
          'Modalidad': resp.cita.modalidad
        };

        for(var part of resp.participantes){
          if(part.ind_paciente !== null){
            this.strpaciente = part.nom_nombre_completo;
          }else if(part.ind_otros && part.ind_paciente == null){
            this.participantes_otrs.push(part);
          } else if(part.ind_otros == false && part.ind_paciente == null){
            this.participantes_fam.push(part);
          }
        }
      },
      error: (err) => {
        this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })

  }

  confirmarcita(){
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    this.mod_mensaje="¿Está seguro de confirmar<br/>la asistencia de la cita seleccionada?"
    $('#content').modal('show')
  }

  cancelarcita(){
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    this.mod_mensaje="¿Está seguro de cancelar<br/>la cita seleccionada?"
    $('#content').modal('show')
  }

  imprimir(){}

  cancelarmod(){
    this.mod_mensaje = "";
    $('#content').modal('hide');

  }

  aceptarmod(){
    this.mod_mensaje = "";
    $('#content').modal('hide');

  }

  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string){
    // this.alert = new objAlert;
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
