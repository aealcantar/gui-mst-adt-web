import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';


import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HorarioService } from '../services/horarios/horario.service';
import { HorarioDias, HorarioNuevoRequest } from '../models/horario-dias.model';
import { Horario } from '../models/horario.model';
import { HorarioRequest } from '../models/horario-request.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HorarioResponse } from '../models/horario-response-model';
import { objAlert } from '../common/alerta/alerta.interface';
import { HelperMensajesService } from '../services/helper.mensajes.service';
import Swal from 'sweetalert2';
import { AgendaService } from '../services/agenda/agenda-service';

import { TurnoResponse } from '../models/turno-response-model';

import { HorarioTurno } from '../models/horario.turno.model';
import { HorarioStatus } from '../models/horario.status.model';
import { AuthService } from '../service/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { UbicacionesService } from '../services/ubicaciones/ubicaciones.service';

declare var $: any;
interface LooseObject {
  [key: string]: any
}

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {
  cveUbicacion!: any;
  public diaSeleccionado: HorarioDias;
  public diaNb: number;
  public request: HorarioRequest;
  public semana: Array<string> = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
  public dia: string = '';
  mensaje!: objAlert;

  public HORA_INICIO: number = 9;
  public HORA_FIN: number = 18;
  horarioInicialSeleccionado: string;
  estatusActivoSeleccionado: boolean;
  estatusBloqueadoSeleccionado: boolean;
  diainhabil: LooseObject = {};

  formfields: any = this.formBuilder.group({
    horainicio: ['', Validators.required],
    horafin: [''],
    duracion: ['', Validators.required],
    turno: ['', Validators.required],
    estatus: ['', Validators.required]
  });
  constructor(private formBuilder: FormBuilder,
    private _Mensajes: HelperMensajesService,
    private horarioService: HorarioService,
    private _agendaService: AgendaService,
    private ubicacionService:UbicacionesService,
    private authService: AuthService,
    private activerouter: ActivatedRoute,
    private router: Router,
    private http: HttpClient, private modalService: NgbModal) {

    this.diaNb = (new Date()).getDay();
    this.obtieneDia(this.diaNb)

    console.log("dia: ", this.diaNb);
    this.authService.setProjectObs("Agenda Digital Transversal");
    this.turnoNuevo = new HorarioTurno();

  }


  ngOnInit(): void {
    
    this.cveUbicacion = this.activerouter.snapshot.paramMap.get('cveUbicacion');
    console.log(" id "+this.cveUbicacion);

    this.horarioNuevo = new Horario();
    this.horarioSeleccionado = new Horario();
    this.turnoSeleccionado = new HorarioTurno();

    this.turnoNuevo = new HorarioTurno();
    this.obtenerLstTurnos();
    this.obtenerLstHorarioInicial();
    this.obtenerLstDuracion();

    this.diaSeleccionado = new HorarioDias();
    this.mensaje = new objAlert;
    //this.diaSeleccionado=null;
    this.obtenerHorarioporUbicacionDia(this.cveUbicacion,this.dia);
    //this.obtenerHorarioporDia(this.dia)
  }


  opciones: boolean[] = [true, false];
  horarioSeleccionado: Horario;
  lstHorariosNuevos: HorarioNuevoRequest;
  turnoSeleccionado: HorarioTurno;
  turnoNuevo: HorarioTurno;

  seleccionafila(fila: any) {

    this.horarioSeleccionado = this.diaSeleccionado.horarios[fila];
    this.turnoSeleccionado = this.horarioSeleccionado.turno;
    if (this.horarioSeleccionado.estatus.cveIdEstatus == 6) {
      this.blnHabil = false;
    } else {
      this.blnHabil = true;
    }

    if (this.blnHabil) {
      this.blnNuevo = false;
      $('#horario').modal({
        keyboard: false,
        backdrop: 'static'
      })
      $('#horario').modal('show')
      this.msjLoading("Cargando...");
      this.obtenerLstHorarioFinal();
      if (this.horarioSeleccionado.estatus.cveIdEstatus == 4) {
        this.estatusActivoSeleccionado = true;
      } else {
        this.estatusActivoSeleccionado = false;
      }
      if (this.horarioSeleccionado.estatus.cveIdEstatus == 5) {
        this.estatusBloqueadoSeleccionado = true;
      } else {
        this.estatusBloqueadoSeleccionado = false;
      }

      console.log("horario: ", this.horarioSeleccionado);
      console.log("estatusBloqueadoSeleccionado: ", this.estatusBloqueadoSeleccionado);
      console.log("estatusActivoSeleccionado: ", this.estatusActivoSeleccionado);

      Swal.close();
    }else{
      this.mostrarMensaje(this._Mensajes.ALERT_DANGER,this._Mensajes.MSJ_ERROR_EDITAR_HORARIO,this._Mensajes.ERROR );
    }
  }

  lblBtnHabilitar: string = 'Inhabilitar día';
  lblHabilitar: string = 'inhabilitar';

  getHorariosByDia(diasHorarios: HorarioDias, dia: number) {
    return diasHorarios.horarios.find(horario => horario.dia == this.semana[dia]);

  }

  private obtieneDia(dia: number) {
    this.dia = this.semana[dia];
  }
  regresaconsulta(){
    this.router.navigate(['/catalogos/ConfiguracionUbicaciones/']);
  }
  async receiveMessage(evento: number) {
    console.log("recibimos el dia a consultar " + evento);
    this.diaNb = evento;
    this.obtieneDia(evento)
    this.obtenerHorarioporUbicacionDia(this.cveUbicacion,this.dia);
    //this.obtenerHorarioporDia(this.dia);
  }

  private obtenerHorarioporUbicacionDia(cveUbicacion:number,dia: string) {
    this.msjLoading("Cargando...");
    this.ubicacionService.getHorariosByIdUbicacion(cveUbicacion, dia).subscribe((resp: any) => {
      this.diaSeleccionado.horarios = resp.data;
      console.log(this.diaSeleccionado.horarios);
      switch (resp.code) {
        case 200:
          if (resp.data.length > 0) {
            this.diaSeleccionado.horarios.forEach(data => {

              data.horaInicial = data.horaInicial.trim();
              data.horaFinal = data.horaFinal.trim();
            });

            console.log("horarios: ", this.diaSeleccionado.horarios);
          }else{
            this.mostrarMensaje(this._Mensajes.ALERT_DANGER,this._Mensajes.MSJ_MSG023,this._Mensajes.INFO);
          }
          Swal.close();
          break;
        case 204:
          this.diaSeleccionado = null;
          this.mostrarMensaje(this._Mensajes.ALERT_DANGER,this._Mensajes.MSJ_MSG023,this._Mensajes.INFO);
          Swal.close();
          break;
        default:
          let error: HttpErrorResponse = {
            status: resp.code,
            message: resp.message,
            name: 'HttpErrorResponse',
            error: undefined,
            ok: false,
            headers: new HttpHeaders,
            statusText: '',
            url: '',
            type: HttpEventType.ResponseHeader
          };


          this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_HORARIO);
          Swal.close();
          break;
      }

      this.validarDia();
    }, (error: HttpErrorResponse) => {
      this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_HORARIO);
      Swal.close();
    });
  }


  private obtenerHorarioporDia(dia: string) {
    this.msjLoading("Cargando...");
    this.horarioService.getHorariosByDia(dia).subscribe((resp: HorarioResponse) => {
      this.diaSeleccionado.horarios = resp.data;
      console.log(this.diaSeleccionado.horarios);
      switch (resp.code) {
        case 200:
          if (resp.data.length > 0) {
            this.diaSeleccionado.horarios.forEach(data => {

              data.horaInicial = data.horaInicial.trim();
              data.horaFinal = data.horaFinal.trim();
            });

            console.log("horarios: ", this.diaSeleccionado.horarios);
          }
          Swal.close();
          break;
        case 204:
          this.diaSeleccionado = null;
          //pintar en el front no existen horarios configurados.
          Swal.close();
          break;
        default:
          let error: HttpErrorResponse = {
            status: resp.code,
            message: resp.message,
            name: 'HttpErrorResponse',
            error: undefined,
            ok: false,
            headers: new HttpHeaders,
            statusText: '',
            url: '',
            type: HttpEventType.ResponseHeader
          };


          this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_HORARIO);
          Swal.close();
          break;
      }

      this.validarDia();
    }, (error: HttpErrorResponse) => {
      this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_HORARIO);
      Swal.close();
    });
  }

  private validarDia() {

    let cont: number = 0;
    for (let horario of this.diaSeleccionado.horarios) {
      if (horario.estatus.cveIdEstatus == 6) {
        cont = cont + 1;
      }
    }

    if (cont != 0) {
      this.blnHabil = false;
      this.lblBtnHabilitar = 'Habilitar día';
      this.lblHabilitar = 'habilitar';
    } else {
      this.blnHabil = true;
      this.lblBtnHabilitar = 'Inhabilitar día';
      this.lblHabilitar = 'inhabilitar';

    }

    this.diainhabil = {
      dia: this.diaNb,
      inhabil: !this.blnHabil
    };

  }

  updateEstatusDia() {
    this.msjLoading(this.lblBtnHabilitar + "...");
    this.request = new HorarioRequest();
    this.request.dia = this.semana[this.diaNb];

    let result = this.diaSeleccionado.horarios.find(horario => horario.estatus.cveClave == "DIA_DESHABILITADO");
    if (result == null) {
      this.request.estatus = "DIA_DESHABILITADO";

    }
    else {

     this.request.estatus = "DIA_HABILITADO";

    }

    this.horarioService.modificarEstatusDia(this.request).subscribe((resp) => {
      switch (resp.body.code) {
        case 200:


          console.log("pintar alerta de exito");

          this.obtenerHorarioporDia(this.dia);

          Swal.close();
          break;

        default:
          let error: HttpErrorResponse = {
            status: resp.body.code,
            message: resp.body.message,
            name: 'HttpErrorResponse',
            error: undefined,
            ok: false,
            headers: new HttpHeaders,
            statusText: '',
            url: '',
            type: HttpEventType.ResponseHeader
          };


          this.mensajesError(error, resp.body.message);
          Swal.close();
          break;
      }



    }, (error: HttpErrorResponse) => {

      Swal.close();
      this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_HORARIO);
    });

  }


  // lstHorarioInicial: string[] = new Array();
  lstHorarioInicial: string[] = new Array();
  horaInicial = new Date();
  private obtenerLstHorarioInicial() {
    this.msjLoading("Cargando...");
    this.horaInicial = new Date();
    this.lstHorarioInicial = new Array();
    this.horaInicial.setHours(this.HORA_INICIO);
    this.horaInicial.setMinutes(0);
    console.log(this.horaInicial);
    let tiempo = 5;
    let hora: string = "0" + this.horaInicial.getHours() + ":0" + this.horaInicial.getMinutes();
    this.lstHorarioInicial.push(hora);
    for (let i = 9; i <= 30; i++) {

      this.horaInicial.setMinutes(this.horaInicial.getMinutes() + tiempo);

      if (this.horaInicial.getHours() < 10) {
        hora = "0" + this.horaInicial.getHours() + ":";
      } else {
        hora = this.horaInicial.getHours() + ":";
      }
      if (this.horaInicial.getMinutes() < 10) {
        hora = hora + '0' + this.horaInicial.getMinutes();
      } else {
        hora = hora + this.horaInicial.getMinutes();
      }
      this.lstHorarioInicial.push(hora);
      console.log(this.horaInicial.getHours() + ":" + this.horaInicial.getMinutes());
    }



    // this.lstHorarioInicial = [' 09:00', '09:15', ' 09:30', ' 09:45',' 18:00'];
    Swal.close();
  }

  blnNuevo: boolean = true;

  lstDuracion: number[] = new Array();
  private obtenerLstDuracion() {
    this.msjLoading("Cargando...");
    this.lstDuracion = new Array();
    let x = 10;
    for (let i: number = 1; i <= 6; i++) {
      x = x + 5;
      this.lstDuracion.push(Number(x));
    }
    Swal.close();
  }

  lstHorarioFinal: string[] = new Array();
  horaFinal = new Date();
  public actualizarLstHorarioFinal(){
    this.horarioSeleccionado.horaFinal = undefined;
    this.obtenerLstHorarioFinal();
  }
  public obtenerLstHorarioFinal() {
    this.lstHorarioFinal = new Array();

    this.msjLoading("Generando horario final...");
    let horarioAux: Horario;
    let aux: any;
    let tiempo: number;
    if (this.blnNuevo) {
      horarioAux = this.horarioNuevo;
      aux = this.horarioNuevo.horaInicial.split(':');
      tiempo = Number(this.horarioNuevo.duracion);
    } else {
      horarioAux = this.horarioSeleccionado;
      aux = this.horarioSeleccionado.horaInicial.split(':');
      tiempo = Number(this.horarioSeleccionado.duracion);
    }
    if (horarioAux.duracion) {
      this.horaFinal = new Date();




      this.horaFinal.setHours(Number(aux[0]));
      this.horaFinal.setMinutes(Number(aux[1]));


      let hora: string = this.horaFinal.getHours() + ":0" + this.horaFinal.getMinutes();

      for (let i = 1; i <= 40; i++) {
        this.horaFinal.setMinutes(this.horaFinal.getMinutes() + tiempo);
        if (this.horaFinal.getHours() >= Number(aux[0]) && this.horaFinal.getHours() < this.HORA_FIN) {


          if (this.horaFinal.getHours() < 10) {
            hora = "0" + this.horaFinal.getHours() + ":";
          } else {
            hora = this.horaFinal.getHours() + ":";
          }
          if (this.horaFinal.getMinutes() < 10) {
            hora = hora + '0' + this.horaFinal.getMinutes();
          } else {
            hora = hora + this.horaFinal.getMinutes();
          }
          this.lstHorarioFinal.push(" " + hora);
        } else {
          break;
        }
      }
    }
    Swal.close();
  }



  lstTurnos: TurnoResponse[] = new Array();
  private obtenerLstTurnos() {
    this.msjLoading("Cargando...");
    this._agendaService.getLstTurnos().subscribe((resp: TurnoResponse[]) => {


      if (resp) {
        this.lstTurnos = resp;
        console.log(this.lstTurnos);
        Swal.close();
      }

    }, (error: HttpErrorResponse) => {
      this.lstTurnos = new Array();
      this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_TURNOS);
      Swal.close();
    });
  }

  private guardarHorario() {
    this.cambiarTurno();
    this.cambiarEstatus();
    this.horarioSeleccionado.turno = this.turnoSeleccionado;
    console.log(this.horarioSeleccionado);
    this.msjLoading("Guardando...");
    this.horarioService.save(this.horarioSeleccionado).subscribe((resp: HttpResponse<HorarioResponse>) => {


      if (resp) {
        switch (resp.body.code) {
          case 201:
            this.mostrarMensaje(this._Mensajes.ALERT_SUCCESS, this._Mensajes.MSJ_ERROR_EDITAR_EXITOSO_HORARIO, this._Mensajes.EXITO);
            break;

          default:
            this.mostrarMensaje(this._Mensajes.ALERT_DANGER, resp.body.message, this._Mensajes.ERROR);
            break;
        }
        console.log(resp);

        $('#horario').modal('hide')
        Swal.close();
      }
      this.obtenerHorarioporDia(this.dia);
    }, (error: HttpErrorResponse) => {
      this.lstTurnos = new Array();
      this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_HORARIO);
      $('#horario').modal('hide')
      Swal.close();
    });
  }

  private nuevoHorario() {


    this.msjLoading("Guardando...");
    this.horarioService.saveLstHorarios(this.lstHorariosNuevos).subscribe((resp: HttpResponse<HorarioResponse>) => {


      if (resp) {
        switch (resp.body.code) {
          case 200:
            this.mostrarMensaje(this._Mensajes.ALERT_SUCCESS, "El horario se creó exitosamente", this._Mensajes.EXITO);
            break;

          default:
            this.mostrarMensaje(this._Mensajes.ALERT_DANGER, resp.body.message, this._Mensajes.ERROR);
            break;
        }
        console.log(resp);

        $('#content').modal('hide')
        Swal.close();
      }
      this.obtenerHorarioporDia(this.dia);
    }, (error: HttpErrorResponse) => {
      $('#content').modal('hide')

      this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_HORARIO);
      Swal.close();
    });
  }



  private mostrarMensaje(tipo: string, msj: string, tipoMsj?: string) {
    this.mensaje = new objAlert;
    this.mensaje.visible = true;
    this.mensaje.type = tipo;
    this.mensaje.message = msj;
    this.mensaje.typeMsg = tipoMsj;
    console.log(this.mensaje);
    setTimeout(() => {
      this.mensaje.visible = false;
    }, 4500);

  }

  private mensajesError(error: HttpErrorResponse, msj: string) {

    switch (error.status) {
      case 400:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_400, this._Mensajes.ERROR400);
        break;
      case 403:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_403, this._Mensajes.ERROR403);
        break;

      case 404:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_404, this._Mensajes.ERROR404);
        break;
      case 500:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_500, this._Mensajes.ERROR500);
        break;
      case 503:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_503, this._Mensajes.ERROR503);
        break;

      default:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, msj, "Error " + error.status);
        break;
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



  blnHabil: boolean = true;
  btnModalInhabilitar() {

    $('#inhabilitar').modal({
      keyboard: false,
      backdrop: 'static'
    })
    $('#inhabilitar').modal('show')
  }

  btnHabilitarDeshabilitar() {
    this.updateEstatusDia();
  }
  btnCancelarHabilitarDeshabilitar() {

    $('#inhabilitar').modal('hide')

  }

  btnCancelar() {

    $('#content').modal('hide')

  }

  dia1: boolean = false;
  dia2: boolean = false;
  dia3: boolean = false;
  dia4: boolean = false;
  dia5: boolean = false;
  dia6: boolean = false;
  dia7: boolean = false;

  horarioNuevo: Horario;
  modalAgregar() {
    this.lstHorarioFinal = new Array();
    this.turnoNuevo = new HorarioTurno();
    this.dia1 = false;
    this.dia2 = false;
    this.dia3 = false;
    this.dia4 = false;
    this.dia5 = false;
    this.dia6 = false;
    this.dia7 = false;
    this.blnNuevo = true;
    this.lstHorariosNuevos = new HorarioNuevoRequest();
    this.horarioNuevo = new Horario();
    this.horarioNuevo.turno = new HorarioTurno;
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    $('#content').modal('show')
  }
  obtenerTurnoNuevo() {
    if (this.turnoNuevo.des_turno) {
      this.turnoNuevo = this.lstTurnos.find(e => e.des_turno === this.turnoNuevo.des_turno);
    } else {
      this.mostrarMensaje(this._Mensajes.ALERT_DANGER, "Seleccione un Turno", this._Mensajes.ERROR);

    }
  }

  cambiarTurno() {
    if (this.turnoSeleccionado.des_turno) {
      this.turnoSeleccionado = this.lstTurnos.find(e => e.des_turno === this.turnoSeleccionado.des_turno);
    } else {
      this.mostrarMensaje(this._Mensajes.ALERT_DANGER, "Seleccione un Turno", this._Mensajes.ERROR);

    }
    console.log(this.turnoSeleccionado);
  }

  cambiarEstatus() {
    let estatus = new HorarioStatus();
    if (this.estatusActivoSeleccionado) {
      estatus.cveIdEstatus = 4;

    } else {
      estatus.cveIdEstatus = 5;

    }
    this.horarioSeleccionado.estatus = estatus;
    console.log(this.turnoSeleccionado);
  }



  pintarTurno() {
    console.log(this.horarioNuevo);
    console.log(this.turnoNuevo);
  }
  btnNuevoHorario() {
    this.lstHorariosNuevos.lstHorarios = new Array();
    console.log("nuevo horario: ", this.horarioNuevo);
    console.log("nuevo dia1: ", this.dia1);
    console.log("nuevo dia2: ", this.dia2);
    console.log("nuevo dia3: ", this.dia3);
    console.log("nuevo dia4: ", this.dia4);
    console.log("nuevo dia5: ", this.dia5);
    console.log("nuevo dia6: ", this.dia6);
    console.log("nuevo dia7: ", this.dia7);

    this.horarioNuevo.turno = this.turnoNuevo;
    this.obtenerTurnoNuevo();
    let estatus = new HorarioStatus();
    estatus.cveIdEstatus = 4;
    estatus.cveNombre = "Activo";

    this.horarioNuevo.estatus = estatus;
    debugger
    if (this.dia1) {
      let h = new Horario();
      h.duracion = this.horarioNuevo.duracion;
      h.estatus = this.horarioNuevo.estatus;
      h.turno = this.horarioNuevo.turno;
      h.horaFinal = this.horarioNuevo.horaFinal;
      h.horaInicial = this.horarioNuevo.horaInicial;
      h.dia = "LUNES";
      //this.horarioNuevo.dia = "LUNES";



      this.lstHorariosNuevos.lstHorarios.push(h);
    }

    if (this.dia2) {
      let h = new Horario();
      h.duracion = this.horarioNuevo.duracion;
      h.estatus = this.horarioNuevo.estatus;
      h.turno = this.horarioNuevo.turno;
      h.horaFinal = this.horarioNuevo.horaFinal;
      h.horaInicial = this.horarioNuevo.horaInicial;

      h.dia = "MARTES";


      this.lstHorariosNuevos.lstHorarios.push(h);
    }

    if (this.dia3) {
      let h = new Horario();
      h.duracion = this.horarioNuevo.duracion;
      h.estatus = this.horarioNuevo.estatus;
      h.turno = this.horarioNuevo.turno;
      h.horaFinal = this.horarioNuevo.horaFinal;
      h.horaInicial = this.horarioNuevo.horaInicial;

      h.dia = "MIERCOLES";

      this.lstHorariosNuevos.lstHorarios.push(h);
    }

    if (this.dia4) {
      let h = new Horario();
      h.duracion = this.horarioNuevo.duracion;
      h.estatus = this.horarioNuevo.estatus;
      h.turno = this.horarioNuevo.turno;
      h.horaFinal = this.horarioNuevo.horaFinal;
      h.horaInicial = this.horarioNuevo.horaInicial;

      h.dia = "JUEVES";

      this.lstHorariosNuevos.lstHorarios.push(h);
    }

    if (this.dia5) {
      let h = new Horario();
      h.duracion = this.horarioNuevo.duracion;
      h.estatus = this.horarioNuevo.estatus;
      h.turno = this.horarioNuevo.turno;
      h.horaFinal = this.horarioNuevo.horaFinal;
      h.horaInicial = this.horarioNuevo.horaInicial;

      h.dia = "VIERNES";
      this.lstHorariosNuevos.lstHorarios.push(h);
    }

    if (this.dia6) {
      let h = new Horario();
      h.duracion = this.horarioNuevo.duracion;
      h.estatus = this.horarioNuevo.estatus;
      h.turno = this.horarioNuevo.turno;
      h.horaFinal = this.horarioNuevo.horaFinal;
      h.horaInicial = this.horarioNuevo.horaInicial;

      h.dia = "SABADO";

      this.lstHorariosNuevos.lstHorarios.push(h);
    }

    if (this.dia7) {
      let h = new Horario();
      h.duracion = this.horarioNuevo.duracion;
      h.estatus = this.horarioNuevo.estatus;
      h.turno = this.horarioNuevo.turno;
      h.horaFinal = this.horarioNuevo.horaFinal;
      h.horaInicial = this.horarioNuevo.horaInicial;

      h.dia = "DOMINGO";

      this.lstHorariosNuevos.lstHorarios.push(h);
    }
    console.log("lstHorariosNuevos: ", this.lstHorariosNuevos);
    if (this.lstHorariosNuevos.lstHorarios.length != 0
      && (
        this.dia1 || this.dia2 || this.dia3 || this.dia4 || this.dia5 || this.dia6 || this.dia7
      )) {
      this.nuevoHorario();
    } else {
      this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_DATOS_REQUERIDOS_HORARIO, this._Mensajes.ERROR);
    }



  }

  btnCancelarHorario() {

    $('#horario').modal('hide')

  }
  btnAceptarHorario() {
    if(this.horarioSeleccionado.horaInicial && this.horarioSeleccionado.horaFinal && this.horarioSeleccionado.duracion &&
      this.turnoSeleccionado.des_turno){
        this.guardarHorario();
      }else{
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_DATOS_REQUERIDOS_HORARIO, this._Mensajes.ERROR);

      }



  }

}
