import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { AuthService } from 'src/app/shared-modules/services/auth-service.service';
import { InformeServiciosService } from '../../services/informe-servicios.service';
import { InformeServicios } from 'src/app/trabajo-social/models/informe-servicios.model';
import { AppTarjetaPresentacionService } from 'src/app/shared-modules/services/app-tarjeta-presentacion.service';
import { pacienteSeleccionado } from 'src/app/shared-modules/models/paciente.interface';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-consulta-informe-servicios',
  templateUrl: './consulta-informe-servicios.component.html',
  styleUrls: ['./consulta-informe-servicios.component.css'],
  providers: [DatePipe]
})
export class ConsultaInformeServiciosComponent implements OnInit, AfterViewInit {

  page: number = 1;
  pageSize: number = 15;
  resultadoTotal: number = 0;
  dtOptions: DataTables.Settings = {};
  numitems: number = 5;
  order: string = 'desc';
  columnaId: string = 'fecha';
  fecha: string = "";
  catalogoEstatus: any[] = ['No impartida', 'Por impartir', 'Impartida'];

  servicioSelected: any = '-1';
  serviciosEspecialidad: any[] = [];
  turnoSelected: any = '-1';
  turnos: any[] = [];
  grupoSelected: any = '-1';
  grupos: any[] = [];
  lugarSelected: any = '-1';
  lugares: any[] = [];
  responsables: any[] = [];
  fechaSelected!: string;
  radioBtnSelected: any;
  datosBusqueda: Array<any> = [];

  public datosPrueba =  [
    { 
    "numero": "12345",
    "paciente": "Miguel Sanchez",
    "horaCita": "10:00:00",
    "agregadoMedico": "Nataly",
    "primeraVez": "true",
    "citado": "11",
    },
    { 
    "numero": "67890",
    "paciente": "Angel Hernandez",
    "horaCita": "10:00:00",
    "agregadoMedico": "Nataly",
    "primeraVez": "true",
    "citado": "12",
    }
    ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private informeService: InformeServiciosService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      order: [[2, 'desc']],
      ordering: false,
      paging: false,
      processing: false,
      info: false,
      searching: false,
    };
    this.sortBy(this.columnaId, this.order, 'fecha');
    this.authService.setProjectObs("Trabajo social");
    this.loadCatalogos();
  }

  ngAfterViewInit(): void {
    $('#calendar').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.fechaSelected = date.replaceAll('/', '-');
          // console.log("date onSelect: ", date);
          setTimeout(() => {
            this.getInformes()
          }, 0)
        }
      }
    });
  }

  //Metodo que carga los catalogos iniciales y la información incial de la tabla Informes Servicios
  loadCatalogos() {
    this.informeService.getCatServicios().toPromise().then(
      (servicios: any[]) => {
        this.serviciosEspecialidad = servicios;
        console.log("SERVICIOS: ", this.serviciosEspecialidad);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.informeService.getCatTurnos().toPromise().then(
      (turnos: any[]) => {
        this.turnos = turnos;
        console.log("TURNOS: ", this.turnos);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.informeService.getCatLugar('CS01').toPromise().then(
      (lugares: any[]) => {
        this.lugares = lugares;
        console.log("LUGARES: ", this.lugares);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.informeService.getCatResponsable().toPromise().then(
      (responsables: any[]) => {
        this.responsables = responsables;
        console.log("RESPONSABLES: ", this.responsables);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  //Metodo que se ejecuta al seleccionar un nuevo valor del catalogo de Servicio
  onChangeServicio(valueSelect: Event) {
    //Consumimo catalogo de grupo by ServicioEspecialidad seleccionado
    this.informeService.getCatLugar(this.servicioSelected).subscribe(
      (lugares: any[]) => {
        this.lugares = lugares;
        console.log("LUGARES BY SERVICIO: ", this.turnos);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.getInformes();
  }

  limpiar() {
    this.fecha = "";
    this.datosBusqueda = [];
  }

  buscar() {
    this.getInformesTest();
  }
  
  getInformesTest() {
    this.datosBusqueda = this.datosPrueba;
  }

  getInformes() {
    this.datosBusqueda = [];
    let fechaConvertedFormat;
    if(this.fechaSelected) {
      fechaConvertedFormat = this.fechaSelected.substring(6,10) + "-" + this.fechaSelected.substring(3,5) + "-" + this.fechaSelected.substring(0,2); 
    }
    this.informeService.getInformesServiciosByFiltros(this.servicioSelected !== '-1' ? this.servicioSelected : '-', this.turnoSelected !== '-1' ? Number(this.turnoSelected) : 0, this.lugarSelected !== '-1' ? this.lugarSelected : '-', fechaConvertedFormat ? fechaConvertedFormat : '0000-00-00', this.radioBtnSelected !== undefined ? this.radioBtnSelected : '-').subscribe(
      (informeServicios: any) => {
        console.log("RESPUESTA INFORMES: ", informeServicios);
        if(informeServicios && informeServicios.List.length > 0) {
          this.datosBusqueda = informeServicios.List;
        }
        console.log("INFORMES BY FILTROS: ", this.datosBusqueda);
      }
    );
  }

   //redirecciona al detalle
   irDetalle(informeServicios: InformeServicios) {
    let params = {
      'informeServicios': JSON.stringify(informeServicios),
    }
    this.router.navigateByUrl("/detalle-informe-servicios/" + informeServicios.numero, { skipLocationChange: true })
  }

  //ordenamiento
  sortBy(columnaId: string, order: string, type: string) {
    this.columnaId = columnaId;
    this.order = order;

    this.datosBusqueda.sort((a: any, b: any) => {
      let c: any = this.converType(a[columnaId], type);
      let d: any = this.converType(b[columnaId], type);
      if (order === 'desc') {
        return d - c; // Descendiente
      } else {
        return c - d; // Ascendiente
      }
    });
  }

  converType(val: any, type: string) {
    let data;
    switch (type) {
      case 'fecha':
        data = moment(val, 'DD/MM/YYYY');
        break;
      case 'hora':
        data = moment(val, 'HH:mm:ss');
        break;
      case 'number':
        data = parseInt(val);
        break;

      default:
        break;
    }
    return data;
  }

}
