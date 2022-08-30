import { AfterViewInit, Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import { pacienteSeleccionado } from 'src/app/busqueda-nss/paciente.interface'
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { VolantesDonacionService } from 'src/app/service/volantes-donacion.service'
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface'
import { AuthService } from 'src/app/service/auth-service.service'
import { VolantesDonacion } from 'src/app/models/volantes-donacion.model'
import { HttpErrorResponse } from '@angular/common/http'
declare var $: any

@Component({
  selector: 'app-consulta-donacion-sangre-administracion',
  templateUrl: './consulta-donacion-sangre-administracion.component.html',
  styleUrls: ['./consulta-donacion-sangre-administracion.component.css'],
  providers: [DatePipe],
})
export class ConsultaDonacionSangreAdministracionComponent
  implements OnInit, AfterViewInit {
  idVolanteDonacion: string = ''
  volantesDonacion!: VolantesDonacion
  pacienteSeleccionado!: pacienteSeleccionado
  resultadoTotal: number = 0
  errorBusqueda: boolean = false
  totalResultados: number = 0
  order: string = 'desc'
  columnaId: string = 'fecha'
  selectFechaInicio: boolean = false
  selectFechaFinal: boolean = false
  selectTipoSangre: boolean = false
  paciente!: pacienteSeleccionado
  nomPaciente: any
  rolPaciente: string
  nssPaciente: string
  fechaDesde1: string = ''
  fechaHasta1: string = ''
  tiposangre: string = ''
  tipoSangreSeleccionada: string = ''
  page: number = 1
  pageSize: number = 15
  datosBusqueda: Array<any> = []
  rolUser = ''
  cveUsuario = ''
  nombre = ''
  public alert!: AlertInfo
  listaPacientes: any[] = []
  listaResultados: any[] = []

  constructor(
    private router: Router,
    private volantesDonacionService: VolantesDonacionService,
    private tarjetaService: AppTarjetaPresentacionService,
    private authService: AuthService,
    private volantesService: VolantesDonacionService,
  ) {}

  ngAfterContentInit(): void {
    this.authService.setProjectObs('Trabajo social')
  }

  ngOnInit(): void {
    let userTmp = sessionStorage.getItem('usuario') || ''
    this.paciente = this.tarjetaService.get()
    if (this.paciente !== null && this.paciente !== undefined) {
      this.nssPaciente = this.paciente.nss.toString()
      this.nomPaciente = this.paciente.paciente
    }

    if (userTmp !== '') {
      let usuario = JSON.parse(userTmp)
      this.nombre =
        usuario?.strNombres +
        ' ' +
        usuario?.strApellidoP +
        ' ' +
        usuario?.strApellidoM
      this.rolUser = usuario?.rolUser
      this.cveUsuario = usuario?.cveUsuario
    }
  }
  //asignacion de inputs a fecha
  ngAfterViewInit(): void {
    $('#fechaDesde1').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.fechaDesde1 = date
        }
      },
    })

    $('#fechaHasta1').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.fechaHasta1 = date
        }
      },
    })
  }

  limpiar() {
    this.fechaDesde1 = ''
    this.fechaHasta1 = ''
    this.tiposangre = ''
    this.listaResultados = []
    this.totalResultados = 0
    this.selectFechaInicio = false
    this.selectFechaFinal = false
    this.selectTipoSangre = false
  }

  buscar() {
    let fechaDesde = this.fechaDesde1
    let fechaHasta = this.fechaHasta1
    let tipoSangre = this.tiposangre

    if (fechaDesde == '' && fechaHasta == '' && tipoSangre == '') {
      this.selectFechaInicio = true
      this.selectFechaFinal = true
      this.selectTipoSangre = true
    } else if (fechaDesde == '' && tipoSangre == '') {
      this.selectFechaInicio = true
      this.selectTipoSangre = true
      this.selectFechaFinal = false
    } else if (fechaDesde == '' && fechaHasta == '') {
      this.selectFechaInicio = true
      this.selectTipoSangre = false
      this.selectFechaFinal = true
    } else if (fechaHasta == '' && tipoSangre == '') {
      this.selectFechaFinal = true
      this.selectTipoSangre = true
      this.selectFechaInicio = false
    } else if (fechaHasta == '' && fechaDesde == '') {
      this.selectFechaFinal = true
      this.selectFechaInicio = true
      this.selectTipoSangre = false
    } else if (fechaDesde == '') {
      this.selectFechaInicio = true
      this.selectFechaFinal = false
      this.selectTipoSangre = false
    } else if (fechaHasta == '') {
      this.selectFechaFinal = true
      this.selectFechaInicio = false
      this.selectTipoSangre = false
    } else if (tipoSangre == '') {
      this.selectTipoSangre = true
      this.selectFechaFinal = false
      this.selectFechaInicio = false
    } else {
      this.selectFechaInicio = false
      this.selectFechaFinal = false
      this.selectTipoSangre = false
      this.getTipoSangre(tipoSangre)
      if (fechaDesde.trim() != '' && fechaHasta.trim() != '') {
        //valida que el formato de la fecha se correcto
        let validaFechaDesde = moment(fechaDesde, 'DD/MM/YYYY', true).isValid()
        let validaFechaHasta = moment(fechaDesde, 'DD/MM/YYYY', true).isValid()
        if (!validaFechaHasta) {
          this.fechaDesde1 = ''
          return
        }
        if (!validaFechaHasta) {
          this.fechaHasta1 = ''
          return
        }

        if (validaFechaDesde && validaFechaHasta) {
          let fechaDesdeArray = fechaDesde.split('/')
          let fechaInicial =
            fechaDesdeArray[2] +
            '-' +
            fechaDesdeArray[1] +
            '-' +
            fechaDesdeArray[0]
          let fechaHastaArray = fechaHasta.split('/')
          let fechaFinal =
            fechaHastaArray[2] +
            '-' +
            fechaHastaArray[1] +
            '-' +
            fechaHastaArray[0]

          this.volantesDonacionService
            .getVolantesAdministracion(
              fechaInicial,
              fechaFinal,
              this.tipoSangreSeleccionada,
            )
            .subscribe({
              next: (resp: any) => {
                this.listaResultados = resp.datosVolantesDonacion
                if (this.listaResultados.length == 0) {
                  this.errorBusqueda = true
                  this.muestraAlerta(
                    'Verifique los filtros',
                    'alert-warning',
                    'Sin resultados',
                  )
                } else {
                  this.totalResultados = this.listaResultados.length
                }
                this.sortBy(this.columnaId, this.order, 'fecha')
              },
            })
        }
      }
    }
  }

  //redirecciona al detalle
  irDetalle(idVolanteDonacionSangre: string) {
    this.volantesDonacionService
      .getDetatelleVolanteDonacion(idVolanteDonacionSangre)
      .subscribe(
        (res: any) => {
          console.log(res)
          try {
            let estatus = res.status
            if (estatus == 'OK') {
              try {
                this.volantesDonacion = res.datosVolantesDonacion
                idVolanteDonacionSangre = res.datosVolantesDonacion
                this.impirmiVolante()
              } catch (error) {
                console.error(error)
              }
            }
          } catch (error) {
            console.error(error)
          }
        },
        (error: any) => {
          console.error(error)
        },
      )
  }

  impirmiVolante() {
    let nss = ''
    let desNssAgregado = ''
    let timHoraFinalAtencion = ''
    let timHoraInicialAtencion = ''
    this.volantesDonacion.nssCompleto = this.volantesDonacion?.desNssAgregado
    try {
      let datosnss = this.volantesDonacion?.desNssAgregado.split(' ')
      nss = datosnss[0]
      desNssAgregado = datosnss[1]
      let hora1 = this.volantesDonacion?.timHoraInicialAtencion.split(':')
      timHoraInicialAtencion = hora1[0] + ':' + hora1[1]
      let hora2 = this.volantesDonacion?.timHoraFinalAtencion.split(':')
      timHoraFinalAtencion = hora2[0] + ':' + hora2[1]
    } catch (error) {
      console.log(error)
    }
    this.volantesDonacion.desNssAgregado = desNssAgregado
    this.volantesDonacion.nss = nss
    this.volantesDonacion.timHoraFinalAtencion = timHoraFinalAtencion
    this.volantesDonacion.timHoraInicialAtencion = timHoraInicialAtencion
    this.volantesService.downloadPdf(this.volantesDonacion).subscribe(
      (response: any) => {
        // console.log(response);
        var file = new Blob([response], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(file)
        window.open(url)
        this.volantesDonacion.desNssAgregado = this.volantesDonacion?.nssCompleto
      },
      (error: HttpErrorResponse) => {
        this.volantesDonacion.desNssAgregado = this.volantesDonacion?.nssCompleto
        console.error(error)
        console.error('Error al descargar reporte: ', error.message)
      },
    )
  }

  //ordenamiento
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

  getTipoSangre(valor: string) {
    if (valor == '1') {
      this.tipoSangreSeleccionada = 'a+'
    } else if (valor == '2') {
      this.tipoSangreSeleccionada = 'a-'
    } else if (valor == '3') {
      this.tipoSangreSeleccionada = 'b+'
    } else if (valor == '4') {
      this.tipoSangreSeleccionada = 'b-'
    } else if (valor == '5') {
      this.tipoSangreSeleccionada = 'o+'
    } else if (valor == '6') {
      this.tipoSangreSeleccionada = 'o-'
    } else if (valor == '7') {
      this.tipoSangreSeleccionada = 'ab+'
    } else if (valor == '8') {
      this.tipoSangreSeleccionada = 'ab-'
    } else {
      this.tipoSangreSeleccionada = ''
    }
  }
}
