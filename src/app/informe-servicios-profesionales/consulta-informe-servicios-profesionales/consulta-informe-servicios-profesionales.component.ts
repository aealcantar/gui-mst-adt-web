import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import * as moment from "moment";

import { AlertInfo } from "src/app/app-alerts/app-alert.interface";
import { InformeServiciosProfesionalesService } from "src/app/service/informe-servicios-profesionales.service";

declare var $: any;

@Component({
  selector: 'app-consulta-informe-servicios-profesionales',
  templateUrl: './consulta-informe-servicios-profesionales.component.html',
  styleUrls: ['./consulta-informe-servicios-profesionales.component.css']
})
export class ConsultaInformeServiciosProfesionalesComponent implements OnInit {

  public alert!: AlertInfo;

  // catalogos
  grupos: any[] = [];
  lugares: any[] = [];
  responsables: any[] = [];
  serviciosEspecialidad: any[] = [];
  turnos: any[] = [];
  // tabla
  dtOptions: DataTables.Settings = {};
  // paginado
  columnaId: string = '';
  order: string = 'desc';
  page: number = 1;
  pageSize: number = 15;
  // datos
  datosBusqueda: Array<any> = [];

  // Formulario
  formularioBusqueda = new FormGroup({
    fecha: new FormControl('', Validators.required),
    lugar: new FormControl('', Validators.required),
    responsable: new FormControl('', Validators.required),
    servicio: new FormControl('', Validators.required),
    turno: new FormControl('', Validators.required),
  })

  // Observers
  consultaObserver = {
    next: (respuesta: any) => this.asignarResultadosConsulta(respuesta),
    error: (error: HttpErrorResponse) => console.log(error),
  }
  lugaresObserver = {
    next: (lugares: any) => this.lugares = lugares,
    error: (error: HttpErrorResponse) => console.log(error),
  }
  responsablesObserver = {
    next: (respuesta: any) => this.responsables = respuesta.responsables,
    error: (error: HttpErrorResponse) => console.log(error),
  }
  serviciosObserver = {
    next: (servicios: any) => this.serviciosEspecialidad = servicios,
    error: (error: HttpErrorResponse) => console.log(error),
  }
  turnosObserver = {
    next: (turnos: any) => this.turnos = turnos,
    error: (error: HttpErrorResponse) => console.log(error),
  }

  constructor(
    private informeServProfService: InformeServiciosProfesionalesService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      info: false,
      order: [[2, 'desc']],
      ordering: false,
      paging: false,
      processing: false,
      searching: false,
    };
    this.cargarCatalogos();
  }

  ngAfterViewInit(): void {
    this.actualizarFecha();
  }

  actualizarFecha(): void {
    $('#calendar').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any) => {
        if (date == '') return
        date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        this.formularioBusqueda.get('fecha')?.patchValue(date)
      },
      onClose: (date: any) => {
        if (date) return
        this.formularioBusqueda.get('fecha')?.patchValue('')
      }
    })
  }

  asignarResultadosConsulta(respuesta: any): void {
    if (respuesta.length === 0) {
      this.mostrarAlerta(
        'Verifique los filtros',
        'alert-warning',
        'Sin Resultados'
      )
    }
    this.datosBusqueda = respuesta
  }

  asignarValoresDefault(): void {
    this.formularioBusqueda = new FormGroup({
      fecha: new FormControl('', Validators.required),
      lugar: new FormControl('', Validators.required),
      responsable: new FormControl('', Validators.required),
      servicio: new FormControl('', Validators.required),
      turno: new FormControl('', Validators.required),
    })
  }

  limpiar(): void {
    this.asignarValoresDefault()
    this.formularioBusqueda.reset(this.formularioBusqueda.value);
  }

  buscar(): void {
    const consultaBusqueda = this.formularioBusqueda.value;
    this.informeServProfService.getConsultaServicios(consultaBusqueda).subscribe(this.consultaObserver)
  }

  ordenarPor(columnaId: string, order: string, tipo: string): void {
    this.columnaId = columnaId;
    this.order = order;

    this.datosBusqueda = [...this.datosBusqueda].sort((a: any, b: any) => {
      let c: any = this.convertirTipo(a[columnaId], tipo);
      let d: any = this.convertirTipo(b[columnaId], tipo);
      if (order === 'desc') {
        return d - c; // Descendiente
      } else {
        return c - d; // Ascendiente
      }
    });
    console.log(this.datosBusqueda)
  }

  convertirTipo(valor: any, tipo: string) {
    let data;
    switch (tipo) {
      case 'fecha':
        data = moment(valor, 'DD/MM/YYYY');
        break;
      case 'hora':
        data = moment(valor, 'HH:mm:ss');
        break;
      case 'numero':
        data = parseInt(valor);
        break;

      default:
        break;
    }
    return data;
  }

  imprimirPdf(): void {
    const data = {
      "responsable": "987654321",
      "idTurno": 1,
      "especialidad": 1,
      "idLugar": 207,
      "fecha":"2022-08-01"
  }
    this.informeServProfService.imprimirPdf(data).subscribe({
      next: (response) => {
        var file = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error)
      }
    })
  }

  cargarCatalogos(): void {
    this.informeServProfService.getCatTurnos().subscribe(this.turnosObserver);
    this.informeServProfService.getCatServicios().subscribe(this.serviciosObserver);
    this.informeServProfService.getCatResponsables().subscribe(this.responsablesObserver)
    this.informeServProfService.getCatLugar().subscribe(this.lugaresObserver);
  }

  mostrarAlerta(mensaje: string, estilo: string, tipoMsj?: string, funxion?: any) {
    this.alert = new AlertInfo;
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
      if (funxion != null) {
        funxion();
      }
    }, 5000);
  }

}
