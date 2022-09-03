import { TipoUbicacion } from './../../models/ubicacion-model'
import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { pacienteSeleccionado } from '../../busqueda-nss/paciente.interface'
import { Nota } from '../../models/notas.model'
import { ReporteNota } from '../../models/reporte-notas.model'
import { AuthService } from '../../service/auth-service.service'
import { NotasService } from '../../service/notas.service'
import { formatDate } from '@angular/common'
import { Usuario } from '../../models/usuario.model'
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface'

@Component({
  selector: 'app-consulta-nota-tsocial',
  templateUrl: './consulta-nota-tsocial.component.html',
  styleUrls: ['./consulta-nota-tsocial.component.css'],
})
export class ConsultaNotaTSocialComponent implements OnInit {
  alert!: AlertInfo
  public nota!: Nota
  public reporteNota!: ReporteNota
  public months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]
  public today: any
  public day: any
  public month: any
  public year: any
  public pacienteSeleccionado!: pacienteSeleccionado
  public datetimeFormat = ''
  public dateToday = new Date()
  public usuario!: Usuario
  umf: String
  noUmf: String
  infoUnidad: any
  estado: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notasService: NotasService,
    private authService: AuthService,
  ) {
    this.datetimeFormat = formatDate(
      this.dateToday,
      'yyyy/MM/dd hh:mm:ss',
      'en-ES',
    )
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.authService.setProjectObs('Trabajo Social')
    }, 0)
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.getAll('nota').length > 0) {
        this.nota = JSON.parse(params.getAll('nota'))
      }
      console.log('OBJETO ENVIADO PARA DETALLE: ', this.nota)
      if (params.getAll('nuevaNota').length > 0) {
        const nuevaNota = JSON.parse(params.getAll('nuevaNota'))
        if (nuevaNota) {
          this.muestraAlerta(
            '¡La información se guardo con éxito!',
            'alert-success',
            '',
          )
        }
      }
    })
    this.pacienteSeleccionado = JSON.parse(localStorage.getItem('paciente')!)
    let userTmp = sessionStorage.getItem('usuario') || ''
    if (userTmp !== '') {
      this.usuario = JSON.parse(userTmp)
      console.log('USER DATA: ', this.usuario)
    }
    this.obtenerInfoUnidadMedicaByMatricula()
  }

  update() {
    let params = {
      nota: JSON.stringify(this.nota),
    }
    this.router.navigate(['nueva-nota'], {
      queryParams: params,
      skipLocationChange: true,
    })
  }

  obtenerInfoUnidadMedicaByMatricula() {
    let matricula = this.usuario.matricula
    this.notasService.obtenerInformacionTSPorMatricula(matricula).subscribe(
      (res) => {
        this.infoUnidad = res.datosUsuario
        this.obtenerEstadoByUnidadMedica()
      },

      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse)
      },
    )
    console.log(this.infoUnidad)
  }

  obtenerEstadoByUnidadMedica() {
    this.notasService
      .obtenerEstadoporUnidadMedica(this.infoUnidad.unidadMedica)
      .subscribe(
        (res) => {
          this.estado = res[0]
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse)
        },
      )
  }

  imprimir() {
    let saludo = String(this.pacienteSeleccionado.unidadMedica)
    this.umf = saludo.split(' ')[0]
    this.noUmf = saludo.split(' ')[1]

    let fechaTransformada = this.datetimeFormat
    this.reporteNota = {
      unidad: String(this.umf + ' ' + this.noUmf),
      ooad: this.estado.des_nombre_delegacion_umae.toUpperCase(),
      unidad2: this.estado.des_denominacion_unidad.toUpperCase(),
      turno: this.infoUnidad.turno.toUpperCase(),
      servicio: this.infoUnidad.Especialidad.toUpperCase(),
      nss: String(this.pacienteSeleccionado.nss),
      aMedico: String(this.pacienteSeleccionado.agregadoMedico),
      nombrePaciente: this.pacienteSeleccionado.paciente.toUpperCase(),
      curp: String(this.pacienteSeleccionado.curp),
      consultorio: String(this.pacienteSeleccionado.consultorio),
      fechaN: this.pacienteSeleccionado.fechaNacimiento.toString(),
      nombreTS:
        this.usuario.strNombres +
        ' ' +
        this.usuario.strApellidoP +
        ' ' +
        this.usuario.strApellidoM,
      matriculaTS: this.usuario.matricula,
      nombreTS2:
        this.usuario.strNombres +
        ' ' +
        this.usuario.strApellidoP +
        ' ' +
        this.usuario.strApellidoM,
      matriculaTS2: '',
      tipoNota: this.nota.nombreTipoNota,
      redApoyo: this.nota.nombreRedApoyo,
      actividadTecnica: this.nota.nombreActividadTecnica,
      diagnostico: this.nota.nombreDiagnostico,
      redaccion: this.nota.redaccion,
      tipoNota2: '',
      redApoyo2: '',
      actividadTecnica2: '',
      diagnostico2: '',
      redaccion2: '',
      fecha1: fechaTransformada,
      fecha2: fechaTransformada,
      fecImpresion: fechaTransformada,
      diagnosticoSocial: this.nota.diagnostico,
      diagnosticoSocial2: '',
    }
    console.log('DATA NOTA REPORTE: ', this.reporteNota)
    this.notasService.downloadPdf(this.reporteNota).subscribe(
      (response: Blob) => {
        var file = new Blob([response], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(file)
        window.open(url)
      },
      (error: HttpErrorResponse) => {
        console.error('Error al descargar reporte: ', error.message)
      },
    )
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
