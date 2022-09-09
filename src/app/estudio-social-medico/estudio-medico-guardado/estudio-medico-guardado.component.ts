import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { pacienteSeleccionado } from '../../busqueda-nss/paciente.interface'
import { objAlert } from '../../common/alerta/alerta.interface'
import { EstadoCivil } from '../../models/estado-civil.model'
import { EstudioMedico } from '../../models/estudio-medico.model'
import { Ocupacion } from '../../models/ocupacion.model'
import { EstudioSocialMedicoService } from '../../service/estudio-social-medico.service'
import { formatDate } from '@angular/common'
import * as moment from 'moment'
import { Estado } from '../../models/estado.model'
import { Ciudad } from '../../models/ciudad.model'
import { Municipio } from '../../models/municipio.model'
import { Usuario } from 'src/app/models/usuario.model'
@Component({
  selector: 'app-estudio-medico-guardado',
  templateUrl: './estudio-medico-guardado.component.html',
  styleUrls: ['./estudio-medico-guardado.component.css'],
})
export class EstudioMedicoGuardadoComponent implements OnInit {
  alert!: objAlert
  executed: boolean = false
  datosGenerales = false
  datosFamiliar = false
  datosExploracionCaso = false
  estudioMedico!: EstudioMedico
  pacienteSeleccionado!: pacienteSeleccionado
  ocupaciones: Ocupacion[] = []
  catEstadosCiviles: EstadoCivil[] = []
  estados: Estado[] = []
  delegaciones: Municipio[] = []
  ciudades: Ciudad[] = []
  estadosFamiliar: Estado[] = []
  delegacionesFamiliar: Municipio[] = []
  ciudadesFamiliar: Ciudad[] = []
  datetimeFormat = ''
  dateToday = new Date()
  infoUnidad: any
  estado: any
  public usuario!: Usuario

  constructor(
    private route: ActivatedRoute,
    private estudioMedicoService: EstudioSocialMedicoService,
  ) {
    this.datetimeFormat = formatDate(
      this.dateToday,
      'dd/MM/yyyy hh:mm:ss aa',
      'en-ES',
    )
  }

