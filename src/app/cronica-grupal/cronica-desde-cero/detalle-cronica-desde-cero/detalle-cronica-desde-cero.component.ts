import { Component, OnInit, OnDestroy } from '@angular/core'
import { AlertInfo } from 'src/app/app-alerts/app-alert.interface'
import { Subscription, timer } from 'rxjs'
import { Usuario } from 'src/app/models/usuario.model'
import { ActivatedRoute, Router } from '@angular/router'
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service'
import { formatDate } from '@angular/common'
import { map, share } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-detalle-cronica-desde-cero',
  templateUrl: './detalle-cronica-desde-cero.component.html',
  styleUrls: ['./detalle-cronica-desde-cero.component.css'],
})

export class DetalleCronicaDesdeCeroComponent implements OnInit, OnDestroy {
  public alert!: AlertInfo
  public time = new Date()
  public rxTime = new Date()
  public intervalId: any
  public subscription: Subscription | undefined
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
  public usuario!: Usuario
  public cronica: any
  public datetimeFormat = ''
  public dateToday = new Date()

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cronicaGrupalService: CronicaGrupalService,
  ) {
    this.datetimeFormat = formatDate(
      this.dateToday,
      'dd/MM/yyyy hh:mm:ss aa',
      'en-ES',
    )
  }

  ngOnInit(): void {
    this.muestraAlerta(
      '¡La información se guardó con éxito!',
      'alert-success',
      '',
    )

    this.route.queryParamMap.subscribe((params: any) => {
      this.cronica = JSON.parse(params.getAll('cronica'))

    })

    this.route.queryParamMap.subscribe((params: any) => {
      if (params.getAll('cronica').length > 0) {
        this.cronica = JSON.parse(params.getAll('cronica'))
      }
    })
    let userTmp = sessionStorage.getItem('usuario') || ''
    if (userTmp !== '') {
      this.usuario = JSON.parse(userTmp)
    }
    this.day = this.cronica?.fecFechaCorta.substring('0', '2')
    const month = this.cronica?.fecFechaCorta.substring('3', '5')
    switch (month) {
      case '01':
        this.month = 'enero'
        break
      case '02':
        this.month = 'febrero'
        break
      case '03':
        this.month = 'marzo'
        break
      case '04':
        this.month = 'abril'
        break
      case '05':
        this.month = 'mayo'
        break
      case '06':
        this.month = 'junio'
        break
      case '07':
        this.month = 'julio'
        break
      case '08':
        this.month = 'agosto'
        break
      case '09':
        this.month = 'septiembre'
        break
      case '10':
        this.month = 'octubre'
        break
      case '11':
        this.month = 'noviembre'
        break
      case '12':
        this.month = 'diciembre'
        break
    }
    this.year = this.cronica?.fecFechaCorta.substring('6', '10')
    const currentDate = new Date(this.year + '-' + this.month + '-' + this.day)
    this.today = currentDate

    //----------------------------------------

    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share(),
      )
      .subscribe((time) => {
        this.rxTime = time
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
    }, 2000)
  }

  regresar() {
    this.router.navigateByUrl("/consulta-cronica-grupal");
  }

  imprimir() {
    let data: any = {
      ooad: "CDMX NORTE",
      unidad: "HGZ 48 SAN PEDRO XALAPA",
      clavePtal: "35E1011D2153",
      turno: "MATUTINO",
      servicio: this.cronica?.desEspecialidad.toUpperCase(),
      grupo : this.cronica?.desGrupo !== null ? this.cronica?.desGrupo : "",
      fecha: this.cronica?.fecFechaCorta !== null ? this.cronica?.fecFechaCorta : "",
      hora: this.cronica?.timHora !== null ? this.cronica?.timHora : "",
      ponentes: this.cronica?.descPonentes !== null ? this.cronica?.descPonentes : "",
      numAsistentes: this.cronica?.numTotalParticipantes !== null ? this.cronica?.numTotalParticipantes : "",
      tecnicaDidactica: this.cronica?.desTecnicaDidactica !== null ? this.cronica?.desTecnicaDidactica : "",
      materialApoyo: this.cronica?.desMaterialApoyo !== null ? this.cronica?.desMaterialApoyo : "",
      objetivoSesion: this.cronica?.desObjetivosSesion !== null ? this.cronica?.desObjetivosSesion : "",
      contenido: this.cronica?.desDesarrolloSesion !== null ? this.cronica?.desDesarrolloSesion : "",
      perfilGrupo: this.cronica?.desPerfilGrupo !== null ? this.cronica?.desPerfilGrupo : "",
      observaciones: this.cronica?.desObservaciones !== null ? this.cronica?.desObservaciones : "",
      fecImpresion: this.datetimeFormat,
      trabajadorSocial: this.usuario?.strNombres + " " + this.usuario?.strApellidoP + " " + this.usuario?.strApellidoM,
      participantes: this.cronica.participanteList

    };
    console.log("DATA REPORT: ", data);
    this.cronicaGrupalService.downloadPdf(data).subscribe(
      (response: Blob) => {
        var file = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      }, (error: HttpErrorResponse) => {
        console.error("Error al descargar reporte: ", error.message);
      }
    )
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
