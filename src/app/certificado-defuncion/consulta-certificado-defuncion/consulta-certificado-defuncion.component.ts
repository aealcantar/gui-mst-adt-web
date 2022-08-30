import { AfterViewInit, Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import * as moment from 'moment'
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface'
import { CertificadoDefuncionService } from 'src/app/service/certificado-defuncion.service'
import { CertificadoDefuncion } from 'src/app/models/certificado-defuncion.model'
import { pacienteSeleccionado } from '../../busqueda-nss/paciente.interface'
import { AppTarjetaPresentacionService } from 'src/app/app-tarjeta-presentacion/app-tarjeta-presentacion.service'
import { HttpErrorResponse } from '@angular/common/http'
import { AuthService } from 'src/app/service/auth-service.service'

declare var $: any
@Component({
  selector: 'app-consulta-certificado-defuncion',
  templateUrl: './consulta-certificado-defuncion.component.html',
  styleUrls: ['./consulta-certificado-defuncion.component.css'],
})
export class ConsultaCertificadoDefuncionComponent
  implements OnInit, AfterViewInit {
  // formAdd;
  validarCampos: boolean = false
  public fechaSelected!: string
  paginacion: any
  public page: number = 1
  public pageSize: number = 15
  public resultadoTotal: number = 0
  public dtOptions: DataTables.Settings = {}
  public numitems: number = 15
  public order: string = 'desc'
  public tabla: any[] = []
  public extras: any
  public datesForm!: FormGroup
  public columnaId: string = 'fecFecha'
  datosBusqueda: Array<CertificadoDefuncion> = []
  public alert!: AlertInfo
  //se utiliza para el Sort desde el back end
  criteriosDeOrden: Array<any> = []
  public nss: string
  paciente!: pacienteSeleccionado

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private certificadoService: CertificadoDefuncionService,
    private fb: FormBuilder,
    private tarjetaService: AppTarjetaPresentacionService,
    private authService: AuthService,
  ) {
    this.extras = this.router.getCurrentNavigation()?.extras;
    if (this.extras && this.extras.state) {
      this.getCertificadoById(this.extras.state.id);
    }
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.authService.setProjectObs('Trabajo Social')
    }, 0)
    this.datesForm = this.fb.group({
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
    })
    this.paciente = this.tarjetaService.get()
    if (!this.paciente) {
      this.paciente = JSON.parse(localStorage.getItem('paciente')!)
      this.nss = this.paciente.nss.toString()
    }
  }

  async irDetalle(extras: CertificadoDefuncion) {
    await sessionStorage.removeItem('certificadoDefuncion')
    sessionStorage.setItem('certificadoDefuncion', await JSON.stringify(extras))
    this.router.navigate(['detalle-certificado-defuncion'])
  }

  getCertificadoById(id: number) {
    this.certificadoService.getCertificadoById(id).subscribe(
      (res) => {
        this.tabla = res
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse)
      },
    )
  }

  getCertificadoByFecha() {
    this.tabla = []
    let objPaciente = {
      fechaIni: this.datesForm.get('fechaInicial')?.value,
      fechaFin: this.datesForm.get('fechaFinal')?.value,
      nssPaciente: this.paciente.nss,
      agregadoMedico: this.paciente.agregadoMedico,
    }
    this.certificadoService
      .obtenerListaCertificados(objPaciente)
      .subscribe(
        (res) => {
          this.tabla = res
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse)
        },
      )
      .add(() => {
        if (this.tabla.length == 0) {
          this.muestraAlerta(
            'Verifique los filtros',
            'alert-warning',
            'Sin resultados',
          )
        }
      })
  }

  irNuevoRegistro() {
    sessionStorage.removeItem('certificadoDefuncion')
    this.router.navigate(['nuevo-certificado-defuncion'])
  }

  handleDatesChange() {
    if (
      this.datesForm.get('fechaInicial')?.value &&
      this.datesForm.get('fechaInicial')?.value !== '' &&
      this.datesForm.get('fechaFinal')?.value &&
      this.datesForm.get('fechaFinal')?.value !== ''
    ) {
      this.getCertificadoByFecha()
    } else {
      this.muestraAlerta(
        'Verifique los filtros',
        'alert-warning',
        'Sin resultados',
      )
    }
  }

  limpiar() {
    $('#cInternoFecIni').val(null)
    $('#cInternoFecFin').val(null)
    this.datesForm.get('fechaInicial')?.setValue(null)
    this.datesForm.get('fechaFinal')?.setValue(null)
    this.tabla = []
  }

  sortBy(columnaId: string, order: string, type: string) {
    // console.log(columnaId, order, type)

    this.columnaId = columnaId
    this.order = order

    this.tabla.sort((a: any, b: any) => {
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
        data = moment(val, 'YYYY/MM/DD')
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

  ngAfterViewInit(): void {
    $('#cInternoFecIni').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          this.datesForm.get('fechaInicial')?.patchValue(date)
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.datesForm.get('fechaInicial')?.patchValue(null)
        }
      },
    })

    $('#cInternoFecFin').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
          this.datesForm.get('fechaFinal')?.patchValue(date)
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.datesForm.get('fechaFinal')?.patchValue(null)
        }
      },
    })
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
  addCriterio(criterio: any) {
    const index = this.criteriosDeOrden.findIndex(
      (item) => item.propiedad === criterio.propiedad,
    )
    console.log(index)
    if (index > -1) {
      this.criteriosDeOrden.splice(index)
      this.criteriosDeOrden.push(criterio)
    } else {
      this.criteriosDeOrden.push(criterio)
    }
    console.log(this.criteriosDeOrden)
  }
}
