import { Component, OnInit } from '@angular/core'
import { pacienteSeleccionado } from 'src/app/busqueda-nss/paciente.interface'
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { VolantesDonacionService } from 'src/app/service/volantes-donacion.service'
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface'
import * as moment from 'moment'
declare var $: any

@Component({
  selector: 'app-consulta-mp-administracion',
  templateUrl: './consulta-mp-administracion.component.html',
  styleUrls: ['./consulta-mp-administracion.component.css'],
  providers: [DatePipe],
})
export class ConsultaMpAdministracionComponent implements OnInit {
  paciente!: pacienteSeleccionado
  nomPaciente: any
  rolPaciente: string
  nssPaciente: string
  fechaDesde: string = ''
  fechaHasta: string = ''
  page: number = 1
  pageSize: number = 15
  datosBusqueda: Array<any> = []
  // datosBusqueda=[
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  //   {"fecEfec":"20/06/1996", "nss":"24567890567", "paciente":"Luis Fernando Gregorio Hernández", "medicoTratante":"Luis Fernando Gregorio Hernández", "trabajadorSocial":"Arturo López Gomez"},
  // ]
  columnaId: string = 'fecha'
  order: string = 'desc'
  rolUser = ''
  cveUsuario = ''
  nombre = ''
  public alert!: AlertInfo

  constructor(
    private router: Router,
    private volantesDonacionService: VolantesDonacionService,
    private tarjetaService: AppTarjetaPresentacionService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {}

  limpiar() {
    this.fechaDesde = ''
    this.fechaHasta = ''
    this.datosBusqueda = []
  }

  sortBy(columnaId: string, order: string, type: string) {
    this.columnaId = columnaId
    this.order = order

    this.datosBusqueda.sort((a: any, b: any) => {
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
    $('#fechaDesde').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.fechaDesde = date
        }
      },
    })

    $('#fechaHasta').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.fechaHasta = date
        }
      },
    })
  }

  buscar() {
    if (this.datosBusqueda.length == 0) {
      this.muestraAlerta(
        'Valide los filtros',
        'alert-warning',
        'Sin resultados',
      )
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
}
