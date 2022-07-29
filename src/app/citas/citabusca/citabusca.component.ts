import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { objAlert } from '../../common/alerta/alerta.interface';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { DataTableDirective } from 'angular-datatables';
import { CitasService } from '../citas.service';
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service';
import { pacienteSeleccionado } from '../../busqueda-nss/paciente.interface';
import { DatePipe } from '@angular/common';

import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMatDateAdapter, NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { AuthService } from 'src/app/service/auth-service.service';
import { HelperMensajesService } from '../../services/helper.mensajes.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';

//import { rootCertificates } from 'tls';
declare var $: any;
declare var $gmx: any;
var listo: boolean;
var table: any;
var paginaactual: number = 0;

class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  }
}

// class CustomDateAdapter extends NgxMatDateAdapter<D> {
//   override getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
//     return ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
//   }
// }

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY - HH:mm:ss',
  },
  display: {
    dateInput: 'DD/MM/YYYY - HH:mm:ss',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MMM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-citabusca',
  templateUrl: './citabusca.component.html',
  styleUrls: ['./citabusca.component.css'],
  providers: [
    //{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // {
    //   provide: NgxMatDateAdapter,
    //   useClass: CustomDateAdapter,
    //   deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    //{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
    { provide: NGX_MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class CitabuscaComponent implements OnInit, OnDestroy {
  @ViewChild('picker') picker: any;
  alert!: objAlert;
  private _usuario!: Usuario;
  lstCitas: Array<any> = [];

  paciente!: pacienteSeleccionado;

  lstCatTurnos: Array<any> = [];
  lstCatServicios: Array<any> = [];
  lstCatProgramas: Array<any> = [];
  lstCatLugares: Array<any> = [];
  lstCatResponsables: Array<any> = [];

  selectedturno: Object = {};

  numitems: number = 15;
  pagactual: number = 1;
  dtOptions: DataTables.Settings = {};

  citadata = this.formBuilder.group({
    fechahora: '',
    turno: '',
    servicio: '',
    programa: '',
    lugar: '',
    responsable: ''
  });

  constructor(private authService: AuthService,
    private formBuilder: FormBuilder,
    private http: HttpClient, private router: Router,
    private citaservice: CitasService,
    private tarjetaService: AppTarjetaPresentacionService,
    public datePipe: DatePipe,
    private overlayContainer: OverlayContainer,
    private _Mensajes: HelperMensajesService
  ) {
    this.authService.userLogged$.next(true);
    this.authService.isAuthenticatedObs$.next(true);
  }

  ngOnInit(): void {
    this.authService.setProjectObs("Agenda Digital Transversal");

    let estatus = localStorage.getItem('catalogosCompletos');
    if (estatus === 'false') {
      this.router.navigate(["/catalogos/cargaCatalogos/1"],{skipLocationChange: true});
    } else {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario') as string) as Usuario;
      this.dtOptions = {
        pagingType: 'simple_numbers',
        pageLength: this.numitems,
        processing: true,
        info: false,
        searching: false,
        "lengthChange": false,
        "dom": "t<'table-pie' <'#cargalay.col-md-3'><'col-md-6 col-lg-6 text-center'p><'#nopag.col-md-3'>>",
        "language": {
          "paginate": {
            "first": "First page",
            "previous": '<span class="glyphicon glyphicon-menu-left paginacion-icon-navegacion" aria-hidden="true"></span>',
            "next": '<span class="glyphicon glyphicon-menu-right paginacion-icon-navegacion" aria-hidden="true"></span>',
            "last": "last"
          }
        }
      };

      this.paciente = this.tarjetaService.get() ? this.tarjetaService.get() : JSON.parse(localStorage.getItem('paciente'));
      console.log("paciente:", this.paciente);
      this.llenacatalogos();
      this.buscarcita();
    }
  }

  llenacatalogos() {
    this.llenacatalogoturnos();
    this.llenacatalogoservicios();
  }


  llenacatalogoservicios() {
    this.msjLoading("Cargando...");
    this.citaservice.getlistservicios(this._usuario.unidadMedica).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.lstCatServicios = resp;
        Swal.close();
      },
      error: (err) => {
        console.log(err);
        this.lstCatServicios = [];
        Swal.close();
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_CATSERVICIO, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
      }
    })
  }

  llenacatalogoturnos() {
    this.msjLoading("Cargando...");
    this.citaservice.getlistturnos().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.lstCatTurnos = resp;
        Swal.close();
      },
      error: (err) => {
        console.log(err);
        this.lstCatTurnos = [];
        Swal.close();
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_CATTURNO, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
      }
    })
  }

  llenacatalogoprogramas(cve_especialidad: number) {
    this.msjLoading("Cargando...");
    this.citaservice.getlistprogramas(cve_especialidad).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.lstCatProgramas = resp;
        Swal.close();
      },
      error: (err) => {
        console.log(err);
        this.lstCatProgramas = [];
        Swal.close();
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_CATPROGRAMA, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
      }
    })
  }
  llenacatalogolugares(cve_especialidad: number) {
    this.msjLoading("Cargando...");
    this.citaservice.getlistlugares(cve_especialidad).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.lstCatLugares = resp;
        Swal.close();
      },
      error: (err) => {
        console.log(err);
        this.lstCatLugares = [];
        Swal.close();
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_CATLUGAR, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
      }
    })
  }
  llenacatalogoresponsables(cve_ubicacion: number, cve_turno: number) {
    this.msjLoading("Cargando...");
    this.citaservice.getlistresponsables(cve_ubicacion, cve_turno).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.lstCatResponsables = resp;
        Swal.close();
      },
      error: (err) => {
        console.log(err);
        this.lstCatResponsables = [];
        Swal.close();
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_CATRESPONSABLE, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
      }
    })
  }

  onchangeservicio(e: any) {
    console.log(e);
    let cve_especialidad = e.cve_especialidad;
    this.llenacatalogoprogramas(cve_especialidad);
    this.llenacatalogolugares(cve_especialidad);
    if (this.citadata.value.programa != "") {
      this.citadata.controls['programa'].setValue('');
    }
    if (this.citadata.value.lugar != "") {
      this.citadata.controls['lugar'].setValue('');
      this.citadata.controls['responsable'].setValue('');
    }
  }

  onchangelugar(e: any) {
    this.validapeticionresp();
  }

  onchangeturno(e: any) {
    this.validapeticionresp();
  }

  validapeticionresp() {
    if (this.citadata.value.turno != "" && this.citadata.value.lugar != "") {
      this.llenacatalogoresponsables(this.citadata.value.lugar.cve_ubicacion, this.citadata.value.turno.cve_turno);
      if (this.citadata.value.responsable != "") {
        this.citadata.controls['responsable'].setValue('');
      }
    }
  }


  limpiarbusqueda() {
    this.lstCitas = [];
    this.lstCatResponsables = [];
    this.lstCatProgramas = [];
    this.lstCatLugares = [];
    this.citadata.controls['responsable'].setValue('');
    this.lstCatResponsables.splice(0, this.lstCatResponsables.length);
    this.citadata.controls['servicio'].setValue('');
    this.citadata.controls['fechahora'].setValue('');
    this.citadata.controls['programa'].setValue('');
    this.citadata.controls['turno'].setValue('');
    this.citadata.controls['lugar'].setValue('');

    this.lstCitas = [];
    this.lstCatResponsables = [];
    this.lstCatProgramas = [];
    this.lstCatLugares = [];
    this.buscarcita();
  }

  buscarcita() {
    this.msjLoading("Cargando...");

    this.lstCitas = [];
    this.pagactual = 1;

    let data = {
      "nss": this.paciente ? this.paciente.nss : 0,
      //"fechaInicio": this.citadata.value.fechahora,
      "fechaInicio": this.citadata.value.fechahora ? this.datePipe.transform(new Date(this.citadata.value.fechahora), 'yyyy-MM-dd') : "",
      "horaInicio": this.citadata.value.fechahora ? this.datePipe.transform(new Date(this.citadata.value.fechahora), 'HH:mm:ss') : "",
      "descripcionServicio": this.citadata.value.servicio ? this.citadata.value.servicio.des_especialidad : "",
      "grupoPrograma": this.citadata.value.programa ? this.citadata.value.programa.des_grupo_programa : "",
      "ubicacion": this.citadata.value.lugar ? this.citadata.value.lugar.des_completa_ubicacion : "",
      "trabajadorSocial": this.citadata.value.responsable ? this.citadata.value.responsable.nom_nombre : "",
      "turno": this.citadata.value.turno ? this.citadata.value.turno.des_turno : ""
    }

    this.citaservice.buscacitas(data).subscribe({
      next: (resp: any) => {

        console.log(resp);
        this.lstCitas = resp;
        setTimeout(() => {
          table = $('#tblcitas').DataTable();
          //$('#tblusuarios').DataTable().page.len( this.numitems ).draw();
          this.dtOptions.pageLength = this.numitems;


          setTimeout(() => {
            table.on('page', () => {
              console.log('Page: ' + table.page.info().page);
              paginaactual = table.page.info().page;
              this.pagactual = paginaactual + 1;
            });
          }, 1000);
          Swal.close();
        }, 1000);

      },
      error: (err) => {
        this.lstCitas = [];
        Swal.close();
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_BUSCA_CITA, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
      }
    })
  }


  regresar() {

  }

  agendarcita() {
    this.router.navigateByUrl('/guardacita');
  }

  muestracita(id: number) {
    this.router.navigateByUrl('/consultacita/' + id);
  }

  weekendsDatesFilter = (d: Date): boolean => {
    const day = d.getDay();
    /* Prevent Saturday and Sunday for select. */
    //return day !== 0 && day !== 6 ;
    return true;
  }

  ngOnDestroy() {

  }

  private msjLoading(titulo: string) {
    Swal.fire({
      title: titulo,

      didOpen: () => {
        Swal.showLoading();
      }
    })
  }

  muestraAlerta(mensaje: string, estilo: string, type: string) {
    this.alert = new objAlert();
    this.alert = {
      message: mensaje,
      type: estilo,
      typeMsg: type,
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

  cambiatotalpaginas(numpag: number) {
    this.numitems = numpag;
    table.page.len(this.numitems).draw();
    paginaactual = table.page.info().page;
    this.pagactual = paginaactual + 1;
  }

}

