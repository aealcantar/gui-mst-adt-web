import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { objAlert } from 'src/app/common/alerta/alerta.interface';
import { CalendarioDias } from 'src/app/models/calendario-dias.model';
import { CalendarioRequest } from 'src/app/models/calendario-request-model';
import { CargasResponse } from 'src/app/models/carga-response-model';
import { ArchivoCarga, CargasCatalogos, CatalogoData, ConfiguracionCarga } from 'src/app/models/catalogos.model';
import { DownloadFile } from 'src/app/models/downloadFile-model';
import { Persona } from 'src/app/models/persona-model';
import { PersonaRequest } from 'src/app/models/persona-request-model';
import { ProgramaTSRequest } from 'src/app/models/programa-ts-request-model';
import { ProgramaTS } from 'src/app/models/programa-ts.model';
import { Puesto } from 'src/app/models/puesto-model';
import { PuestoRequest } from 'src/app/models/puesto-request-model';
import { Responsable } from 'src/app/models/responsable-model';
import { ResponsableRequest } from 'src/app/models/responsable-request-model';
import { Servicio } from 'src/app/models/servicio-model';
import { ServicioRequest } from 'src/app/models/servicio-request-model';
import { Turno } from 'src/app/models/turno-model';
import { TurnoRequest } from 'src/app/models/turno-request-model';
import { Ubicacion } from 'src/app/models/ubicacion-model';
import { UbicacionRequest } from 'src/app/models/ubicacion-request-model';
import { UnidadMedicaRequest } from 'src/app/models/unidad-medica-request.model';
import { UnidadMedica } from 'src/app/models/unidad-medica.model';
import { AuthService } from 'src/app/service/auth-service.service';
import { CargasService } from 'src/app/services/catalogos/cargas.service';
import { HelperCatalogosService } from 'src/app/services/catalogos/helper.catalogos.service';
import { HelperMensajesService } from 'src/app/services/helper.mensajes.service';
import * as XLSX from 'xlsx';
import { MatIconRegistry } from "@angular/material/icon";


declare var $: any;

