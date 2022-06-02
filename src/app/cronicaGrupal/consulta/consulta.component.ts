import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service.service';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';
import * as momment from 'moment';

declare var $: any;

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit, AfterViewInit {

  page: number = 1;
  pageSize: number = 15;
  resultadoTotal: number = 0;
  dtOptions: DataTables.Settings = {};
  numitems: number = 15;
  order: string = 'desc';
  columnaId: string = 'fecFechaCorta';

  catalogoEstatus: any[] = ['No impartida', 'Por impartir', 'Impartida'];

  servicioSelected: any = '-1';
  serviciosEspecialidad: any[] = [];
  turnoSelected: any = '-1';
  turnos: any[] = [];
  grupoSelected: any = '-1';
  grupos: any[] = [];
  lugarSelected: any = '-1';
  lugares: any[] = [];
  fechaSelected!: string;
  radioBtnSelected: any;

  cronicasGrupales: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private cronicaGrupalService: CronicaGrupalService
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
    this.authService.project$.next("Trabajo Social");
    this.loadCatalogos();
  }

  ngAfterViewInit(): void {
    $('#calendar').datepicker({
      dateFormat: "yy/mm/dd",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.fechaSelected = date.replaceAll('/', '-');
          // console.log("date onSelect: ", date);
          setTimeout(() => {
            this.getCronicasGrupales()
          }, 0)
        }
      }
    });
  }

  //Metodo que carga los catalogos iniciales y la información incial de la tabla CronicasGrupales
  loadCatalogos() {
    this.cronicaGrupalService.getCatServicios().toPromise().then(
      (servicios) => {
        this.serviciosEspecialidad = servicios;
        console.log("SERVICIOS: ", this.serviciosEspecialidad);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.cronicaGrupalService.getCatTurnos().toPromise().then(
      (turnos) => {
        this.turnos = turnos;
        console.log("TURNOS: ", this.turnos);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.cronicaGrupalService.getCatGrupo('1').toPromise().then(
      (grupos) => {
        this.grupos = grupos;
        console.log("GRUPOS: ", this.grupos);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.cronicaGrupalService.getCatLugar('1').toPromise().then(
      (lugares) => {
        this.lugares = lugares;
        console.log("LUGARES: ", this.lugares);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.cronicaGrupalService.getAllCronicasGrupales().toPromise().then(
      (cronicasGrupales: any) => {
        let cronicasArray = Object.keys(cronicasGrupales).map(index => {
          let cronica = cronicasGrupales[index];
          return cronica;
        });
        this.cronicasGrupales = cronicasArray[0];
        console.log("CRONICAS GRUPALES: ", this.cronicasGrupales);
      }
    );
  }

  //Metodo que se ejecuta al seleccionar un nuevo valor del catalogo de Servicio
  onChangeServicio(valueSelect: Event) {
    //Consumimo catalogo de grupo by ServicioEspecialidad seleccionado
    this.cronicaGrupalService.getCatGrupo(this.servicioSelected).subscribe(
      (grupos) => {
        this.grupos = grupos;
        console.log("GRUPOS BY SERVICIO: ", this.turnos);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    //Consumimo catalogo de grupo by ServicioEspecialidad seleccionado
    this.cronicaGrupalService.getCatLugar(this.servicioSelected).subscribe(
      (lugares) => {
        this.lugares = lugares;
        console.log("LUGARES BY SERVICIO: ", this.turnos);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.getCronicasGrupales();
  }

  //Metodo que se ejecuta al seleccionar un nuevo valor del catalogo de Turno
  onChangeTurno(valueSelect: Event) {
    this.getCronicasGrupales();
  }

  //Metodo que se ejecuta al seleccionar un nuevo valor del catalogo de Grupo
  onChangeGrupo(valueSelect: Event) {
    this.getCronicasGrupales();
  }

  //Metodo que se ejecuta al seleccionar un nuevo valor del catalogo de Lugar
  onChangeLugar(valueSelect: Event) {
    this.getCronicasGrupales();
  }

  onChangeRadioBoton(value: Event) {
    this.getCronicasGrupales();
  }

  validateAllDataFull(): boolean {
    if (this.servicioSelected !== '-1' && this.turnoSelected !== '-1'
      && this.grupoSelected !== '-1' && this.lugarSelected !== '-1'
      && this.fechaSelected !== null && this.radioBtnSelected) {
      return true;
    }
    return false;
  }

  getCronicasGrupales() {
    this.cronicaGrupalService.getCronicasGrupalesByFiltros(this.servicioSelected !== '-1' ? this.servicioSelected : '-', this.turnoSelected !== '-1' ? Number(this.turnoSelected) : 0, this.grupoSelected !== '-1' ? Number(this.grupoSelected) : 0, this.lugarSelected !== '-1' ? this.lugarSelected : '-', this.fechaSelected !== undefined ? this.fechaSelected : '0000-00-00', this.radioBtnSelected !== undefined ? this.radioBtnSelected : '-').subscribe(
      (cronicasGrupales) => {
        console.log("RESPUESTA CRONICAS: ", cronicasGrupales);
        this.cronicasGrupales = [];
        let cronicasArray = Object.keys(cronicasGrupales).map(index => {
          let cronica = cronicasGrupales[index];
          return cronica;
        });
        this.cronicasGrupales = cronicasArray[0];
        console.log("CRONICAS GRUPALES BY FILTROS: ", this.cronicasGrupales);
      }
    );
  }

  addCronica() {
    let params = {
      'cronica': null,
    }
    this.router.navigate(["nuevaCronica"], { queryParams: params, skipLocationChange: true });
  }

  irDetalle(cronicaGrupal: any) {
    let params = {
      'cronica': JSON.stringify(cronicaGrupal),
    }
    console.log("OBJETO DETALLE: ", cronicaGrupal);
    if (this.radioBtnSelected === 'Si') {
      console.log(" ENTRAMOS A SI ");
      if (cronicaGrupal.desTecnicaDidactica === null && cronicaGrupal.desDesarrolloSesion === null && cronicaGrupal.desObjetivosSesion === null && cronicaGrupal.desObservaciones === null && cronicaGrupal.desPerfilGrupo === null) {
        console.log("NO HAY INFO");
        this.router.navigate(["nuevaCronica"], { queryParams: params, skipLocationChange: true });
      } else {
        console.log("SI HAY INFO");
        this.router.navigate(["busquedaEspecifica"], { queryParams: params, skipLocationChange: true });
      }
    } else if (this.radioBtnSelected === 'No') {
      console.log(" ENTRAMOS A NO ");
      this.router.navigate(["nuevaCronica"], { queryParams: params, skipLocationChange: true });
    } else {
      console.log(" ENTRAMOS SIN VALOR ");
      return;
    }
  }

  sortBy(columnaId: string, order: string, type: string) {
    this.columnaId = columnaId;
    this.order = order;

    this.cronicasGrupales.sort((a: any, b: any) => {
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
        data = momment(val, 'DD/MM/YYYY');
        break;
      case 'hora':
        data = momment(val, 'HH:mm:ss');
        break;

      default:
        break;
    }
    return data;
  }

}