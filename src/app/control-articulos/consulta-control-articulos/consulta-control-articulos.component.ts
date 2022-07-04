import {AfterViewInit, Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { HttpErrorResponse } from '@angular/common/http'
import * as moment from 'moment'
import { ControlArticulosService } from 'src/app/service/control-articulos.service'
import { ControlArticulos } from 'src/app/models/control-articulo.model'
import { pacienteSeleccionado } from 'src/app/busqueda-nss/paciente.interface'
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service'
import { DatePipe } from '@angular/common'

declare var $: any

@Component({
  selector: 'app-consulta-control-articulos',
  templateUrl: './consulta-control-articulos.component.html',
  styleUrls: ['./consulta-control-articulos.component.css'],
  providers: [DatePipe]
})
export class ConsultaControlArticulosComponent implements OnInit, AfterViewInit {

  paciente!: pacienteSeleccionado;
  nomPaciente: any;
  rolPaciente: string;
  nssPaciente: string;
  fechaDesde: string = "";
  fechaHasta: string = "";
  page: number = 1;
  pageSize: number = 10;
  datosBusqueda: Array<any> = [];
  columnaId: string = 'fecha';
  order: string = 'desc';
  rolUser = "";
  cveUsuario = "";
  nombre = "";

  constructor(
    private router: Router,
    private Artservice: ControlArticulosService,
    private tarjetaService: AppTarjetaPresentacionService,
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
    $('#fechaDesde').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.fechaDesde = date;
        }
      },

    });

    $('#fechaHasta').datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {

          this.fechaHasta = date;
        }
      }

    });
  }

  limpiar() {
    this.fechaDesde = "";
    this.fechaHasta = "";
    this.datosBusqueda = [];
  }

  buscar() {

    let fechaDesde = this.fechaDesde;
    let fechaHasta = this.fechaHasta;

    if (fechaDesde.trim() != "" && fechaHasta.trim() != "") {
      //valida que el formato de la fecha se correcto
      let validaFechaDesde = moment(fechaDesde, 'DD/MM/YYYY', true).isValid();
      let validaFechaHasta = moment(fechaDesde, 'DD/MM/YYYY', true).isValid();
      if (!validaFechaHasta) {
        this.fechaDesde = "";
        return;
      }
      if (!validaFechaHasta) {
        this.fechaHasta = "";
        return;
      }

      if (validaFechaDesde && validaFechaHasta) {

        let fechaDesdeArray = fechaDesde.split("/");
        let fechaInicial = fechaDesdeArray[2] + "-" + fechaDesdeArray[1] + "-" + fechaDesdeArray[0];
        let fechaHastaArray = fechaHasta.split("/");
        let fechaFinal = fechaHastaArray[2] + "-" + fechaHastaArray[1] + "-" + fechaHastaArray[0];
        let datosBusqueda = {
          bitacora: [{
            aplicativo: "control-articulos",
            flujo: "post",
            idUsuario: this.cveUsuario,
            nombreUsuario: this.nombre,
            tipoUsuario: this.rolUser,
          }],
          fechaInicial: fechaInicial,
          fechaFinal: fechaFinal,
          clavePaciente: this.nssPaciente
        };
        this.Artservice.getArticulosByFechas(datosBusqueda).subscribe(
          (res: any) => {
            try {
              let response = res.response;
              let estatus = response.status;
              if (estatus == 'OK') {
                this.datosBusqueda = response.listaControlArticulosDto;
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
        );

      }

    }
  }

  //redirecciona al detalle
  irDetalle(controlArticulos: ControlArticulos) {
    let params = {
      'controlArticulos': JSON.stringify(controlArticulos),
    }
    this.router.navigateByUrl("/detalle-control-articulos/" + controlArticulos.idCa, { skipLocationChange: true })
  }


  //redirecciona a la pantalla de nuevo control de articulos
  irNuevoRegistro() {
    this.router.navigateByUrl("/nuevo-articulo", { skipLocationChange: true });
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