@Component({
  selector: 'app-cargamasiva',
  templateUrl: './cargamasiva.component.html',
  styleUrls: ['./cargamasiva.component.css']
})
export class CargamasivaComponent implements OnInit {
  @ViewChild('fileInput')
  myInputVariable: ElementRef;

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }
  pesoMaximoBytes: number;
  pesoMaximoMB: number = 10;
  servicio: Servicio[] = new Array<Servicio>();
  calendarioDias: CalendarioDias[] = new Array<CalendarioDias>();
  calendarioDiasRequest: CalendarioRequest;
  programasTS: ProgramaTS[] = new Array<ProgramaTS>();
  programasTSRequest: ProgramaTSRequest;
  servicioRequest: ServicioRequest;
  cargaResponse: HttpResponse<CargasResponse>;
  ubicacion: Ubicacion[] = new Array<Ubicacion>();
  ubicacionRequest: UbicacionRequest;
  unidadMedica: UnidadMedica[] = new Array<UnidadMedica>();
  unidadMedicaRequest: UnidadMedicaRequest;
  responsable: Responsable[] = new Array<Responsable>();
  responsableRequest: ResponsableRequest;
  persona: Persona[] = new Array<Persona>();
  personaRequest: PersonaRequest;
  turnos: Turno[] = new Array<Turno>();
  turnosRequest: TurnoRequest;
  puestos: Puesto[] = new Array<Puesto>()
  puestosRequest: PuestoRequest;
  idUser: number = 1; // 5 = Fer   33 = Ame
  correosubmitted = false;
  alert!: objAlert;
  percentDone!: number;
  uploadSuccess!: boolean;
  file!: File[];
  shortLink: string = "";
  archivoCarga: ArchivoCarga;
  cargaCatalogos: CargasCatalogos;
  lstCatalogo: CatalogoData[];
  mensaje!: objAlert;
  blnPendientes: boolean = false;
  blnErrores: boolean = false;
  blnCompletos: boolean = false;
  blnDeshabilitar: boolean = false;
  numitems: number = 7;
  pagactual: number = 1;
  lstConfigCarga: ConfiguracionCarga[];
  regOK: number = 0;
  regERROR: number = 0;
  confCarga: ConfiguracionCarga;
  totalRegistros: number;
  catPadre: CatalogoData;
  blnProcedeCarga: boolean = true;
  catFaltante: string = '';
  dataparams: any;
  onAlert = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<CargamasivaComponent>,
    private authService: AuthService,
    //private modalService: NgbModal,
    private router: Router,
    private http: HttpClient,
    private _CargasService: CargasService,
    private _HelperCatalogos: HelperCatalogosService,
    private _Mensajes: HelperMensajesService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.dataparams = data;
    this.matIconRegistry.addSvgIcon("upload", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/upload.svg"));
    this.matIconRegistry.addSvgIcon("upload2", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/upload2.svg"));
    this.matIconRegistry.addSvgIcon("download", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/download.svg"));
    this.matIconRegistry.addSvgIcon("close", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/close.svg"));
    this.matIconRegistry.addSvgIcon("add", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/add.svg"));
  }

  ngOnInit(): void {
    const taghtml = document.querySelector('html');
    taghtml.style.cssText += 'top: 0px;';

    this.pesoMaximoBytes = this.pesoMaximoMB * Math.pow(1024, 2);

    this.lstCatalogo = new Array<CatalogoData>();
    this.mensaje = new objAlert;
    this.lstConfigCarga = this._HelperCatalogos.getConfiguracionCat();
    this.blnDeshabilitar = false;
    this.archivoCarga = new ArchivoCarga;
    this.modalcarga(this.dataparams.nombreCatalogo, this.dataparams.sheetName);
  }

  cancelar() {
    this.dialogRef.close();
  }



  modalcarga(tipocatalogo: string, sheetName: string) {

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

  }


  upload(event: any) {
    console.log("selecciona boton para cargar archivo");

    this.archivoCarga.proceso = 'inicio';
    this.archivoCarga.errmsg = "";

    let archivo: File;
    archivo = event.target.files[0];
    this.archivoCarga.nombrearchivo = archivo ? archivo.name.toString() : "";
    this.archivoCarga.tamanioarchivo = archivo ? archivo.size.toString() : "";
    let xlsx = ".xlsx";
    let xls = ".xls";
    //console.log("size" + this.archivoCarga.nombrearchivo);
    this.blnProcedeCarga = true;

    if (!this.archivoCarga.nombrearchivo.toLowerCase().includes(xlsx) || !this.archivoCarga.nombrearchivo.toLowerCase().includes(xls)) {
      this.archivoCarga.proceso = 'error';
      this.blnProcedeCarga = false;
      this.blnDeshabilitar = false;

      this.archivoCarga.nombrearchivo = "";
      this.archivoCarga.tamanioarchivo = "";

      this.archivoCarga.errmsg = this._Mensajes.MSJ_ERROR_GENERAL + this._Mensajes.MSJ_EXTENSION_NO_PERMITIDA;

    }

    // console.log("tamaño: ", +this.archivoCarga.tamanioarchivo, " bytes");

    if (Number(this.archivoCarga.tamanioarchivo) > this.pesoMaximoBytes) {
      this.archivoCarga.proceso = 'error';
      this.blnProcedeCarga = false;
      // console.log("es pesado");
      this.archivoCarga.nombrearchivo = "";
      this.archivoCarga.tamanioarchivo = "";

      this.blnDeshabilitar = false;
      this.archivoCarga.errmsg = this._Mensajes.MSJ_ERROR_GENERAL + this._Mensajes.MSJ_EXCEDE_TAMANIO;

    }


  }

  DataFromEventEmitter(data: any, tipoCatalogo: string) {

    this.totalRegistros = 0;
    this.percentDone = 0;
    this.cargaResponse = new HttpResponse<CargasResponse>();
    console.log("blnProcedeCarga: ", this.blnProcedeCarga);
    if (this.blnProcedeCarga) {

      this.archivoCarga.proceso = 'progress';
      for (let index = 0; index < data.length; index++) {
        this.totalRegistros = this.totalRegistros + index;
        const element = data[index];




        this.percentDone = Math.round(100 * (index + 1) / (data.length));



        switch (this.confCarga.idCatalogos) {
          case 1:

            this.unidadMedica[index] = new UnidadMedica();
            this.unidadMedica[index].region2021 = element[this.confCarga.col1];
            this.unidadMedica[index].cluesSalud = element[this.confCarga.col2];
            this.unidadMedica[index].clavePersonal = element[this.confCarga.col3];
            this.unidadMedica[index].unidadInformacionPREI = element[this.confCarga.col4];
            this.unidadMedica[index].claveUbicacionAdmin = element[this.confCarga.col5];
            this.unidadMedica[index].clavePresupuestal = element[this.confCarga.col6];
            this.unidadMedica[index].claveDelagacionUMAE = element[this.confCarga.col7];
            this.unidadMedica[index].nombreDelegacionUMAE = element[this.confCarga.col8];
            this.unidadMedica[index].relacionDelegacionUMAE = element[this.confCarga.col9];
            this.unidadMedica[index].unidadPresupuestal = element[this.confCarga.col10];
            this.unidadMedica[index].nivelAtencion = element[this.confCarga.col11];
            this.unidadMedica[index].denominacionUnidad = element[this.confCarga.col12];
            this.unidadMedica[index].tipoServicio = element[this.confCarga.col13];
            this.unidadMedica[index].tipoServicioDescripcion = element[this.confCarga.col14];
            this.unidadMedica[index].numeroUnidad = element[this.confCarga.col15];
            this.unidadMedica[index].nombreUnidad = element[this.confCarga.col16];
            this.unidadMedica[index].ubicacionDenminacion = element[this.confCarga.col17];
            this.unidadMedica[index].direccion = element[this.confCarga.col18];
            this.unidadMedica[index].tipoVialidad = element[this.confCarga.col19];
            this.unidadMedica[index].nombreVialidad = element[this.confCarga.col20];
            this.unidadMedica[index].entreVialidades = element[this.confCarga.col21];
            this.unidadMedica[index].numeroExterior = element[this.confCarga.col22];
            this.unidadMedica[index].tipoAsentamiento = element[this.confCarga.col23];
            this.unidadMedica[index].nombreAsentamiento = element[this.confCarga.col24];
            this.unidadMedica[index].codigoPostal = element[this.confCarga.col25];
            this.unidadMedica[index].claveMunicipio = element[this.confCarga.col26];

            this.unidadMedica[index].municipio = element[this.confCarga.col27];
            this.unidadMedica[index].claveLocalidad = element[this.confCarga.col28];
            this.unidadMedica[index].localidad = element[this.confCarga.col29];
            this.unidadMedica[index].claveEntidad = element[this.confCarga.col30];
            this.unidadMedica[index].entidad = element[this.confCarga.col31];
            this.unidadMedica[index].claveJurisdiccionSanitaria = element[this.confCarga.col32];
            this.unidadMedica[index].jurisdiccionSanitaria = element[this.confCarga.col33];
            this.unidadMedica[index].jurisdiccionSanitaria = element[this.confCarga.col34];
            this.unidadMedica[index].longitud = element[this.confCarga.col35];
            this.unidadMedica[index].inicioProductividad = element[this.confCarga.col36];
            this.unidadMedica[index].gradoMArginacion = element[this.confCarga.col37];

            break;
          case 2:
            this.servicio[index] = new Servicio();
            this.servicio[index].clave = element[this.confCarga.col1];
            this.servicio[index].especialidad = element[this.confCarga.col2];
            this.servicio[index].indCe = element[this.confCarga.col3];
            this.servicio[index].indHosp = element[this.confCarga.col4];
            this.servicio[index].indIq = element[this.confCarga.col5];
            this.servicio[index].indNivel1 = element[this.confCarga.col6];
            this.servicio[index].indNivel2 = element[this.confCarga.col7];
            this.servicio[index].indNivel3 = element[this.confCarga.col8];
            this.servicio[index].indCss = element[this.confCarga.col9];

            let fchB = XLSX.SSF.parse_date_code(element[this.confCarga.col10]);
            let fchBaja = this.generateDate(fchB.d, fchB.m, fchB.y);
            let fchA = XLSX.SSF.parse_date_code(element[this.confCarga.col11]);
            let fchAlta = this.generateDate(fchA.d, fchA.m, fchA.y);
            let fchAc = XLSX.SSF.parse_date_code(element[this.confCarga.col12]);
            let fchAct = this.generateDate(fchAc.d, fchAc.m, fchAc.y);

            this.servicio[index].fec_baja = fchBaja.toString();
            this.servicio[index].fec_alta = fchAlta.toString();
            this.servicio[index].fec_actualizacion = fchAct.toString();
            console.log(this.servicio[index]);
            break;

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
          case 4:
            this.responsable[index] = new Responsable();
            this.responsable[index].matricula = element[this.confCarga.col1];
            this.responsable[index].nombre = element[this.confCarga.col2];
            this.responsable[index].ubicacion = element[this.confCarga.col3];
            this.responsable[index].turno = element[this.confCarga.col4];
            break;
          case 5:
            this.programasTS[index] = new ProgramaTS();
            this.programasTS[index].cveGrupo = element[this.confCarga.col1];
            this.programasTS[index].desPrograma = element[this.confCarga.col2];
            this.programasTS[index].cveCodigo = element[this.confCarga.col3];
            this.programasTS[index].descActividad = element[this.confCarga.col4];
            this.programasTS[index].cveServicio = element[this.confCarga.col5];
            break;

          case 6:
            this.calendarioDias[index] = new CalendarioDias();
            this.calendarioDias[index].cveServicio = element[this.confCarga.col1];
            this.calendarioDias[index].cveUbicacion = element[this.confCarga.col2];
            let jsDateIn = XLSX.SSF.parse_date_code(element[this.confCarga.col3]);
            let fechaInicio = this.generateDate(jsDateIn.d, jsDateIn.m, jsDateIn.y);
            let horaI = XLSX.SSF.parse_date_code(element[this.confCarga.col4]);
            let horaInicio = this.generateHora(horaI.H, horaI.M);


            this.calendarioDias[index].fecInicio = fechaInicio;
            this.calendarioDias[index].horaInicio = horaInicio;
            this.calendarioDias[index].duracion = element[this.confCarga.col5];

            let jsDateFin = XLSX.SSF.parse_date_code(element[this.confCarga.col6]);
            let fechaFin = this.generateDate(jsDateFin.d, jsDateFin.m, jsDateFin.y);

            this.calendarioDias[index].fecFin = fechaFin;

            let horaF = XLSX.SSF.parse_date_code(element[this.confCarga.col7]);
            let horaFin = this.generateHora(horaF.H, horaF.M);

            this.calendarioDias[index].horaFin = horaFin;
            this.calendarioDias[index].numParticipantes = element[this.confCarga.col8];
            break;

          case 7:

            this.persona[index] = new Persona();
            this.persona[index].nombre = element[this.confCarga.col1];
            this.persona[index].primerApellido = element[this.confCarga.col2];
            this.persona[index].segundoApellido = element[this.confCarga.col3];
            this.persona[index].matricula = element[this.confCarga.col4];
            this.persona[index].rol = element[this.confCarga.col5];
            this.persona[index].puesto = element[this.confCarga.col6]
            this.persona[index].contraseña = element[this.confCarga.col7];
            this.persona[index].turno = element[this.confCarga.col8];
            this.persona[index].email = element[this.confCarga.col9];
          //  this.persona[index].unidadMedica = element[this.confCarga.col10];
          //  this.persona[index].escuelaProcedencia = element[this.confCarga.col11];

            this.persona[index].nombreCompleto = this.persona[index].nombre + " " + this.persona[index].primerApellido + " " + this.persona[index].segundoApellido
            this.persona[index].usuario = this.persona[index].matricula;
            break;
            //console.log("usuario: ", this.persona[index]);



          case 8:
            this.turnos[index] = new Turno();
            this.turnos[index].cveTurno = "1";
            this.turnos[index].desTurno = element[this.confCarga.col1];
            this.turnos[index].des4306 = element[this.confCarga.col2];


            break;



          case 9:
            this.puestos[index] = new Puesto();
            this.puestos[index].descripcionPuesto = element[this.confCarga.col1];
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
        // console.log("2x");
        this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_PLANTILLA_NOVALIDA, this._Mensajes.ERROR);

      }


    } else {

      this.archivoCarga.nombrearchivo = "";
      this.archivoCarga.tamanioarchivo = "";
      this.mostrarMensaje(this._Mensajes.ALERT_DANGER, "El archivo " + this._Mensajes.MSJ_EXCEDE_TAMANIO, this._Mensajes.ERROR);
    }


  }



  private iniciarCargaRegistros(archivoCarga: ArchivoCarga, confCarga: ConfiguracionCarga) {

    // console.log("Iniciar carga a BD: ");
    this.archivoCarga = archivoCarga;
    if (this.archivoCarga.nombrearchivo) {
      switch (confCarga.idCatalogos) {
        case 1:
          //UnidadesMEdicas
          this.unidadMedicaRequest = new UnidadMedicaRequest();
          this.unidadMedicaRequest.idUser = this.idUser;
          this.unidadMedicaRequest.unidadesMedicas = this.unidadMedica;
          // console.log(this.unidadMedica);
          this._CargasService.agregarUnidadesMedicas(this.unidadMedicaRequest).subscribe((resp: HttpResponse<CargasResponse>) => {


            if (resp) {
              this.cargaResponse = resp;
              this.percentDone = 100;

              this.reporteCarga(resp);



              setTimeout(() => {
                this.archivoCarga.proceso = 'result';
              }, 800);
            }
          }, (error: HttpErrorResponse) => {
            this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_UNIDADESMEDICAS);
          });





          break;
        case 2:
          this.servicioRequest = new ServicioRequest();

          this.servicioRequest.servicios = this.servicio;
          this.servicioRequest.idUser = this.idUser;
          this._CargasService.agregarServicios(this.servicioRequest).subscribe((resp) => {
            // this.servicioResponse = resp;
            if (resp) {
              this.cargaResponse = resp;
              this.percentDone = 100;


              this.reporteCarga(resp);




              setTimeout(() => {
                this.archivoCarga.proceso = 'result';
              }, 800);
            }
          }, (error: HttpErrorResponse) => {
            this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_SERVICIOS);
          });



          break;
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
        case 7:
          this.personaRequest = new PersonaRequest();
          this.personaRequest.personas = this.persona;
          this.personaRequest.idUser = this.idUser;
          this._CargasService.agregarPersona(this.personaRequest).subscribe((resp: HttpResponse<CargasResponse>) => {
            this.cargaResponse = resp;
            if (resp) {
              this.percentDone = 100;
              this.reporteCarga(resp);

              setTimeout(() => {
                this.archivoCarga.proceso = 'result';
              }, 800);
            }
          }, (error: HttpErrorResponse) => {
            this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_PERSONAL);

          });

          break;
        case 8:
          this.turnosRequest = new TurnoRequest();
          this.turnosRequest.turnos = this.turnos;
          this.turnosRequest.idUser = this.idUser;
          // console.log("requestTurnos ", this.turnosRequest);
          this._CargasService.agregarTurnos(this.turnosRequest).subscribe((resp: HttpResponse<CargasResponse>) => {
            this.cargaResponse = resp;
            if (resp) {

              this.percentDone = 100;
              this.reporteCarga(resp);

              setTimeout(() => {
                this.archivoCarga.proceso = 'result';
              }, 800);
            }
          }, (error: HttpErrorResponse) => {
            this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_TURNOS);

          });

          break;
        case 9:
          this.puestosRequest = new PuestoRequest();
          this.puestosRequest.puestos = this.puestos;
          this.puestosRequest.idUser = this.idUser;
          this._CargasService.agregarPuestos(this.puestosRequest).subscribe((resp: HttpResponse<CargasResponse>) => {
            this.cargaResponse = resp;
            if (resp) {
              this.percentDone = 100;
              this.reporteCarga(resp);

              setTimeout(() => {
                this.archivoCarga.proceso = 'result';
              }, 800);
            }
          }, (error: HttpErrorResponse) => {
            this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_PUESTOS);

          });

          break;

        case 5:

          this.programasTSRequest = new ProgramaTSRequest();
          this.programasTSRequest.programas = this.programasTS;
          this.programasTSRequest.idUser = this.idUser;
          this._CargasService.agregarProgramasTs(this.programasTSRequest).subscribe((resp: HttpResponse<CargasResponse>) => {

            this.cargaResponse = resp;
            if (resp) {
              this.percentDone = 100;


              this.reporteCarga(resp);




              setTimeout(() => {
                this.archivoCarga.proceso = 'result';
              }, 800);
            }

          }, (error: HttpErrorResponse) => {
            this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_PROGRAMASTS);
          });
          break;

        case 4:

          this.responsableRequest = new ResponsableRequest();
          this.responsableRequest.responsables = this.responsable;
          this.responsableRequest.idUser = this.idUser;
          this._CargasService.agregarResponsable(this.responsableRequest).subscribe((resp: HttpResponse<CargasResponse>) => {
            this.cargaResponse = resp;
            if (resp) {
              this.percentDone = 100;

              this.reporteCarga(resp);




              setTimeout(() => {
                this.archivoCarga.proceso = 'result';
              }, 800);
            }
          }, (error: HttpErrorResponse) => {
            this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_RESPONSABLE);
          });

          // }
          break;

        case 6:

          this.calendarioDiasRequest = new CalendarioRequest();
          this.calendarioDiasRequest.calendarioDias = this.calendarioDias;
          this.calendarioDiasRequest.idUser = this.idUser;
          this._CargasService.agregarCalendarioDias(this.calendarioDiasRequest).subscribe((resp: HttpResponse<CargasResponse>) => {
            this.cargaResponse = resp;
            if (resp) {
              this.percentDone = 100;

              this.reporteCarga(resp);

              setTimeout(() => {
                this.archivoCarga.proceso = 'result';
              }, 800);
            }
          }, (error: HttpErrorResponse) => {
            this.mensajesError(error, this._Mensajes.MSJ_ERROR_CONEXION_CALENDARIO);
          });



          break;





        default:
          //  console.log("3x");
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
      //console.log("lstRow: ", registro.status);

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


    // console.log("Errores: ", this.regERROR);
    //console.log("Correctos: ", this.regOK);
    if (this.regERROR != 0) {
      this.mostrarMensaje(this._Mensajes.ALERT_DANGER, this._Mensajes.MSJ_ERROR_CARGA + msj, this._Mensajes.ERROR);
    } else {
      this.mostrarMensaje(this._Mensajes.ALERT_SUCCESS, this._Mensajes.MSJ_EXITO_CARGA + msj, this._Mensajes.EXITO);
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
      //  console.log(blob);

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

  generateDate(dia: number, mes: number, anio: number) {
    let mesS, diaS;
    mesS = "" + mes;
    diaS = "" + dia;
    if (dia <= 9) diaS = "0" + dia;
    if (mes <= 9) mesS = "0" + mes;
    return "" + anio + "-" + mesS + "-" + diaS;

  }
  generateDateDDMMYYYY(dia: number, mes: number, anio: number) {
    let mesS, diaS;
    mesS = "" + mes;
    diaS = "" + dia;
    if (dia <= 9) diaS = "0" + dia;
    if (mes <= 9) mesS = "0" + mes;
    return diaS + "-" + mesS + "-" + anio;

  }
  generateHora(hora: number, minutos: number) {
    let horaS, minutosS;
    horaS = "" + hora;
    minutosS = "" + minutos;
    if (hora <= 9) horaS = "0" + hora;
    if (minutos <= 9) minutosS = "0" + minutos;
    return "" + horaS + ":" + minutosS;

  }
  dynamicDownloadTxt(res: any) {

    this.dyanmicDownloadByHtmlTag({
      fileName: 'Acuse: ' + this.archivoCarga.sheetName,
      text: JSON.stringify(res)
    });


  }



  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
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

  reset() {
    // console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    //  console.log(this.myInputVariable.nativeElement.files);
  }

  private cleanVar() {
    this.archivoCarga = new ArchivoCarga();
    this.archivoCarga.errmsg = "";
    this.blnDeshabilitar = false;
    this.percentDone = 0;
    this.unidadMedica = new Array<UnidadMedica>()
    this.servicio = new Array<Servicio>();
    this.ubicacion = new Array<Ubicacion>();
    this.responsable = new Array<Responsable>();
    this.programasTS = new Array<ProgramaTS>();
    this.calendarioDias = new Array<CalendarioDias>();
    this.persona = new Array<Persona>();
    this.turnos = new Array<Turno>();
    this.puestos = new Array<Puesto>();


  }

  btnCancelar() {
    this.cleanVar();

    this.reset();

    this.cancelar();
  }
  btnAceptar() {
    this.cleanVar();

    this.reset();

    this.cancelar();
  }

  btnClose() {
    this.cleanVar();
    this.reset();
    this.cancelar();
  }

  private mostrarMensaje(tipo: string, msj: string, tipoMsj?: string) {
    // this.mensaje = new objAlert;
    // this.mensaje.visible = true;
    this.mensaje.type = tipo;
    this.mensaje.message = msj;
    this.mensaje.typeMsg = tipoMsj;
    // console.log(this.mensaje);
    // setTimeout(() => {
    //   this.mensaje.visible = false;
    // }, 4500);
    this.onAlert.emit(this.mensaje);
  }



}
