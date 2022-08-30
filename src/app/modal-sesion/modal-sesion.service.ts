import { AuthService } from './../service/auth-service.service';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'
import { Injectable } from '@angular/core'
declare var $: any

@Injectable({ providedIn: 'root' })

export class ModalSesionService {
  private modals: any[] = []
  // private visualizarModal: boolean = false;

  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal)
  }

  remove(id: string) {
    // remove modal from array of active modals
    this.modals = this.modals.filter((x) => x.id !== id)
  }

  open(id: string) {
    // open modal specified by id
    const modal = this.modals.find((x) => x.id === id)
    modal.open()
  }

  close(id: string) {
    // close modal specified by id
    const modal = this.modals.find((x) => x.id === id)
    modal.close()
  }

  modalcarga() {
    $('#contentSesion').modal({
      keyboard: false,
      backdrop: 'static',
    })
    $('#contentSesion').modal('show')
  }

  cerrarModal() {
    //  const idTimeOut = setTimeout(() => {
    //    console.log('realiza set timeOut')
    //    clearTimeout(idTimeOut)
    //   //  this.authService.logout()
    // }, 10000)
    $('#contentSesion').modal('hide')
    // this.visualizarModal = false;
  }

  // tiempoActividadmodal(){
  //   if(this.visualizarModal == true){
  //     return true
  //   }else{
  //     return false
  //   }
  // }

}
