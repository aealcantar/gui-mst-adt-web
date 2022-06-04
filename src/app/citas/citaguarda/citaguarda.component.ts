import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { objAlert } from '../../common/alerta/alerta.interface';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe, KeyValue } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { CitasService } from '../citas.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

declare var $:any;
declare var $gmx:any;

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'D',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-citaguarda',
  templateUrl: './citaguarda.component.html',
  styleUrls: ['./citaguarda.component.css'],
  providers: [
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
  lstCatHorarios: Array<any> = [];
  //patternnombre = "^([a-zA-Z \-\']|[à-ú]|[À-Ú])+$";

  submitted = false;
  muestraresumen = false;
  lstchkparticipantes: Array<any>  = [];
  checkedList: Array<any>  = [];
  contadorparticipantes: number = 0;
  datoscita = {
    'Fecha y hora de inicio de cita': '',
    'Fecha y hora de finalización de cita': '',
    'Duración de cita': '',
    'Ubicación (Lugar de atención)': '',
    'Trabajadora social responsable': '',
    'Unidad médica': '',
    'Dirección': '',
    'Turno': '',
    'Servicio': '',
    'Programa': '',
    'Tipo de cita': ''
  }

  mod_mensaje: string = "";
  objmodal = {
    mensaje: "",
    tipo: 0
  };

  citaagendada: boolean = false;

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
    public datePipe: DatePipe
    ) { }





  ngOnInit(): void {

    // $(function() {
    //   $("#fechahora").datepicker( {dateFormat : "dd/mm/yy", firstDay: 1});
    // });

    const el = window.document.querySelector('.cdk-overlay-container') as HTMLElement | null;
    if (el) {
      //el.remove();
      //window.location.reload();
    }

    this.lstchkparticipantes = [
      {name:'', value:'Martha Rodríguez Gómez', id: 1, checked:false, isfam: true},
      {name:'', value:'Leonardo López García', id: 2, checked:false, isfam: true},
      {name:'', value:'Adrián Flores Nava', id: 3, checked:false, isfam: true},
      {name:'', value:'Adelia Allison Ramírez Gómez', id: 4, checked:false, isfam: true},
      {name:'', value:'Ernesto Contreras Benitez', id: 5, checked:false, isfam: true},
      {name:'', value:'Jorge Quezada Gas', id: 6, checked:false, isfam: true}
    ]

    this.datoscita = {
      'Fecha y hora de inicio de cita': '29/03/2022 - 10:00:00',
      'Fecha y hora de finalización de cita': '10:30:00 - 13:00:00',
      'Duración de cita': '30:00',
      'Ubicación (Lugar de atención)': 'Lorem ipsum dolor sit amet',
      'Trabajadora social responsable': 'Roberto Garcia',
      'Unidad médica': 'Lorem ipsum dolor sit amet, consectetur',
      'Dirección': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusumod tempor',
      'Turno': 'Lorem ipsum',
      'Servicio': 'Adrian Cristian',
      'Programa': 'Lorem ipsum',
      'Tipo de cita': 'Individual'
    };

    this.llenacatalogos();
  }

  llenacatalogos(){

    this.llenacatalogoservicios();

    //TEMPORAL//
    this.llenacatalogohorarios();
  }

  llenacatalogoservicios(){
    this.citaservice.getlistservicios().subscribe({
      next: (resp:any) => {
        console.log(resp);
        this.lstCatServicios = resp;

      },
      error: (err) => {
        console.log(err);
        this.lstCatServicios = [];
        this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })
  }

  llenacatalogoprogramas(cve_especialidad: number){
    this.citaservice.getlistprogramas(cve_especialidad).subscribe({
      next: (resp:any) => {
        console.log(resp);
        this.lstCatProgramas = resp;

      },
      error: (err) => {
        console.log(err);
        this.lstCatProgramas = [];
        this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })
  }

  llenacatalogohorarios(){
    // this.citaservice.getlistprogramas(cve_especialidad).subscribe({
    //   next: (resp:any) => {
    //     console.log(resp);
    //     this.lstCatProgramas = resp;

    //   },
    //   error: (err) => {
    //     console.log(err);
    //     this.lstCatProgramas = [];
    //     this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
    //   }
    // })
    this.lstCatHorarios.push({id:1,value:"09:00:00"});
    this.lstCatHorarios.push({id:2,value:"09:30:00"});
    this.lstCatHorarios.push({id:3,value:"10:00:00"});
    this.lstCatHorarios.push({id:4,value:"10:30:00"});
    this.lstCatHorarios.push({id:5,value:"11:00:00"});
    this.lstCatHorarios.push({id:6,value:"11:30:00"});
    this.lstCatHorarios.push({id:7,value:"12:00:00"});
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
      const index = this.lstchkparticipantes.findIndex(x => x.value == event.target.value);
      if (index > -1) {
        this.lstchkparticipantes.splice(index, 1);
      }
    }
    this.changeSelection();
  }

  regresar(){
    this.router.navigate(['/buscacita']);
  }

  agregaparticipante(otrop: any){
    console.log(this.txtotro);
    console.log(otrop);
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
    console.log(e);
    let cve_especialidad = e.cve_especialidad;
    this.llenacatalogoprogramas(cve_especialidad);
    if(this.citadata.value.programa != ""){
      this.citadata.controls['programa'].setValue('');
    }
  }

  public onchangefecha(event: MatDatepickerInputEvent<Date>): void{
    let fechaInicio = this.citadata.value.fechahora? this.datePipe.transform(new Date(this.citadata.value.fechahora), 'yyyy-MM-dd')  : "";
    console.log('fechaInicio', fechaInicio);

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
    this.submitted = true;
    if(this.citadata.value.servicio != "" && this.citadata.value.programa != ""
      && this.citadata.value.fechahora != "" && this.citadata.value.hora != ""){

        //Validar espacio cita
        this.validaespaciocita();

    }

  }

  validaespaciocita(){

    //consumir servicio
    if(true){

      this.muestraresumen = true;
      this.submitted = false;
    }



  }

  agendarcita(){
    console.log(this.citadata.valid);
    if(this.contadorparticipantes == 0){
      this.muestraAlerta(
        'Seleccione mínimo un participante',
        'alert-danger',
        'Error'
      );
    } else {
      this.submitted = true;
      if(this.citadata.valid){

        //consumir servicio guardar cita
        if(true){
          this.muestraAlerta(
            'La cita fue agendada correctamente. Favor de realizar la descarga del formato.',
            'alert-success',
            'Éxito'
          );

          this.citaagendada = true;

        } else {
          this.muestraAlerta(
            'El espacio de cita seleccionado se encuentra bloqueado y no puede agendar citas. Favor de seleccionar otro espacio.',
            'alert-danger',
            'Error'
          );
          this.citaagendada = false;
        }

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
    this.router.navigate(['/buscacita']);
  }


  imprimircita(){

  }

  ngOnDestroy() {

  }

  // get f() {
  //   return this.citadata.controls;
  // }

  muestraAlerta(mensaje: string, estilo: string, type: string){
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
    }, 2000);
  }

}
