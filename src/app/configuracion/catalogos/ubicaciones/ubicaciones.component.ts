import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { objAlert } from 'src/app/common/alerta/alerta.interface';
import { CargasResponse } from 'src/app/models/carga-response-model';
import { ArchivoCarga, CargasCatalogos, CatalogoData, ConfiguracionCarga } from 'src/app/models/catalogos.model';
import { DownloadFile } from 'src/app/models/downloadFile-model';
import { Ubicacion } from 'src/app/models/ubicacion-model';
import { UbicacionRequest } from 'src/app/models/ubicacion-request-model';
import { CargasService } from 'src/app/services/catalogos/cargas.service';
import { HelperCatalogosService } from 'src/app/services/catalogos/helper.catalogos.service';
import { HelperMensajesService } from 'src/app/services/helper.mensajes.service';
import { UbicacionesService } from 'src/app/services/ubicaciones/ubicaciones.service';
import Swal from 'sweetalert2';


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
  idUser: number = 33; // 5 = Fer   33 = Ame
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
  resultados: boolean=true;

  
  mensaje!: objAlert;

  constructor(private formBuilder: FormBuilder, private ubicaciones: UbicacionesService,
    private http: HttpClient, private router: Router, private renderer: Renderer2,    private _Mensajes: HelperMensajesService,
    private matIconRegistry: MatIconRegistry,
    private _HelperCatalogos: HelperCatalogosService,
    private _CargasService: CargasService,
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
    this.pesoMaximoBytes = this.pesoMaximoMB * Math.pow(1024, 2);
    console.log("meximo permitido: ", this.pesoMaximoBytes, " bytes");
    this.lstCatalogo = new Array<CatalogoData>();
    this.mensaje = new objAlert;
    this.lstConfigCarga = this._HelperCatalogos.getConfiguracionCat();
    //this.obtenerEstatusCarga();
    this.blnDeshabilitar = false;
    this.archivoCarga = new ArchivoCarga;

    setTimeout(() => {
      $('#tblCatalogos').DataTable({
        "paging": false,
        "info": false,
        "searching": false,
        "aaSorting": []
      });

    }, 3000);

  }

  getAll() {


    this.lstUbicaciones = [];
    this.pagactual = 1;
    this.ubicaciones.getAll().subscribe({
      next: (resp: any) => {

        console.log(resp);

        if(resp.data.length>0)        
          this.resultados=true;
        else this.resultados=false;

        this.lstUbicaciones = resp.data;



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

      },
      error: (err) => {
        this.lstUbicaciones = [];
        //this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })

  }

  limpiarbusqueda() {
    this.lstUbicaciones = [];
    this.txtbusca = '';
  }
  cargaUbicaciones() {

  
        this. modalcarga("Ubicaciones", "B_4_UBICACIONES") ;
       
    

  }

  private cleanVar() {
    this.archivoCarga = new ArchivoCarga();
    this.archivoCarga.errmsg = "";
    this.blnDeshabilitar = false;
    this.percentDone = 0;

    this.ubicacion = new Array<Ubicacion>();
   


  }
  modalcarga(tipocatalogo: string, sheetName: string) {
    console.log("abre modal");
    this.cleanVar();

    this.archivoCarga = new ArchivoCarga;
    this.archivoCarga.nombre = tipocatalogo;

    this.archivoCarga.sheetName = sheetName;


    this.confCarga = new ConfiguracionCarga();

    this.confCarga = this.lstConfigCarga.find(e => e.nombreCatalogo === tipocatalogo);
    console.log(this.confCarga);
    if (this.confCarga.rutaPlantilla.length == 0) {

      this.confCarga.rutaPlantilla = "../../../../assets/files/Plantilla_Estructura_CargasIniciales.xlsx";
    }
    if (this.validarDependenciaDeCatalogos()) {


      $('#content').modal({
        keyboard: false,
        backdrop: 'static'
      })
      $('#content').modal('show')
    } else {
      this.mostrarMensaje(this._Mensajes.ALERT_DANGER, "Debe completar la carga del catálogo: " + this.catFaltante, this._Mensajes.ERROR);


    }
  }
  catFaltante: string = '';
  private validarDependenciaDeCatalogos() {
    let blnPuedeCargar: boolean = true;
    this.catFaltante = '';
    if (this.confCarga.idCatPadre != undefined) {
      for (let catId of this.confCarga.idCatPadre) {
        this.catPadre = this.lstCatalogo.find(e => e.idCatalogos === catId);
        if (this.catPadre.estatusCarga.cveIdEstatus != 1) {
          this.catFaltante = this.catPadre.nombreCatalogo;
          blnPuedeCargar = false;
        }
      }
    }
    return blnPuedeCargar;
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
  buscarUbicacion(){

if(this.txtbusca==""){
  this.getAll();

}else{


debugger
    this.ubicaciones.getByDescAbv(this.txtbusca).subscribe({
      next: (resp: any) => {

        console.log(resp);
        this.lstUbicaciones = resp.data;
        if(resp.data.length>0)        
        this.resultados=true;
      else this.resultados=false;



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

      },
      error: (err) => {
        this.lstUbicaciones = [];
        //this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })
  }
  }

  
  descargaacuse() {

    let d = new Date();
    let month = (d.getMonth() + 1);
    let day = d.getDate();
    let year = d.getFullYear();
    let fecha = this.generateDateDDMMYYYY(day, month, year);
    if (this.regERROR != 0)
      this.generarAcuse("carga_catalogos_error_" + fecha + ".pdf");
    else
      this.generarAcuse("carga_catalogos_exito_" + fecha + ".pdf");

  }
  generarAcuse(archivo: string) {

    let downloadFile: DownloadFile = new DownloadFile();
    downloadFile.nombreArchivo = archivo;



    this._CargasService.downloadFile(downloadFile).subscribe((file) => {



      const byteArray = new Uint8Array(atob(file.fileBytes).split('').map(char => char.charCodeAt(0)));

      const blob = new Blob([byteArray], { type: 'application/pdf' });
      console.log(blob);

      const url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", archivo);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);


    }, (error: HttpErrorResponse) => {
      this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_ACUSE);


      console.log('Ocurrio un error en la operación', error);
    });
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



  generateDateDDMMYYYY(dia: number, mes: number, anio: number) {
    let mesS, diaS;
    mesS = "" + mes;
    diaS = "" + dia;
    if (dia <= 9) diaS = "0" + dia;
    if (mes <= 9) mesS = "0" + mes;
    return diaS + "-" + mesS + "-" + anio;

  }
  btnCancelar() {
    this.cleanVar();
    $('#content').modal('hide')
    this.reset();
    this.obtenerEstatusCarga();
    
  }
  btnAceptar() {
    this.cleanVar();
    $('#content').modal('hide')
    this.reset();
    this.obtenerEstatusCarga();
   
  }
  reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }
  btnAtras() {
    this.router.navigateByUrl("/catalogos/cargaCatalogos", { skipLocationChange: true });
  }

  muestraHorarios(cveUbicacion:number){
    debugger
    
    this.router.navigate(['/catalogos/horarios/' + cveUbicacion]);

  }
  
  upload(event: any) {
    console.log("selecciona boton para cargar archivo");



    this.archivoCarga.proceso = 'inicio';
    this.archivoCarga.errmsg = "";

    //this.file = event.target.files[0] || undefined;
    // let file2 = (<HTMLInputElement>event.target) == null ? '' : (<HTMLInputElement>event.target).files;
    // let file3: File[];
    // file3 = file2[0];
    // this.uploadAndProgressSingle2(file2[0]);

    // event.target.files.length == 1 ? this.imageName = event.target.files[0].name : this.imageName = event.target.files.length + " archivos";
    // this.selectedFiles = event.target.files;

    //this.uploadAndProgressSingle2(event.target.files[0]);
    let archivo: File;
    archivo = event.target.files[0];
    this.archivoCarga.nombrearchivo = archivo.name.toString();
    this.archivoCarga.tamanioarchivo = archivo.size.toString();
    let xlsx = ".xlsx";
    let xls = ".xls";
    console.log("size" + this.archivoCarga.nombrearchivo);
    this.blnProcedeCarga = true;

    if (!this.archivoCarga.nombrearchivo.toLowerCase().includes(xlsx) || !this.archivoCarga.nombrearchivo.toLowerCase().includes(xls)) {
      this.archivoCarga.proceso = 'error';
      this.blnProcedeCarga = false;
      this.blnDeshabilitar = false;

      this.archivoCarga.nombrearchivo = "";
      this.archivoCarga.tamanioarchivo = "";

      this.archivoCarga.errmsg = this._Mensajes.MSJ_ERROR_GENERAL + this._Mensajes.MSJ_EXTENSION_NO_PERMITIDA;

    }

    console.log("tamaño: ", archivo.size, " bytes");

    if (archivo.size > this.pesoMaximoBytes) {
      this.archivoCarga.proceso = 'error';
      this.blnProcedeCarga = false;
      console.log("es pesado");
      this.archivoCarga.nombrearchivo = "";
      this.archivoCarga.tamanioarchivo = "";

      //   this.onUpload(archivo);
      //} else {
      this.blnDeshabilitar = false;
      this.archivoCarga.errmsg = this._Mensajes.MSJ_ERROR_GENERAL + this._Mensajes.MSJ_EXCEDE_TAMANIO;
    }


  }

  totalRegistros: number;
  cargaResponse: HttpResponse<CargasResponse>;

  DataFromEventEmitter(data: any, tipoCatalogo: string) {

    this.totalRegistros = 0;



    this.percentDone = 0;


    this.cargaResponse = new HttpResponse<CargasResponse>();

    if (this.blnProcedeCarga) {

      this.archivoCarga.proceso = 'progress';
      for (let index = 0; index < data.length; index++) {
        this.totalRegistros = this.totalRegistros + index;
        const element = data[index];




        this.percentDone = Math.round(100 * (index + 1) / (data.length));



        switch (this.confCarga.idCatalogos) {
          case 3:
            this.ubicacion[index] = new Ubicacion();
            this.ubicacion[index].cveUbicacion = element[this.confCarga.col1];
            this.ubicacion[index].descripcionCompleta = element[this.confCarga.col2];
            this.ubicacion[index].descripcionAbreviada = element[this.confCarga.col3];
            this.ubicacion[index].tipo = element[this.confCarga.col4];
            this.ubicacion[index].nivelAtencion = element[this.confCarga.col5];
            this.ubicacion[index].servicioEspecialidad = element[this.confCarga.col6];
            this.ubicacion[index].unidadMedica = element[this.confCarga.col7];
            break;
          default:
            console.log("1x");
            this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_PLANTILLA_NOVALIDA, this._Mensajes.ERROR);
            break;
        }

      }
      this.percentDone = 85;
      if (data.length != 0) {
        setTimeout(() => {

          this.iniciarCargaRegistros(this.archivoCarga, this.confCarga);
        }, 2000);

      } else {
        this.archivoCarga.nombrearchivo = "";
        this.archivoCarga.tamanioarchivo = "";
        this.archivoCarga.proceso = 'error';
        console.log("2x");
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_PLANTILLA_NOVALIDA, this._Mensajes.ERROR);

      }


    } else {

      this.archivoCarga.nombrearchivo = "";
      this.archivoCarga.tamanioarchivo = "";

    }


  }

  private iniciarCargaRegistros(archivoCarga: ArchivoCarga, confCarga: ConfiguracionCarga) {

    console.log("Iniciar carga a BD: ");
    this.archivoCarga = archivoCarga;
    if (this.archivoCarga.nombrearchivo) {
      switch (confCarga.idCatalogos) {
        case 3:

          this.ubicacionRequest = new UbicacionRequest();
          this.ubicacionRequest.idUser = this.idUser;
          this.ubicacionRequest.ubicaciones = this.ubicacion;
          this._CargasService.agregarUbicaciones(this.ubicacionRequest).subscribe((resp: HttpResponse<CargasResponse>) => {
            if (resp) {
              this.cargaResponse = resp;
              this.percentDone = 100;


              this.reporteCarga(resp);
              setTimeout(() => {
                this.archivoCarga.proceso = 'result';
              }, 800);

            }
          }, (error: HttpErrorResponse) => {
            this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_UBICACIONES);
          });
          break;
        default:
          console.log("3x");
          this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_PLANTILLA_NOVALIDA, this._Mensajes.ERROR);
          break;
      }


    } else {
      this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_WARNING_SELECCIONAR_ARCHIVO, this._Mensajes.ERROR);
    }
  }

  private reporteCarga(response: HttpResponse<CargasResponse>) {
    let msj = "";
    this.regOK = 0;
    this.regERROR = 0;



    for (let registro of response.body.rowDTO) {
      console.log("lstRow: ", registro.status);

      switch (registro.status) {
        case 'OK':

          this.regOK = this.regOK + 1;
          break;
        case 'ERROR':


          this.regERROR = this.regERROR + 1;
          break;
        default:
          break;
      }
    }


    console.log("Errores: ", this.regERROR);
    console.log("Correctos: ", this.regOK);
    if (this.regERROR != 0) {
      this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_CARGA + msj, this._Mensajes.ERROR);
    } else {
      this.mostrarMensaje(this._Mensajes.ALERT_SUCCESS, this._Mensajes.MSJ_EXITO_CARGA + msj, this._Mensajes.EXITO);
    }


  }
  cambiatotalpaginas(numpag:number){
    this.numitems = numpag;
    $('#tblusuarios').DataTable().page.len( this.numitems ).draw();
    paginaactual = table.page.info().page;
    this.pagactual = paginaactual + 1;
  }

  
  btnClose() {
    this.cleanVar();

    $('#content').modal('hide')
    this.reset();
    this.obtenerEstatusCarga();
    
  }
  
  private msjLoading(titulo: string) {
    Swal.fire({
      title: titulo,

      didOpen: () => {
        Swal.showLoading();
      }


    })
  }

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
     // this.mostrarMensaje(this._Mensajes.ALERT_SUCCESS, this._Mensajes.MSJ_EXITO_CARGAS, this._Mensajes.EXITO);
    }
  }


}