  async ngOnInit() {
    this.datosGenerales = true
    this.datosFamiliar = false
    this.datosExploracionCaso = false
    await this.loadCatalogos()
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.getAll('estudioMedico').length > 0) {
        this.estudioMedico = JSON.parse(params.getAll('estudioMedico'))
        let userTmp = sessionStorage.getItem('usuario') || ''
        if (userTmp !== '') {
          this.usuario = JSON.parse(userTmp)
          console.log('USER DATA: ', this.usuario)
        }
        if (this.estudioMedico.esNuevo) {
          this.muestraAlerta(
            '¡La información se guardó con éxito!',
            'alert-success',
            '',
          )
        }
        this.estudioMedico.nombreEstado = this.getNombreEstado(
          this.estudioMedico.idEstado,
        )
        this.getMunicipiosByEstado(parseInt(this.estudioMedico.idEstado), false)
        this.estudioMedico.nombreEstadoFam = this.getNombreEstado(
          this.estudioMedico.idEstadoFam,
        )
        this.getMunicipiosByEstado(
          parseInt(this.estudioMedico.idEstadoFam),
          true,
        )
      }
      console.log('OBJETO ENVIADO PARA DETALLE: ', this.estudioMedico)
    })
    this.pacienteSeleccionado = JSON.parse(localStorage.getItem('paciente')!)
    console.log('PACIENTE: ', this.pacienteSeleccionado)

    this.obtenerInfoUnidadMedicaByMatricula();
  }

  irDatosDeFamiliar() {
    this.datosGenerales = false
    this.datosFamiliar = true
    this.datosExploracionCaso = false
  }

  irExploracionCaso() {
    this.datosGenerales = false
    this.datosFamiliar = false
    this.datosExploracionCaso = true
  }

  irDatosGenerales() {
    this.datosGenerales = true
    this.datosFamiliar = false
    this.datosExploracionCaso = false
  }

  async loadCatalogos() {
    await this.estudioMedicoService
      .getCatEstadosCiviles()
      .toPromise()
      .then(
        (estadosCiviles: any) => {
          this.catEstadosCiviles = estadosCiviles
          console.log('ESTADO CIVILES: ', this.catEstadosCiviles)
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse)
        },
      )
    this.estudioMedicoService
      .getCatOcupaciones()
      .toPromise()
      .then(
        (ocupaciones: Ocupacion[]) => {
          this.ocupaciones = ocupaciones
          console.log('OCUPACIONES: ', this.ocupaciones)
        },

        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse)
        },
      )
    await this.estudioMedicoService
      .getCatEstados()
      .toPromise()
      .then(
        (estados: Estado[]) => {
          this.estados = estados
        },

        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse)
        },
      )
  }

  getMunicipiosByEstado(idEstado: number, esFamiliar: boolean): void {
    this.estudioMedicoService
      .getCatMunicipiosByEstado(idEstado)
      .toPromise()
      .then(
        (delegaciones: Municipio[]) => {
          if (esFamiliar) {
            this.delegacionesFamiliar = delegaciones
            this.estudioMedico.nombreDelegacionMunicipioFam = this.getNombreMunicipio(
              this.estudioMedico.idDelegacionMunicipioFam.toString(),
              true,
            )
            this.getCiudadByEstadoMunicipo(
              idEstado,
              parseInt(this.estudioMedico.idDelegacionMunicipioFam.toString()),
              true,
            )
          } else {
            this.delegaciones = delegaciones
            this.estudioMedico.nombreDelegacionMunicipio = this.getNombreMunicipio(
              this.estudioMedico.idDelegacionMunicipio,
              false,
            )
            this.getCiudadByEstadoMunicipo(
              idEstado,
              parseInt(this.estudioMedico.idDelegacionMunicipio),
              false,
            )
          }
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse)
        },
      )
  }

  getCiudadByEstadoMunicipo(
    idEstado: number,
    idMunicipio: number,
    esFamiliar: boolean,
  ): void {
    this.estudioMedicoService
      .getCiudadByEstadoMunicipio(idEstado, idMunicipio)
      .toPromise()
      .then(
        (ciudades: Ciudad[]) => {
          this.ciudades = ciudades
          if (this.ciudades.length === 1) {
            if (esFamiliar) {
              this.estudioMedico.nombreCiudadFam = this.ciudades[0].des_ciudad
            } else {
              this.estudioMedico.nombreCiudad = this.ciudades[0].des_ciudad
            }
          }
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse)
        },
      )
  }

  getNombreEstado(idEstado: string) {
    return this.estados.find((e) => e.cve_estado === idEstado)
      ?.des_nombre_completo
  }

  getNombreMunicipio(idMunicipio: string, esFamiliar: boolean) {
    if (esFamiliar) {
      return this.delegacionesFamiliar.find(
        (d) => parseInt(d.cve_delegacion_municipio) === parseInt(idMunicipio),
      )?.des_municipio
    } else {
      return this.delegaciones.find(
        (m) => parseInt(m.cve_delegacion_municipio) === parseInt(idMunicipio),
      )?.des_municipio
    }
  }

  getNombreOcupacion(idOcupacion: number | string) {
    let idOcupacionConverted: number
    if (typeof idOcupacion === 'string') {
      idOcupacionConverted = Number(idOcupacion)
    } else if (typeof idOcupacion === 'number') {
      idOcupacionConverted = idOcupacion
    }
    return this.ocupaciones.find((e) => e.id_OCUPACION === idOcupacionConverted)
      ?.nom_OCUPACION
  }

  getNombreEstadoCivil(idEstadoCivil: number | string) {
    let idEstadoCivilConverted: number
    if (typeof idEstadoCivil === 'string') {
      idEstadoCivilConverted = Number(idEstadoCivil)
    } else if (typeof idEstadoCivil === 'number') {
      idEstadoCivilConverted = idEstadoCivil
    }
    return this.catEstadosCiviles.find((e) => e.id === idEstadoCivilConverted)
      ?.descripcion
  }

  convertDate(fechaNacimiento: String): string {
    let stringDate =
      fechaNacimiento.substring(3, 5) +
      '-' +
      fechaNacimiento.substring(0, 2) +
      '-' +
      fechaNacimiento.substring(6, 10)
    let birthDate = new Date(stringDate)
    console.log('FECHA: ', birthDate)
    let today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    console.log('EDAD: ', age)
    if (months > 0) {
      console.log('MESES: ', months)
      months = months
    } else {
      months = months + 12
      console.log('MESES: ', months)
    }
    return months + ' meses'
  }

  obtenerInfoUnidadMedicaByMatricula() {
    let matricula = this.usuario.matricula
    this.estudioMedicoService
      .obtenerInformacionTSPorMatricula(matricula)
      .subscribe(
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
    this.estudioMedicoService
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
    let fechaTransformada = this.datetimeFormat
    let reporteEstudioMedicoSocial: any = {
      ooad: this.estado.des_nombre_delegacion_umae.toUpperCase(),
      unidad2: this.estado.des_denominacion_unidad.toUpperCase(),
      unidad: '' + this.pacienteSeleccionado.unidadMedica,
      turno: this.infoUnidad.turno.toUpperCase(),
      // servicio: this.infoUnidad.Especialidad.toUpperCase(),
      servicio: "TRABAJO SOCIAL",
      cvePtal: this.estado.des_clave_presupuestal,
      fecImpresion: fechaTransformada,
      nss: this.pacienteSeleccionado.nss,
      aMedico: this.pacienteSeleccionado.agregadoMedico,
      nombrePaciente: this.pacienteSeleccionado.paciente.toUpperCase(),
      curp: this.pacienteSeleccionado.curp,
      consultorio: this.pacienteSeleccionado.consultorio,
      edad:
        this.pacienteSeleccionado.edad +
        ' años ' +
        this.convertDate(this.pacienteSeleccionado.fechaNacimiento),
      sexo: this.pacienteSeleccionado.sexo === 'M' ? 'Masculino' : 'Femenino',
      calle: this.estudioMedico.nomVialidad,
      numeroInt: this.estudioMedico.numInterior,
      colonia: this.estudioMedico.nomColonia,
      cp: this.estudioMedico.codigoPostal,
      estado: this.estudioMedico.nombreEstado,
      tcasa: this.estudioMedico.numTelefonoFijo,
      tcelular: this.estudioMedico.numTelefonoCelular,
      correo: this.estudioMedico.correoElectronico,
      objetivoEstudio: this.estudioMedico.objetivoEstudio,
      datosPaciente: this.estudioMedico.datoPaciente,
      datosFamiliares: this.estudioMedico.datoFamiliar,
      datosEconomicos: this.estudioMedico.datoEconomico,
      municipio: this.estudioMedico.nombreDelegacionMunicipio,
      estudioSolicitado: this.estudioMedico.nombreSolicitante?.toUpperCase(),
      fechaEstudio: moment(this.estudioMedico.fecFecha, 'YYYY-MM-DD').format(
        'DD/MM/YYYY',
      ),
      datosComplement: this.estudioMedico.datoComplementario,
      diagSocialPac: this.estudioMedico.diagSocialPaciente,
      diagSocialFam: this.estudioMedico.diagSocialFamilia,
      planTratSocial: this.estudioMedico.planTratSocial,
      accRealizadas: this.estudioMedico.accionRealizada,
      condicHogar: this.estudioMedico.condicionHogar,
    }

    console.log('DATA REPORT: ', reporteEstudioMedicoSocial)
    this.estudioMedicoService.downloadPdf(reporteEstudioMedicoSocial).subscribe(
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
    this.alert = new objAlert()
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
    }, 2000)
  }
}
