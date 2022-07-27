import { Component, OnInit } from '@angular/core'
import { pacienteSeleccionado } from 'src/app/busqueda-nss/paciente.interface'
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface'
import * as moment from 'moment'
import { AvisoMinisterioPublicoService } from 'src/app/service/aviso-mp.service'
declare var $: any

@Component({
  selector: 'app-consulta-mp-administracion',
  templateUrl: './consulta-mp-administracion.component.html',
  styleUrls: ['./consulta-mp-administracion.component.css'],
  providers: [DatePipe],
})
export class ConsultaMpAdministracionComponent implements OnInit {
  pacienteSeleccionado!: pacienteSeleccionado
  paciente!: pacienteSeleccionado
  isCollapsed: boolean[] = []
  nomPaciente: any
  rolPaciente: string
  nssPaciente: string
  fecDesde: string = ''
  fecHasta: string = ''
  page: number = 1
  pageSize: number = 15
  listaResultados: Array<any> = []
  totalResultados: number
  selectFechaInicio: boolean = false;
  selectFechaFinal: boolean = false;
  columnaId: string = 'fecha'
  order: string = 'desc'
  rolUser = ''
  cveUsuario = ''
  nombre = ''
  public alert!: AlertInfo

  constructor(
    private router: Router,
    private avisoMinisterioPublicoService: AvisoMinisterioPublicoService,
    private tarjetaService: AppTarjetaPresentacionService,
    private datePipe: DatePipe,
  ) { }

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

  limpiar() {
    this.fecDesde = ''
    this.fecHasta = ''
    this.selectFechaInicio = false;
    this.selectFechaFinal = false;
    this.listaResultados = []
    this.totalResultados = 0
  }

  sortBy(columnaId: string, order: string, type: string) {
    this.columnaId = columnaId
    this.order = order

    this.listaResultados.sort((a: any, b: any) => {
      let c: any = this.converType(a[columnaId], type)

      let d: any = this.converType(b[columnaId], type)
      if (order === 'desc') {
        return d - c // Descendiente
      } else {
        return c - d // Ascendiente
      }
    })
  }

  converType(val: any, type: string) {
    let data
    switch (type) {
      case 'fecha':
        data = moment(val, 'DD/MM/YYYY')
        break
      case 'hora':
        data = moment(val, 'HH:mm:ss')
        break
      case 'number':
        data = parseInt(val)
        break

      default:
        break
    }
    return data
  }

  //asignacion de inputs a fecha
  ngAfterViewInit(): void {
    $('#fecDesde').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.fecDesde = date
        }
      },
    })

    $('#fecHasta').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.fecHasta = date
        }
      },
    })
  }

  buscar() {

    let fechaDesde = this.fecDesde;
    let fechaHasta = this.fecHasta;

    if (fechaDesde == "" && fechaHasta == "") {
      this.selectFechaInicio = true;
      this.selectFechaFinal = true;
      this.muestraAlerta(
        'Verifique los filtros',
        'alert-warning',
        'Sin resultados'
      );
    } else if (fechaDesde == "") {
      this.selectFechaInicio = true;
      this.selectFechaFinal = false;
    } else if (fechaHasta == "") {
      this.selectFechaFinal = true;
      this.selectFechaInicio = false;
    }
    else {
      this.selectFechaInicio = false;
      this.selectFechaFinal = false;
      if (fechaDesde.trim() != "" && fechaHasta.trim() != "") {
        //valida que el formato de la fecha se correcto
        let validaFechaDesde = moment(fechaDesde, 'DD/MM/YYYY', true).isValid();
        let validaFechaHasta = moment(fechaDesde, 'DD/MM/YYYY', true).isValid();
        if (!validaFechaHasta) {
          this.fecDesde = "";
          return;
        }
        if (!validaFechaHasta) {
          this.fecHasta = "";
          return;
        }

        if (validaFechaDesde && validaFechaHasta) {

          let fechaDesdeArray = fechaDesde.split("/");
          let fechaInicial = fechaDesdeArray[2] + "-" + fechaDesdeArray[1] + "-" + fechaDesdeArray[0];
          let fechaHastaArray = fechaHasta.split("/");
          let fechaFinal = fechaHastaArray[2] + "-" + fechaHastaArray[1] + "-" + fechaHastaArray[0];

          this.avisoMinisterioPublicoService.getDatosAvisosMp(fechaInicial, fechaFinal).subscribe({
            next: (resp: any) => {
              this.listaResultados = resp.datosAvisosMp;
              if (this.listaResultados.length == 0) {
                this.muestraAlerta(
                  'Verifique los filtros',
                  'alert-warning',
                  'Sin resultados'
                );
              } else {
                this.totalResultados = this.listaResultados.length;
              }
              this.sortBy(this.columnaId, this.order, 'fecha');
            }
          });


        }

      }

    }
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

  elementoSeleccionado(elemento: any) {
    this.pacienteSeleccionado = elemento;
    this.tarjetaService.add(this.pacienteSeleccionado);
    this.router.navigate(['consulta-notas'], { skipLocationChange: true });
  }

  muestra(i: number) {
    this.isCollapsed[i] = !this.isCollapsed[i];
  }

   //redirecciona al detalle
   irDetalle(idAvisoMp: string) {
    let verDetalle = "true";
    let params = { idAvisoMp,verDetalle };    
    this.router.navigate(["detalle-aviso-mp"], { queryParams: params, skipLocationChange: true });
  }

}
