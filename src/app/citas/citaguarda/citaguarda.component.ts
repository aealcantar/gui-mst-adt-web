import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { objAlert } from '../../common/alerta/alerta.interface';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe, KeyValue } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { CitasService } from '../citas.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment';
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service';
import { pacienteSeleccionado } from 'src/app/busqueda-nss/paciente.interface';

declare var $:any;
declare var $gmx:any;

class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  }
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MMM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-citaguarda',
  templateUrl: './citaguarda.component.html',
  styleUrls: ['./citaguarda.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }

  ]
})
export class CitaguardaComponent implements OnInit {
  @ViewChild('picker') picker: any;
  alert!: objAlert;
  txtotro:string
  lstParticipantes: Array<string> = [];


  lstCatServicios: Array<any> = [];
  lstCatProgramas: Array<any> = [];
  lstCatFechas: Array<any> = [];
  lstCatHorarios: Array<any> = [];
  //patternnombre = "^([a-zA-Z \-\']|[à-ú]|[À-Ú])+$";

  submitted = false;
  muestraresumen = false;
  lstchkparticipantes: Array<any>  = [];
  checkedList: Array<any>  = [];
  contadorparticipantes: number = 0;
  datoscita = {
    'Fecha y hora de inicio de la cita': '',
    'Fecha y hora de finalización de la cita': '',
    'Duración': '',
    'Ubicación (Lugar de atención)': '',
    'Trabajadora social responsable': '',
    'Unidad': '',
    'Dirección': '',
    'Turno': '',
    'Servicio': '',
    'Programa': '',
    'Tipo de cita': ''
  }
  participantes: number = 0;

  mod_mensaje: string = "";
  objmodal = {
    mensaje: "",
    tipo: 0
  };

  citaagendada: boolean = false;
  paciente!: pacienteSeleccionado;

  public keepOriginalOrder = (a: { key: any; }, b: any) => a.key;

