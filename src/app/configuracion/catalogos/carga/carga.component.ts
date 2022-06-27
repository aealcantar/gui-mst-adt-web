import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { objAlert } from '../../../common/alerta/alerta.interface';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ArchivoCarga, CargasCatalogos, CatalogoData, ConfiguracionCarga } from 'src/app/models/catalogos.model';
import { CargasService } from 'src/app/services/catalogos/cargas.service';
import { HelperCatalogosService } from 'src/app/services/catalogos/helper.catalogos.service';
import { HelperMensajesService } from 'src/app/services/helper.mensajes.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from "@angular/material/icon";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CargamasivaComponent } from '../cargamasiva/cargamasiva.component';

declare var $: any;

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent implements OnInit {

  idUser: number = 1; // 5 = Fer   33 = Ame
  cargaCatalogos: CargasCatalogos;
  lstCatalogo: CatalogoData[];
  mensaje!: objAlert;

  blnPendientes: boolean = false;
  blnErrores: boolean = false;
  blnCompletos: boolean = false;

  blnDeshabilitar: boolean = false;

  numitems: number = 7;
  pagactual: number = 1;
  blnContinuar: boolean = false;

  constructor(private authService: AuthService,
    private router: Router,
    private _CargasService: CargasService,
    private _Mensajes: HelperMensajesService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog) {
    this.matIconRegistry.addSvgIcon("circle_naranja", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Ellipse1.svg"));
    this.matIconRegistry.addSvgIcon("circle_rojo", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Ellipse2.svg"));
    this.matIconRegistry.addSvgIcon("circle_verde", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Ellipse3.svg"));
  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {

    this.authService.setProjectObs("Agenda Digital Transversal");
    this.lstCatalogo = new Array<CatalogoData>();
    this.mensaje = new objAlert;
    this.obtenerEstatusCarga();
    this.blnDeshabilitar = false;

    setTimeout(() => {
      $('#tblCatalogos').DataTable({
        "paging": false,
        "info": false,
        "searching": false,
        "aaSorting": []
      });

    }, 3000);

  }

  abrirdialog(id:number, tipocatalogo: string, sheetName: string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idCatalogos: id,
      nombreCatalogo: tipocatalogo,
      sheetName: sheetName
    };

    const dialogo1 = this.dialog.open(CargamasivaComponent, dialogConfig);

    dialogo1.afterClosed().subscribe(art => {
      console.log("result: ", art);
      //if (art != undefined)
      this.obtenerEstatusCarga();
    });

    dialogo1.componentInstance.onAlert.subscribe(dats => {
      console.log("result: ", dats);
      this.mostrarMensaje(dats.type, dats.message, dats.typeMsg);
    });
  }

  public btnAccionesCatalogos(catalogo: CatalogoData) {
    switch (catalogo.idCatalogos) {
      case 3:
        if(catalogo.estatusCarga.cveIdEstatus == 1){
          this.router.navigateByUrl("/catalogos/ConfiguracionUbicaciones", { skipLocationChange: true });
        }else{
          this.abrirdialog(catalogo.idCatalogos, catalogo.nombreCatalogo, catalogo.sheetName);
        }

        break;
        case 7:
          if(catalogo.estatusCarga.cveIdEstatus == 1){
            this.router.navigateByUrl("/buscauser", { skipLocationChange: true });
          }else{
            this.abrirdialog(catalogo.idCatalogos, catalogo.nombreCatalogo, catalogo.sheetName);
          }
          break;
      default:
        this.abrirdialog(catalogo.idCatalogos, catalogo.nombreCatalogo, catalogo.sheetName);
        break;
    }

  }

  //Estatus Cargas
  private obtenerEstatusCarga(): void {
    this.blnErrores = false;
    this.blnPendientes = false;
    this.blnCompletos = false;
    this.lstCatalogo = new Array<CatalogoData>();
    this.cargaCatalogos = new CargasCatalogos;
    this.msjLoading("Cargando...");
    this._CargasService.getEstatusCargaInicial()
      .subscribe((resp: CargasCatalogos) => {

        if (resp.code == 200) {
          this.cargaCatalogos = resp;
          this.lstCatalogo = resp.data.lstCatalogos;
          this.validaCargaCompleta(this.lstCatalogo);
          Swal.close();

        } else {
          this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_CONEXION_CARGAINICIAL, this._Mensajes.ERROR);
          Swal.close();
        }
        console.log("cargaInicial: ", this.cargaCatalogos);

      }, (error: HttpErrorResponse) => {
        this.cargaCatalogos = new CargasCatalogos;
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_CONEXION_CARGAINICIAL, this._Mensajes.ERROR);
        console.log(error);
        Swal.close();
      });
  }

  private validaCargaCompleta(lst: CatalogoData[]) {
    let tot = lst.length;
    let completos = 0;
    this.blnCompletos = false;
    this.blnErrores = false;
    this.blnPendientes = false;

    for (let reg of lst) {

      if (reg.estatusCarga?.cveNombre.toLocaleLowerCase() === 'carga completa') {
        this.blnCompletos = true;
        completos = completos + 1;
      }
      if (reg.estatusCarga?.cveNombre.toLocaleLowerCase() === 'carga pendiente') {
        this.blnPendientes = true;
      }
      if (reg.estatusCarga?.cveNombre.toLocaleLowerCase() === 'carga con errores') {
        this.blnErrores = true;
      }
    }
    if (tot == completos) {
      this.blnContinuar = true;
      this.mostrarMensaje(this._Mensajes.ALERT_SUCCESS, this._Mensajes.MSJ_EXITO_CARGAS, this._Mensajes.EXITO);
    }
  }

  private msjLoading(titulo: string) {
    Swal.fire({
      title: titulo,

      didOpen: () => {
        Swal.showLoading();
      }
    })
  }

  private mostrarMensaje(tipo: string, msj: string, tipoMsj?: string) {
    this.mensaje = new objAlert;
    this.mensaje.visible = true;
    this.mensaje.type = tipo;
    this.mensaje.message = msj;
    this.mensaje.typeMsg = tipoMsj;
    console.log(this.mensaje);
    setTimeout(() => {
      this.mensaje.visible = false;
    }, 4500);
  }

  btnContinuar() {
    if (this.blnContinuar) {
      this.router.navigate(['busqueda']);
    } else {
      this.mostrarMensaje(this._Mensajes.ALERT_DANGER, 'Debe completar la carga de Catálogos', this._Mensajes.ERROR);
    }
  }

}
