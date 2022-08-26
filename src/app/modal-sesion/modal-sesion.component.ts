import { SeguridadService } from './../seguridad/seguridad.service';
import { AuthService } from 'src/app/service/auth-service.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { Aplicacion } from 'src/app/models/aplicacion.model';
import { BnNgIdleService } from 'bn-ng-idle'
declare var $: any


@Component({
  selector: 'app-modal-sesion',
  templateUrl: './modal-sesion.component.html',
  styleUrls: ['./modal-sesion.component.css']
})
export class ModalSesionComponent implements OnInit, OnDestroy {
  public token: any;
  usuario: Usuario = new Usuario();
  aplicacion: Aplicacion = new Aplicacion();
  tiempoCaduca: any;
  tiempoVidaModal: any;

  constructor(private router: Router,
    private authService: AuthService,
    private seguridadService: SeguridadService,
    private bnIdle: BnNgIdleService,
    ) {

    }

  ngOnInit(): void {
    console.log('entra a contador de sesion')
    this.tiempoCaduca =  this.bnIdle.startWatching(30).subscribe((res) => {
      if (res) {
        console.log('HAbremodal e inicia el conteo para cerrarlo');
        this.modalcarga();
        this.tiempoVidaModal =  this.bnIdle.startWatching(60).subscribe((respuesta) => {
          if (respuesta) {
        console.log('se cierra modal');
        this.irInicioSesion();
      }
    });
  }
});
  }

ngOnDestroy(): void {
  this.tiempoCaduca.unsubscribe();
}

  modalcarga() {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static',
    })
    $('#content').modal('show')

  }


  continuarEnSesion() {
    //  sessionStorage.removeItem('accessToken')
    let refreshToken = {
       refreshToken: sessionStorage.getItem('refreshToken')
    }

    // this.usuario.strPassword = this.logindata.get("password")?.value;
    this.authService.renovarToken(refreshToken).subscribe(
      // (result) =>{
        // this.authService.login(this.usuario, this.aplicacion).subscribe(
          (res) => {
            if(res && res?.accessToken && res?.refreshToken ){
              this.authService.guardarToken(res.accessToken);
              this.authService.guardarRefreshToken(res.refreshToken);
              this.cerrarModal();
            }else{
               this.irInicioSesion();
            }
      }
    )
  }

  irInicioSesion() {
     sessionStorage.removeItem('refreshToken');
     sessionStorage.removeItem('usuario');
     sessionStorage.removeItem('token');
     this.tiempoCaduca.unsubscribe();
     this.tiempoVidaModal.unsubscribe();
    $('#content').modal('hide')
    this.cerrarCesion();
    this.router.navigateByUrl('/login')
  }


  cerrarModal(){
    this.tiempoCaduca.unsubscribe();
    this.tiempoVidaModal.unsubscribe();
    $('#content').modal('hide');
  }

  cerrarCesion(){
    this.authService.logout();
  }

}
