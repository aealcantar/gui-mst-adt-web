import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service.service';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';
import * as momment from 'moment';
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';

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
  // cronicaGrupalAsociada = true;

  catalogoEstatus: any[] = ['No impartida', 'Por impartir', 'Impartida'];

  servicioSelected: any = '';
  serviciosEspecialidad: any[] = [];
  turnoSelected: any = '';
  turnos: any[] = [];
  grupoSelected: any = '';
  grupos: any[] = [];
  lugarSelected: any = '';
  lugares: any[] = [];
  fechaSelected!: string;
  radioBtnSelected: any;

  cronicasGrupales: any[] = [];
  alert!: AlertInfo;
  formularioValido: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cronicaGrupalService: CronicaGrupalService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.authService.setProjectObs("Trabajo Social");
    }, 0);
    this.dtOptions = {
      order: [[2, 'desc']],
      ordering: false,
      paging: false,
      processing: false,
      info: false,
      searching: false,
    };
    this.sortBy(this.columnaId, this.order, 'fecha');
    //  this.cronicaGrupalService.getAllCronicasGrupales().toPromise().then(
    //    (cronicasGrupales: any) => {
    //      this.cronicasGrupales = [];
    //  this.cronicasGrupales.length = 0;
    //  this.cronicasGrupales = cronicasGrupales;
    //      console.log("CRONICAS GRUPALES: ", this.cronicasGrupales);
    //    }
    //  );
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
            this.getCronicasGrupales();
          }, 0)
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.fechaSelected = null;
          this.getCronicasGrupales();
        }
      }
    });
  }

  //Metodo que carga los catalogos iniciales y la información incial de la tabla CronicasGrupales
  loadCatalogos() {
    this.cronicaGrupalService.getCatServicios().toPromise().then(
      (servicios) => {
        this.serviciosEspecialidad = servicios;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.cronicaGrupalService.getCatTurnos().toPromise().then(
      (turnos) => {
        this.turnos = turnos;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.cronicaGrupalService.getCatGrupo('15').toPromise().then(
      (grupos) => {
        this.grupos = grupos;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.cronicaGrupalService.getCatLugar('15').toPromise().then(
      (lugares) => {
        this.lugares = lugares;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  //Metodo que se ejecuta al seleccionar un nuevo valor del catalogo de Servicio
  onChangeServicio() {
    //Consumimo catalogo de grupo by ServicioEspecialidad seleccionado
    this.cronicaGrupalService.getCatGrupo(this.servicioSelected).subscribe(
      (grupos) => {
        this.grupos = grupos;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    //Consumimo catalogo de grupo by ServicioEspecialidad seleccionado
    this.cronicaGrupalService.getCatLugar(this.servicioSelected).subscribe(
      (lugares) => {
        this.lugares = lugares;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.getCronicasGrupales();
  }

  //Metodo que se ejecuta al seleccionar un nuevo valor del catalogo de Turno
  onChangeTurno() {
    this.getCronicasGrupales();
  }

  //Metodo que se ejecuta al seleccionar un nuevo valor del catalogo de Grupo
  onChangeGrupo() {
    this.getCronicasGrupales();
  }

  //Metodo que se ejecuta al seleccionar un nuevo valor del catalogo de Lugar
  onChangeLugar() {
    this.getCronicasGrupales();
  }

  onChangeRadioBoton(value: Event) {
    this.getCronicasGrupales();
  }

  // validateAllDataFull(): boolean {
  //   if (this.servicioSelected !== '' && this.turnoSelected !== ''
  //     && this.grupoSelected !== '' && this.lugarSelected !== ''
  //     && this.fechaSelected !== null && this.radioBtnSelected) {
  //     return true;
  //   }
  //   return false;
  // }

  validarFormulario(): boolean {
    if (this.servicioSelected ||
      this.turnoSelected ||
      this.grupoSelected ||
      this.lugarSelected ||
      this.fechaSelected
    ) {
      return true;
    }
    return false;
  }

  getCronicasGrupales() {
    this.formularioValido = this.validarFormulario();    
    this.cronicasGrupales = [];
    if (this.formularioValido) {
      let fechaConvertedFormat;
      if (this.fechaSelected) {
        fechaConvertedFormat = this.fechaSelected.substring(6, 10) + "-" + this.fechaSelected.substring(3, 5) + "-" + this.fechaSelected.substring(0, 2);
      }
      this.cronicaGrupalService.getCronicasGrupalesByFiltros(this.servicioSelected !== '' ? this.servicioSelected : '-', this.turnoSelected !== '' ? Number(this.turnoSelected) : 0, this.grupoSelected !== '' ? Number(this.grupoSelected) : 0, this.lugarSelected !== '' ? this.lugarSelected : '-', fechaConvertedFormat ? fechaConvertedFormat : '0000-00-00', this.radioBtnSelected !== undefined ? this.radioBtnSelected : '-').subscribe(
        (cronicasGrupales: any) => {
          this.cronicasGrupales = cronicasGrupales;
        }
      ).add(() => {
        if (this.cronicasGrupales.length == 0) {
          this.muestraAlerta(
            'Verifique los filtros',
            'alert-warning',
            'Sin resultados',
          );
        }
      });
    } else {
      this.radioBtnSelected = undefined;
    }
  }

  addCronica() {
    this.router.navigate(["nueva-cronica-cero"]);
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
      if (cronicaGrupal.desTecnicaDidactica === null && cronicaGrupal.desDesarrolloSesion === null && cronicaGrupal.desObjetivosSesion === null && cronicaGrupal.desObservaciones === null && cronicaGrupal.desPerfilGrupo === null) {
        console.log("NO HAY INFO");
        this.router.navigate(["nuevaCronica"], { queryParams: params, skipLocationChange: true });
      } else {
        console.log("SI HAY INFO");
        this.router.navigate(["busquedaEspecifica"], { queryParams: params, skipLocationChange: true });
      }
    } else {
      console.log(" ENTRAMOS SIN VALOR ");
      if (cronicaGrupal.desTecnicaDidactica === null && cronicaGrupal.desDesarrolloSesion === null && cronicaGrupal.desObjetivosSesion === null && cronicaGrupal.desObservaciones === null && cronicaGrupal.desPerfilGrupo === null) {
        console.log("NO HAY INFO");
        this.router.navigate(["nuevaCronica"], { queryParams: params, skipLocationChange: true });
      } else {
        console.log("SI HAY INFO");
        this.router.navigate(["busquedaEspecifica"], { queryParams: params, skipLocationChange: true });
      }
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

  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string, funxion?: any) {
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
