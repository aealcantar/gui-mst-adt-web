import { ModalSesionService } from './modal-sesion.service'
import { SeguridadService } from './../seguridad/seguridad.service'
import { AuthService } from 'src/app/service/auth-service.service'
import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Usuario } from 'src/app/models/usuario.model'
import { Aplicacion } from 'src/app/models/aplicacion.model'
import { BnNgIdleService } from 'bn-ng-idle'
declare var $: any

@Component({
  selector: 'app-modal-sesion',
  templateUrl: './modal-sesion.component.html',
  styleUrls: ['./modal-sesion.component.css'],
})
export class ModalSesionComponent implements OnInit {
  public token: any
  usuario: Usuario = new Usuario()
  aplicacion: Aplicacion = new Aplicacion()
  tiempoCaduca: any
  tiempoVidaModal: any
  continuarEnNavegacion: boolean = false
  idTimeOut: number
  userActivity: ''
  visualizacionModal: boolean = false

  constructor(
    private router: Router,
    private authService: AuthService,
    private seguridadService: SeguridadService,
    private bnIdle: BnNgIdleService,
    private bnIdle2: BnNgIdleService,
    private modalSesionService: ModalSesionService,
  ) {}

  ngOnInit(): void {
    console.log('modal__' + this.visualizacionModal)
    // if(this.visualizacionModal = true){
    console.log('modal')
    this.tiempoCaduca = this.bnIdle.startWatching(1800).subscribe((res) => {
      if (res) {
        console.log('HAbremodal e inicia el conteo para cerrarlo')
        this.visualizacionModal = false
        this.modalcarga()
        this.tiempoCaduca.unsubscribe()
      }
    })
    // }
  }

  ngOnDestroy(): void {
    this.tiempoCaduca.unsubscribe()
  }

  modalcarga() {
    this.modalSesionService.modalcarga()
    console.log(this.visualizacionModal)

    if ((this.visualizacionModal = false)) {
      console.log('status del modal' + this.visualizacionModal)
      const idTimeOut = setTimeout(() => {
        console.log('cierra por que se terminó el tiempo tiemout')
        this.cerrarModal()
        this.cerrarCesion()
      }, 300000)
      // clearTimeout()
      // clearTimeout(idTimeOut)
    }
  }

  continuarEnSesion() {
    this.visualizacionModal = false
    clearTimeout()
    this.continuarEnNavegacion = true
    let refreshToken = {
      refreshToken: sessionStorage.getItem('refreshToken'),
    }
    this.authService.renovarToken(refreshToken).subscribe((res) => {
      if (res && res?.accessToken && res?.refreshToken) {
        this.authService.guardarToken(res.accessToken)
        this.authService.guardarRefreshToken(res.refreshToken)
        this.cerrarModal()
      } else {
      }
    })
  }

  cerrarModal() {
    this.visualizacionModal = false
    clearTimeout()
    if (this.continuarEnNavegacion == true) {
      $('#contentSesion').modal('hide')
    } else {
      this.cerrarCesion()
    }
  }

  cerrarCesion() {
    clearTimeout()
    $('#contentSesion').modal('hide')
    this.authService.logout()
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('usuario')
    sessionStorage.removeItem('token')
    this.visualizacionModal = false
  }
}
