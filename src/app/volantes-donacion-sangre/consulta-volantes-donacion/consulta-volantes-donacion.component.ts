import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { pacienteSeleccionado } from 'src/app/busqueda-nss/paciente.interface'
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service'
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { VolantesDonacionService } from 'src/app/service/volantes-donacion.service';
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface';
declare var $: any;

@Component({
  selector: 'app-consulta-volantes-donacion',
  templateUrl: './consulta-volantes-donacion.component.html',
  styleUrls: ['./consulta-volantes-donacion.component.css'],
  providers: [DatePipe]
})
export class ConsultaVolantesDonacionComponent implements OnInit, AfterViewInit {

  paciente!: pacienteSeleccionado;
  nomPaciente: any;
  rolPaciente: string;
  nssPaciente: string;
  // fechaDesde: string = "";
  vDonacionIni: string = "";
  // fechaHasta: string = "";
  vDonacionFin: string = "";
  page: number = 1;
  pageSize: number = 15;
  datosBusqueda: Array<any> = [];
  columnaId: string = 'fecha';
  order: string = 'desc';
  rolUser = "";
  cveUsuario = "";
  nombre = "";
  public alert!: AlertInfo;

  constructor(
    private router: Router,
    private volantesDonacionService: VolantesDonacionService,
    private tarjetaService: AppTarjetaPresentacionService,
    private datePipe: DatePipe,
  ) {

  }

  ngOnInit(): void {
    let userTmp = sessionStorage.getItem('usuario') || '';
    this.paciente = this.tarjetaService.get();
    if (this.paciente !== null && this.paciente !== undefined) {
      this.nssPaciente = this.paciente.nss.toString();
      this.nomPaciente = this.paciente.paciente;
    }

    if (userTmp !== '') {
      let usuario = JSON.parse(userTmp);
      this.nombre = usuario?.strNombres + " " + usuario?.strApellidoP + " " + usuario?.strApellidoM;
      this.rolUser = usuario?.rolUser;
      this.cveUsuario = usuario?.cveUsuario;
    }
  }
  //asignacion de inputs a fecha
  ngAfterViewInit(): void {
    $('#vDonacionIni').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.vDonacionIni = date;
        }
      },

    });

    $('#vDonacionFin').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {

          this.vDonacionFin = date;
        }
      }

    });
  }


  limpiar() {
    this.vDonacionIni = "";
    this.vDonacionFin = "";
    this.datosBusqueda = [];
  }

  buscar() {

    let vDonacionIni = this.vDonacionIni;
    let vDonacionFin = this.vDonacionFin;

    if (vDonacionIni.trim() != "" && vDonacionFin.trim() != "") {
      //valida que el formato de la fecha se correcto
      let validaFechaDesde = moment(vDonacionIni, 'DD/MM/YYYY', true).isValid();
      let validaFechaHasta = moment(vDonacionIni, 'DD/MM/YYYY', true).isValid();
      if (!validaFechaHasta) {
        this.vDonacionIni = "";
        return;
      }
      if (!validaFechaHasta) {
        this.vDonacionFin = "";
        return;
      }

      if (validaFechaDesde && validaFechaHasta) {
        let fechaDesdeArray = vDonacionIni.split("/");
        let fechaInicial = fechaDesdeArray[2] + "-" + fechaDesdeArray[1] + "-" + fechaDesdeArray[0];
        let fechaHastaArray = vDonacionFin.split("/");
        let fechaFinal = fechaHastaArray[2] + "-" + fechaHastaArray[1] + "-" + fechaHastaArray[0];

        let datosBusqueda = {
          fechaIni: fechaInicial,
          fechaFin: fechaFinal,
          nssPaciente: this.nssPaciente,
          agregadoMedico: this.paciente.agregadoMedico,
        };

        this.volantesDonacionService.getVolantesByFechas(datosBusqueda).subscribe(
          (res: any) => {
            console.log(res)
            try {

              let estatus = res.status;
              console.log(res.datosVolantesDonacion)
              if (estatus == 'OK') {
                this.datosBusqueda = res.datosVolantesDonacion;
              } else {
                this.datosBusqueda = [];
              }
            } catch (error) {
              this.datosBusqueda = [];
              console.error(error);
            }
          },
          (httpErrorResponse: HttpErrorResponse) => {
            console.error(httpErrorResponse);
          }
        ).add(() => {
          if (this.datosBusqueda.length == 0) {
            this.mostrarAlertaFiltros();
          }
        });
      } else {
        this.mostrarAlertaFiltros();
      }
    } else {
      this.mostrarAlertaFiltros();
    }
  }

  mostrarAlertaFiltros() {
    this.muestraAlerta(
      'Valide los filtros',
      'alert-warning',
      'Sin resultados',
    )
  }

  //redirecciona al detalle
  irDetalle(idVolanteDonacionSangre: string) {
    this.router.navigateByUrl("/detalle-volante-donacion-sangre/" + idVolanteDonacionSangre)
  }


  //redirecciona a la pantalla de nuevo control de articulos
  irNuevoRegistro() {
    this.router.navigateByUrl("/agregar-volante-donacion-sangre");
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

  muestraAlerta(
    mensaje: string,
    estilo: string,
    tipoMsj?: string,
    funxion?: any,
  ) {
    this.alert = new AlertInfo()
    this.alert = {
      message: mensaje,
      type: estilo,
      visible: true,
      typeMsg: tipoMsj,
    }
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false,
      }
      if (funxion != null) {
        funxion()
      }
    }, 5000)
  }

}
