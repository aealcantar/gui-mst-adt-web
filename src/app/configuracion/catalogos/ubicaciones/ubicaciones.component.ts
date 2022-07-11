import {  HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { objAlert } from 'src/app/common/alerta/alerta.interface';
import { CargasResponse } from 'src/app/models/carga-response-model';
import { ArchivoCarga, CargasCatalogos, CatalogoData, ConfiguracionCarga } from 'src/app/models/catalogos.model';

import { Ubicacion } from 'src/app/models/ubicacion-model';
import { UbicacionRequest } from 'src/app/models/ubicacion-request-model';

import { HelperCatalogosService } from 'src/app/services/catalogos/helper.catalogos.service';
import { HelperMensajesService } from 'src/app/services/helper.mensajes.service';
import { UbicacionesService } from 'src/app/services/ubicaciones/ubicaciones.service';
import Swal from 'sweetalert2';
import { CargamasivaComponent } from '../cargamasiva/cargamasiva.component';


declare var $: any;
//declare var $gmx:any;
var listo: boolean;
var table: any;
var paginaactual: number = 0;

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})

export class UbicacionesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: any = DataTableDirective;
  @ViewChild('fileInput')
  myInputVariable: ElementRef;
  archivoCarga: ArchivoCarga;
  blnDeshabilitar: boolean = false;
  percentDone!: number;
  ubicacion: Ubicacion[] = new Array<Ubicacion>();
  ubicacionRequest: UbicacionRequest;
  confCarga: ConfiguracionCarga;
  lstConfigCarga: ConfiguracionCarga[];
  catPadre: CatalogoData;
  lstCatalogo: CatalogoData[];
  pesoMaximoBytes: number;
  pesoMaximoMB: number = 10;
  regERROR: number = 0;
  regOK: number = 0;
  blnProcedeCarga: boolean = true;
  idUser: number = 1; // 5 = Fer   33 = Ame
  blnPendientes: boolean = false;
  blnErrores: boolean = false;
  blnCompletos: boolean = false;
  cargaCatalogos: CargasCatalogos;

  lstUbicaciones: Array<any> = [];

  txtbusca: string = '';
  numitems: number = 15;
  pagactual: number = 1;
  dtOptions: DataTables.Settings = {};
  blnContinuar: boolean = false;
  resultados: boolean = true;


  mensaje!: objAlert;

  constructor(private ubicaciones: UbicacionesService,
    private router: Router, private _Mensajes: HelperMensajesService,
    private matIconRegistry: MatIconRegistry,
    private _HelperCatalogos: HelperCatalogosService,
    public dialog: MatDialog,
    private domSanitizer: DomSanitizer) {

    this.matIconRegistry.addSvgIcon("upload", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/upload.svg"));
    this.matIconRegistry.addSvgIcon("upload2", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/upload2.svg"));
    this.matIconRegistry.addSvgIcon("download", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/download.svg"));
    this.matIconRegistry.addSvgIcon("close", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/close.svg"));
    this.matIconRegistry.addSvgIcon("add", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/add.svg"));


  }

  ngOnInit(): void {
    this.mensaje = new objAlert;
    this.getAll();
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: this.numitems,
      processing: true,
      info: false,
      searching: false,
      "lengthChange": false,
      "dom": "t<'table-pie' <'#cargalay.col-md-4'><'col-md-4 col-lg-4 text-center'p><'#nopag.col-md-4'>>",
      "language": {
        "paginate": {
          "first": "First page",
          "previous": '<span class="glyphicon glyphicon-menu-left paginacion-icon-navegacion" aria-hidden="true"></span>',
          "next": '<span class="glyphicon glyphicon-menu-right paginacion-icon-navegacion" aria-hidden="true"></span>',
          "last": "last"
        }
      }
    };


    this.lstCatalogo = new Array<CatalogoData>();
    this.mensaje = new objAlert;
    this.lstConfigCarga = this._HelperCatalogos.getConfiguracionCat();

    this.blnDeshabilitar = false;
    this.archivoCarga = new ArchivoCarga;
    /*
        setTimeout(() => {
          $('#tblCatalogos').DataTable({
            "paging": false,
            "info": false,
            "searching": false,
            "aaSorting": []
          });
    
        }, 3000);
    */
  }

  getAll() {
    this.lstUbicaciones = [];
    this.msjLoading("Buscando...");

    this.pagactual = 1;
    this.ubicaciones.getAll().subscribe({
      next: (resp: any) => {

        console.log(resp);

        if (resp.data.length > 0)
          this.resultados = true;
        else this.resultados = false;

        this.lstUbicaciones = resp.data;

        this.totRegistros = this.lstUbicaciones.length;
        console.log(this.totRegistros);

        setTimeout(() => {
          table = $('#tblusuarios').DataTable();
          this.dtOptions.pageLength = this.numitems;


          setTimeout(() => {
            table.on('page', () => {
              console.log('Page: ' + table.page.info().page);
              paginaactual = table.page.info().page;
              this.pagactual = paginaactual + 1;
            });
          }, 1000);
        }, 1000);
        Swal.close();

      },
      error: (err: HttpErrorResponse) => {
        Swal.close();
        this.lstUbicaciones = [];
        this.mensajesError(err, this._Mensajes.MSJ_ERROR_CONEXION_UBICACION);
        //this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })

  }

  btnLimpiarbusqueda() {
    this.lstUbicaciones = [];
    this.txtbusca = '';
  }


  private cleanVar() {
    this.archivoCarga = new ArchivoCarga();
    this.archivoCarga.errmsg = "";
    this.blnDeshabilitar = false;
    this.percentDone = 0;

    this.ubicacion = new Array<Ubicacion>();



  }

  catFaltante: string = '';

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


  totRegistros: number = 0;
  btnBuscarUbicacion() {
    this.lstUbicaciones = [];
    if (this.txtbusca == "") {
      this.getAll();

    } else {
      if (this.txtbusca.trim().length >= 5) {

        this.msjLoading("Buscando...");
        this.ubicaciones.getByDescAbv(this.txtbusca).subscribe({
          next: (resp: any) => {

            console.log(resp);
            this.lstUbicaciones = resp.data;
            if (resp.data.length > 0)
              this.resultados = true;
            else this.resultados = false;


            this.totRegistros = this.lstUbicaciones.length;
            console.log(this.totRegistros);
            setTimeout(() => {
              table = $('#tblusuarios').DataTable();
              this.dtOptions.pageLength = this.numitems;


              setTimeout(() => {
                table.on('page', () => {
                  console.log('Page: ' + table.page.info().page);
                  paginaactual = table.page.info().page;
                  this.pagactual = paginaactual + 1;
                });
              }, 1000);
            }, 1000);

            Swal.close();

          },
          error: (err: HttpErrorResponse) => {
            Swal.close();
            this.lstUbicaciones = [];
            this.mensajesError(err, this._Mensajes.MSJ_ERROR_CONEXION_UBICACION);
          }
        })
      } else {
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, "Ingrese mínimo 5 caracteres para buscar" + this.catFaltante, this._Mensajes.ERROR);
      }
    }
  }


  btnAtras() {
    const org = localStorage.getItem('origen');
    if(org){
      localStorage.removeItem('origen');
      console.log('origen',org);
      this.router.navigateByUrl(org, { skipLocationChange: true });
    } else{
      this.router.navigateByUrl("busqueda", { skipLocationChange: true });
    }
    // this.router.navigateByUrl("/catalogos/cargaCatalogos", { skipLocationChange: true });
  }

  muestraHorarios(cveUbicacion: number) {
    //debugger
    // this.router.navigateByUrl("/catalogos/horarios" + cveUbicacion, { skipLocationChange: true });
    this.router.navigate(['/catalogos/horarios/' + cveUbicacion], { skipLocationChange: true });

  }


  totalRegistros: number;
  cargaResponse: HttpResponse<CargasResponse>;




  cambiatotalpaginas(numpag: number) {
    this.numitems = numpag;
    $('#tblusuarios').DataTable().page.len(this.numitems).draw();
    paginaactual = table.page.info().page;
    this.pagactual = paginaactual + 1;
  }


  private msjLoading(titulo: string) {
    Swal.fire({
      title: titulo,

      didOpen: () => {
        Swal.showLoading();
      }
    })
  }


  private mensajesError(error: HttpErrorResponse, msj: string) {
    this.archivoCarga.proceso = 'errorResponse';
    switch (error.status) {
      case 400:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_400, this._Mensajes.ERROR400);
        break;
      case 403:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_403, this._Mensajes.ERROR403);
        break;

      case 404:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_404, this._Mensajes.ERROR404);
        break;
      case 500:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_500, this._Mensajes.ERROR500);
        break;
      case 503:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_503, this._Mensajes.ERROR503);
        break;

      default:
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, msj, "Error " + error.status);
        break;
    }



  }


  btnCargaMasiva() {

    this.confCarga = new ConfiguracionCarga();

    this.confCarga = this.lstConfigCarga.find(e => e.nombreCatalogo === 'Ubicaciones');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idCatalogos: this.confCarga.idCatalogos,
      "nombreCatalogo": this.confCarga.nombreCatalogo,
      "sheetName": this.confCarga.sheetName
    };

    const dialogo1 = this.dialog.open(CargamasivaComponent, dialogConfig);

    dialogo1.afterClosed().subscribe(art => {
      console.log("afterClosed: ", art);
      //if (art != undefined)

    });

    dialogo1.componentInstance.onAlert.subscribe(dats => {
      console.log("onAlert: ", dats);
      this.mostrarMensaje(dats.type, dats.message, dats.typeMsg);
    });

  }
}