  citadata: any = this.formBuilder.group({
    fechahora: ['', Validators.required],
    hora: ['', Validators.required],
    servicio: ['', Validators.required],
    programa: ['', Validators.required],
    ocasion: ['', Validators.required],
    modalidad: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient, private router: Router,
    private citaservice: CitasService,
    public datePipe: DatePipe,
    private tarjetaService: AppTarjetaPresentacionService
    ) { }

  ngOnInit(): void {

    // this.lstchkparticipantes = [
    //   {name:'', value:'Martha Rodríguez Gómez', id: 1, checked:false, isfam: true},
    //   {name:'', value:'Leonardo López García', id: 2, checked:false, isfam: true},
    //   {name:'', value:'Adrián Flores Nava', id: 3, checked:false, isfam: true},
    //   {name:'', value:'Adelia Allison Ramírez Gómez', id: 4, checked:false, isfam: true},
    //   {name:'', value:'Ernesto Contreras Benitez', id: 5, checked:false, isfam: true},
    //   {name:'', value:'Jorge Quezada Gas', id: 6, checked:false, isfam: true}
    // ]

    this.paciente = this.tarjetaService.get();
    //console.log("paciente:" + this.paciente);
    this.llenaparticipantes();
    this.llenacatalogoservicios();

  }

  llenaparticipantes(){
    this.citaservice.getlistparticipantes(this.paciente? this.paciente.nss : '4313947194').subscribe({
      next: (resp:any) => {
        //console.log(resp);
        //this.lstchkparticipantes = resp.busquedanss.beneficiarios;
        this.lstchkparticipantes = [];
        var cont: number = 0;
        for(var prt of resp.busquedanss.beneficiarios){
          if(prt.Parentesco == "Beneficiario"){
            cont = cont + 1;
            this.lstchkparticipantes.push({name:'', value: prt.paciente, id: cont, checked:false, isfam: true})
          }
        }

      },
      error: (err) => {
        //console.log(err);
        this.lstchkparticipantes = [];
        this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })
  }

  llenacatalogoservicios(){
    this.citaservice.getlistservicios().subscribe({
      next: (resp:any) => {
        //console.log(resp);
        this.lstCatServicios = resp;

      },
      error: (err) => {
        //console.log(err);
        this.lstCatServicios = [];
        this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })
  }

  llenacatalogoprogramas(cve_especialidad: number){
    this.citaservice.getlistprogramas(cve_especialidad).subscribe({
      next: (resp:any) => {
        //console.log(resp);
        this.lstCatProgramas = resp;

      },
      error: (err) => {
        //console.log(err);
        this.lstCatProgramas = [];
        this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })
  }

  llenafechas(cve_gpo: number){
    this.citaservice.getfechascalanual(this.citadata.value.servicio.cve_especialidad, cve_gpo).subscribe({
      next: (resp:any) => {
        //console.log(resp);

        this.lstCatFechas = resp;

      },
      error: (err) => {
        //console.log(err);
        this.lstCatFechas = [];
        this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })

  }

  llenacatalogohorarios(fechaInicio: string){
    this.citaservice.gethorarioscalanual(this.citadata.value.servicio.cve_especialidad,
      this.citadata.value.programa.cve_grupo_programa,
      fechaInicio).subscribe({
      next: (resp:any) => {
        //console.log(resp);
        this.lstCatHorarios = resp;

      },
      error: (err) => {
        //console.log(err);
        this.lstCatHorarios = [];
        this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })
  }

  changeSelection(){
    this.checkedList = [];
    for (var i = 0; i < this.lstchkparticipantes.length; i++) {
      if(this.lstchkparticipantes[i].checked)
      this.checkedList.push(this.lstchkparticipantes[i]);
    }
    this.actualizacontador();
  }

  cambiacheck(event: any){
    console.log(event);
    if(event.target.checked){
      this.lstchkparticipantes.push({name:'', value:event.target.value, id: event.target.id, checked:true, isfam: false});
    } else {
      // const index = this.lstchkparticipantes.findIndex(x => { event.target.id == "chkpaciente" && x.value == event.target.value });
      // if (index > -1) {
      //   this.lstchkparticipantes.splice(index, 1);
      // }

      for (var i = 0; i < this.lstchkparticipantes.length; i++) {
        if(this.lstchkparticipantes[i].value == event.target.value && this.lstchkparticipantes[i].id == "chkpaciente"){
          this.lstchkparticipantes.splice(i, 1);
        }
      }

    }
    this.changeSelection();
  }

  regresar(){
    this.router.navigateByUrl('/buscacita', {skipLocationChange: true});
  }

  agregaparticipante(otrop: any){
    //console.log(this.txtotro);
    //console.log(otrop);
    if(this.txtotro && this.txtotro.trim() != "" && otrop.control.status == "VALID"){
      this.lstParticipantes.push(this.txtotro);
      this.txtotro = "";
    }
    this.actualizacontador();

  }

  eliminaparticipante(per: string){
    const index = this.lstParticipantes.indexOf(per, 0);
    if (index > -1) {
      this.lstParticipantes.splice(index, 1);
    }
    this.actualizacontador();
  }

  actualizacontador(){
    this.contadorparticipantes = this.lstParticipantes.length +  this.checkedList.length;
  }

  onchangeservicio(e: any){
    //console.log(e);
    let cve_especialidad = e.cve_especialidad;
    this.llenacatalogoprogramas(cve_especialidad);
    if(this.citadata.value.programa != ""){
      this.citadata.controls['programa'].setValue('');
    }
  }

  onchangeprograma(e:any){
    if(e != ""){
      this.llenafechas(e.cve_grupo_programa)
    }

    if(this.citadata.value.fechahora != ""){
      this.citadata.controls['fechahora'].setValue('');
      this.lstCatFechas = [];
      this.onchangefecha(false);
    }

  }

  public onchangefecha(origen?: boolean): void{
    let fechaInicio = this.citadata.value.fechahora? this.datePipe.transform(new Date(this.citadata.value.fechahora), 'yyyy-MM-dd')  : "";
    //console.log('fechaInicio', fechaInicio);

    if(origen){
      this.llenacatalogohorarios(fechaInicio);
    }
    if(this.citadata.value.hora != ""){
      this.citadata.controls['hora'].setValue('');
      this.lstCatHorarios = [];
      this.muestraresumen = false;
    }

    //validar espacio de la fecha seleccionada
    if(!true){
      this.muestraAlerta(
        'El espacio seleccionado se encuentra al máximo de su cupo, favor de seleccionar otra fecha.',
        'alert-danger',
        'Error'
      );
    }
  }

  onchangehora(e: any){
    if(e != ""){
      this.submitted = true;
      if(this.citadata.value.servicio != "" && this.citadata.value.programa != ""
        && this.citadata.value.fechahora != "" && this.citadata.value.hora != ""){

          this.limpiavaloresresumencita();

          //Validar espacio cita
          this.validaespaciocita(e);

      }
    }

  }

  validaespaciocita(e:any){
    this.citaservice.getcomplementocita(this.citadata.value.servicio.cve_especialidad,
      this.citadata.value.programa.cve_grupo_programa).subscribe({
      next: (resp:any) => {
        //console.log(resp);
        this.datoscita = {
          'Fecha y hora de inicio de la cita': e.fec_inicio? this.datePipe.transform(new Date(e.fec_inicio + " " + e.tim_hora_inicio), 'dd-MM-yyyy - HH:mm:ss')  : "",
          'Fecha y hora de finalización de la cita': e.fec_fin? this.datePipe.transform(new Date(e.fec_fin + " " + e.tim_hora_fin), 'dd-MM-yyyy - HH:mm:ss')  : "",
          'Duración': e.num_duracion,
          'Ubicación (Lugar de atención)': resp.cve_ubicacion,
          'Trabajadora social responsable': resp.des_trabajador_social, //e.des_trabajador_social,
          'Unidad': resp.unidad_medica,
          'Dirección': resp.direccion,
          'Turno': resp.cve_turno,
          'Servicio': this.citadata.value.servicio.des_especialidad,
          'Programa': this.citadata.value.programa.des_grupo_programa,
          'Tipo de cita': 'Grupal'
        };

        this.muestraresumen = true;
        this.submitted = false;


      },
      error: (err) => {
        //console.log(err);
        this.muestraresumen = true;
        this.submitted = false;
        this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })
  }

  limpiavaloresresumencita(){
    this.datoscita = {
      'Fecha y hora de inicio de la cita': '',
      'Fecha y hora de finalización de la cita': '',
      'Duración': '',
      'Ubicación (Lugar de atención)': '',
      'Trabajadora social responsable': '',
      'Unidad': '',
      'Dirección': '',
      'Turno': '',
      'Servicio': '',
      'Programa': '',
      'Tipo de cita': ''
    }
  }

  agendarcita(){
    //console.log(this.citadata.valid);
   

    if(this.contadorparticipantes == 0){
      this.muestraAlerta(
        'Seleccione mínimo un participante',
        'alert-danger',
        'Error'
      );
    } else if (this.contadorparticipantes >= 1) {
      this.submitted = true;
      if(this.citadata.valid) {
        let fechaIni = this.citadata.value.fechahora? this.datePipe.transform(new Date(this.citadata.value.fechahora), 'yyyy-MM-dd')  : "";
        let objetoResuperado = this.lstCatFechas.filter(e => e.fec_inicio === fechaIni);
        this.participantes = Number(JSON.stringify(objetoResuperado[0].maximo_partcipantes));
        if(this.contadorparticipantes > this.participantes) {
          this.muestraAlerta(
            'El espacio seleccionado se encuentra al máximo de su cupo, por favor seleccionar otra fecha.',
            'alert-danger',
            'Error'
          );
        }
      }
    } else {
      this.submitted = true;
      if(this.citadata.valid){

        this.citaservice.altacita(this.citadata.value.hora.cve_calendario_anual).subscribe({
          next: (resp:any) => {
            //console.log(resp);
            if(resp){

            interface LooseObject {
              [key: string]: any
            }

            var req: LooseObject = {
              "cveCalendarioAnual": this.citadata.value.hora.cve_calendario_anual,
              "nss": this.paciente? this.paciente.nss : 4313947194,
              "DescripcionServicio": this.citadata.value.servicio.des_especialidad,
              "grupoPrograma": this.citadata.value.programa.des_grupo_programa,
              "fechaInicio": this.citadata.value.hora.fec_inicio,
              "horaInicio": this.citadata.value.hora.tim_hora_inicio,
              "fechaFin": this.citadata.value.hora.fec_fin,
              "horaFin": this.citadata.value.hora.tim_hora_fin,
              "duracion": this.citadata.value.hora.num_duracion,
              "ubicacion": this.datoscita['Ubicación (Lugar de atención)'],
              "trabajadorSocial": this.datoscita['Trabajadora social responsable']?this.datoscita['Trabajadora social responsable']:"",
              "unidadMedica": this.datoscita.Unidad,
              "direccion": this.datoscita.Dirección,
              "turno": this.datoscita.Turno,
              "ocasionServicio": this.citadata.value.ocasion,
              "modalidad": this.citadata.value.modalidad,
              "tipoCita": this.datoscita['Tipo de cita'],
              //"participantes": []
            };

            let arrparts = [];

            this.lstParticipantes.forEach(val =>{
              arrparts.push({"nombre": val, "tipo": 3});
            })

            for(var oj of this.checkedList){
              arrparts.push({"nombre": oj.value, "tipo": oj.isfam?"2":"1"});
            }

            req['participantes'] = arrparts;

            this.citaservice.guardacita(req).subscribe({
              next: (resp:any) => {
                //console.log(resp);

                if(resp.estatus == true){
                  this.muestraAlerta(
                    'La cita fue agendada correctamente. Favor de realizar la descarga del formato.',
                    'alert-success',
                    'Éxito'
                  );

                  this.citaagendada = true;

                } else {

                  // this.muestraAlerta(
                  //   'El espacio de cita seleccionado se encuentra bloqueado y no puede agendar citas. Favor de seleccionar otro espacio.',
                  //   'alert-danger',
                  //   'Error'
                  // );
                  this.muestraAlerta(
                    resp.mensaje?resp.mensaje:"Ocurrió un problema al guardar la cita.",
                    'alert-danger',
                    'Error'
                  );
                  this.citaagendada = false;
                }
              },
              error: (err) => {
                //console.log(err);

                this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
              }
            })
          } else {
            this.muestraAlerta('Ocurrió un error al agendar la cita','alert-danger','Error');
          }
          },
          error: (err) => {
            //console.log(err);

            this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
          }
        })
      }
    }
  }

  weekendsDatesFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  updateCalcs(event:any){
    console.log(event);
  }

  onChangeEvent(event:any){
    console.log(event);
    console.log(event.value);
  }

  cancelarcita(){
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    this.objmodal.mensaje = "¿Deseas salir sin guardar<br/>los cambios?";
    this.objmodal.tipo = 2;
    $('#content').modal('show')
  }

  cancelarmod(){
    this.objmodal.mensaje = "";
    this.objmodal.tipo = 0;
    $('#content').modal('hide');
  }

  aceptarmod(){
    this.objmodal.mensaje = "";
    this.objmodal.tipo = 0;
    $('#content').modal('hide');
    this.router.navigateByUrl('/buscacita', {skipLocationChange: true});
  }


  imprimircita(){

  }

  ngOnDestroy() {

  }

  // myFilter = (d: Date | null): boolean => {
  //   const day = (d || new Date()).getDay();
  //   // Prevent Saturday and Sunday from being selected.
  //   return day !== 0 && day !== 6;
  // }

  myFilter = (d: Moment | null): boolean => {
    const habil: boolean = false;
    //const day = (d || moment()).day();
    // Prevent Saturday and Sunday from being selected.
    //return day !== 0 && day !== 6;
    const date = (d || moment());
    for(var fec of this.lstCatFechas){
      if(fec.fec_inicio == date.format('YYYY-MM-DD')){
        return true;
      }
    }
    return habil;
  }

  // get f() {
  //   return this.citadata.controls;
  // }

  callback = () =>{
    this.regresar();
  }

  muestraAlerta(mensaje: string, estilo: string, type: string,funxion?:any){
    this.alert = new objAlert();
    this.alert = {
      message: mensaje,
      type: estilo,
      typeMsg: type,
      visible: true
    }
    setTimeout(() => {
      this.alert = {
        message:'',
        type: 'custom',
        visible: false
      }
      if(funxion != null){
        funxion();
      }
    }, 2000);
  }

}
