import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidatorFn } from '@angular/forms'
import { Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Estado } from '../../models/estado.model';
import { Municipio } from '../../models/municipio.model';
import { Ciudad } from '../../models/ciudad.model';
import { EstudioSocialMedicoService} from '../../services/estudio-social.service';
import { EstadoCivil } from '../../models/estado-civil.model';
import { EstudioMedico } from '../../models/estudio-medico.model';
import { objAlert } from 'src/app/shared-modules/models/alerta.interface';
declare var $: any;

@Component({
  selector: 'app-nuevo-estudio-social-medico',
  templateUrl: './nuevo-estudio-social-medico.component.html',
  styleUrls: ['./nuevo-estudio-social-medico.component.css']
})
export class NuevoEstudioSocialMedicoComponent implements OnInit {

  alert!: objAlert;

  estados: Estado[] = [];
  municipios: Municipio[] = [];
  ciudades: Ciudad[] = [];
  estadosCiviles: EstadoCivil[] = [];
  tiposComunidad: EstadoCivil[] = [];
  estadosFamiliar: Estado[] = [];
  delegaciones: Municipio[] = [];
  ciudadesFamiliar: Ciudad[] = [];

  datosGenerales = false;
  datosFamiliar = false;
  datosExploracionCaso = false;

  formEstudioSocial: any = this.formBuilder.group({
    solicitadoPor: ['', Validators.required],
    fecha: [null, Validators.required],
    cp: ['', Validators.required],
    estado: ['', Validators.required],
    municipio: ['', Validators.required],
    ciudad: ['', Validators.required],
    colonia: ['', Validators.required],
    calle: ['', Validators.required],
    numeroExt: ['', Validators.required],
    comunidad: ['', Validators.required],
    estadoCivil: ['', Validators.required],
    ocupacion: ['', Validators.required],
    numeroInt: [''],
    telefonoFijo: [''],
    telefonoCelular: [''],
    email: ['', Validators.email]
  });

  formEstudioSocial2: any = this.formBuilder.group({
    nombreFamiliar: ['', Validators.required],
    edad: ['', Validators.required],
    parentesco: ['', Validators.required],
    codigoP: ['', Validators.required],
    estadoF: ['', Validators.required],
    delegacionM: ['', Validators.required],
    ciudadF: ['', Validators.required],
    coloniaF: ['', Validators.required],
    calleF: ['', Validators.required],
    numExtF: ['', Validators.required],
    numIntF: [''],
    telFijo: [''],
    telCel: [''],
    correoF: ['', Validators.email]
  });

  formEstudioSocial3: any = this.formBuilder.group({
    objetivoEstudio: ['', Validators.required],
    datosPaciente: ['', Validators.required],
    datosFamiliares: ['', Validators.required],
    datosEconomicos: ['', Validators.required],
    datosHogar: ['', Validators.required],
    datosComplementarios: ['', Validators.required],
    datosSocialP: ['', Validators.required],
    datosSocialF: ['', Validators.required],
    datosTratamiento: ['', Validators.required],
    datosAcciones: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private estudioSocialService: EstudioSocialMedicoService
  ) { }

  ngOnInit(): void {
    this.datosGenerales = true;
    this.datosFamiliar = false;
    this.datosExploracionCaso = false;
    this.loadCatalogos();
    this.loadCatalogosFamiliar();
    this.formEstudioSocial.controls['fecha'].disable();
  }

  ngAfterViewInit(): void {
    $('#calendarCESM3').val(moment().format('DD/MM/YYYY')).datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.formEstudioSocial.get('fecha')?.patchValue(date);
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.formEstudioSocial.get('fecha')?.patchValue(null);
        }
      }
    });
  }

  loadCatalogos(): void {
    this.estudioSocialService.getCatEstados().toPromise().then(
      (estados: Estado[]) => {
        this.estados = estados;
        console.log("ESTADOS: ", this.estados);
      },

      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.estudioSocialService.getCatEstadosCiviles().toPromise().then(
      (estadosCiviles: any) => {
        if (estadosCiviles && estadosCiviles.ArrayList.length > 0) {
          this.estadosCiviles = estadosCiviles.ArrayList;
          console.log("ESTADO CIVILES: ", this.estadosCiviles);
        }
      },

      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
    this.estudioSocialService.getCatTiposComunidad().toPromise().then(
      (tiposComunidad: any) => {
        if (tiposComunidad && tiposComunidad.ArrayList.length > 0) {
          this.tiposComunidad = tiposComunidad.ArrayList;
          console.log("TIPOS COMUNIDAD: ", this.tiposComunidad);
        }
      },

      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  onChangeEstado(): void {
    this.estudioSocialService.getCatMunicipiosByEstado(this.formEstudioSocial.get('estado').value).toPromise().then(
      (municipios: Municipio[]) => {
        this.municipios = municipios;
        console.log("MUNICIPIOS: ", this.municipios);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  onChangeCiudad(): void {
    this.estudioSocialService.getCiudadByEstadoMunicipio(this.formEstudioSocial.get('estado').value,
      this.formEstudioSocial.get('municipio').value).toPromise().then(
        (ciudades: Ciudad[]) => {
          this.ciudades = ciudades;
          console.log("CIUDADES: ", this.ciudades);
          if (this.ciudades.length === 1) {
            this.formEstudioSocial.controls['ciudad'].setValue(this.ciudades[0].idCiudad);
          }
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      );
  }

  loadCatalogosFamiliar(): void {
    this.estudioSocialService.getCatEstados().toPromise().then(
      (estadosFamiliar: Estado[]) => {
        this.estadosFamiliar = estadosFamiliar;
        console.log("ESTADOS FAMILIAR: ", this.estadosFamiliar);
      },

      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  onChangeEstadoFamiliar(): void {
    this.estudioSocialService.getCatMunicipiosByEstado(this.formEstudioSocial2.get('estadoF').value).toPromise().then(
      (delegaciones: Municipio[]) => {
        this.delegaciones = delegaciones;
        console.log("MUNICIPIOS: ", this.delegaciones);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  onChangeMunicipioFamiliar(): void {
    this.estudioSocialService.getCiudadByEstadoMunicipio(this.formEstudioSocial2.get('estadoF').value,
      this.formEstudioSocial2.get('delegacionM').value).toPromise().then(
        (ciudades: Ciudad[]) => {
          this.ciudadesFamiliar = ciudades;
          console.log("CIUDADES: ", this.ciudadesFamiliar);
          if (this.ciudadesFamiliar.length === 1) {
            this.formEstudioSocial2.controls['ciudadF'].setValue(this.ciudadesFamiliar[0].idCiudad);
          }
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      );
  }

  getNombreEstado(idEstado: number, esFamiliar: boolean) {
    if (esFamiliar) {
      return this.estadosFamiliar.find(e => e.idEstado = idEstado)?.nomCompleto;
    } else {
      return this.estados.find(e => e.idEstado = idEstado)?.nomCompleto;
    }
  }

  getNombreMunicipio(idMunicipio: number, esFamiliar: boolean) {
    if (esFamiliar) {
      return this.delegaciones.find(d => d.idDelegacionMunicipio = idMunicipio)?.nomMunicipio;
    } else {
      return this.municipios.find(m => m.idDelegacionMunicipio = idMunicipio)?.nomMunicipio;
    }
  }

  getNombreCiudad(idCiudad: number, esFamiliar: boolean) {
    if (esFamiliar) {
      return this.ciudadesFamiliar.find(c => c.idCiudad = idCiudad)?.nomCiudad;
    } else {
      return this.ciudades.find(c => c.idCiudad = idCiudad)?.nomCiudad;
    }
  }

  getNombreTipoComunidad(idTipoComunidad: number | string) {
    let idTipoComunidadConverted: number;
    if (typeof idTipoComunidad === 'string') {
      idTipoComunidadConverted = Number(idTipoComunidad);
    } else if (typeof idTipoComunidad === 'number') {
      idTipoComunidadConverted = idTipoComunidad;
    }
    return this.tiposComunidad.find(e => e.id === idTipoComunidadConverted)?.descripcion;
  }

  irDatosDeFamiliar() {
    this.datosGenerales = false;
    this.datosFamiliar = true;
    this.datosExploracionCaso = false;
  }

  irExploracionCaso() {
    this.datosGenerales = false;
    this.datosFamiliar = false;
    this.datosExploracionCaso = true;
  }

  irDatosGenerales() {
    this.datosGenerales = true;
    this.datosFamiliar = false;
    this.datosExploracionCaso = false;
  }

  modalcarga() {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    $('#content').modal('show');
  }

  cancelarModal() {
    $('#content').modal('hide');
  }

  salirModal() {
    this.router.navigateByUrl("/lista-estudios", { skipLocationChange: true });
    $('#content').modal('hide');
  }

  guardarEstudioSocial() {
    let estudioMedicoData: EstudioMedico = {
      nombreSolicitante: this.formEstudioSocial.get('solicitadoPor').value,
      fecFecha: moment().format('YYYY-MM-DD'),
      timHora: moment().format('HH:mm:ss'),
      codigoPostal: this.formEstudioSocial.get('cp').value,
      idEstado: this.formEstudioSocial.get('estado').value,
      nombreEstado: this.getNombreEstado(this.formEstudioSocial.get('estado').value, false),
      idDelegacionMunicipio: this.formEstudioSocial.get('municipio').value,
      nombreDelegacionMunicipio: this.getNombreMunicipio(this.formEstudioSocial.get('municipio').value, false),
      idCiudad: this.formEstudioSocial.get('ciudad').value,
      nombreCiudad: this.getNombreCiudad(this.formEstudioSocial.get('ciudad').value, false),
      nomColonia: this.formEstudioSocial.get('colonia').value,
      nomVialidad: this.formEstudioSocial.get('calle').value,
      numExterior: this.formEstudioSocial.get('numeroExt').value,
      numInterior: this.formEstudioSocial.get('numeroInt').value,
      idTipoComunidad: this.formEstudioSocial.get('comunidad').value,
      numTelefonoFijo: this.formEstudioSocial.get('telefonoFijo').value,
      numTelefonoCelular: this.formEstudioSocial.get('telefonoCelular').value,
      correoElectronico: this.formEstudioSocial.get('email').value,
      idEstadoCivil: this.formEstudioSocial.get('estadoCivil').value,
      idOcupacion: this.formEstudioSocial.get('ocupacion').value,
      nombreOcupacion: 'Ingeniero', //No hay catalogo general, solo por id
      nombreResponsable: this.formEstudioSocial2.get('nombreFamiliar').value,
      edad: this.formEstudioSocial2.get('edad').value,
      parentesco: this.formEstudioSocial2.get('parentesco').value,
      codigoPostalFam: this.formEstudioSocial2.get('codigoP').value,
      idEstadoFam: this.formEstudioSocial2.get('estadoF').value,
      nombreEstadoFam: this.getNombreEstado(this.formEstudioSocial2.get('estadoF').value, true),
      idDelegacionMunicipioFam: this.formEstudioSocial2.get('delegacionM').value,
      nombreDelegacionMunicipioFam: this.getNombreMunicipio(this.formEstudioSocial2.get('delegacionM').value, true),
      idCiudadFam: this.formEstudioSocial2.get('ciudadF').value,
      nombreCiudadFam: this.getNombreCiudad(this.formEstudioSocial2.get('ciudadF').value, true),
      ciudadFam: this.formEstudioSocial2.get('ciudadF').value, //No va se repite
      nomColoniaFam: this.formEstudioSocial2.get('coloniaF').value,
      nomVialidadFam: this.formEstudioSocial2.get('calleF').value,
      numExteriorFam: this.formEstudioSocial2.get('numExtF').value,
      numInteriorFam: this.formEstudioSocial2.get('numIntF').value,
      idTipoComunidadFam: this.formEstudioSocial.get('comunidad').value, //No va se repite
      nombreTipoComunidadFim: this.getNombreTipoComunidad(this.formEstudioSocial.get('comunidad').value),
      nombreTipoComunidad: this.getNombreTipoComunidad(this.formEstudioSocial.get('comunidad').value),
      numTelefonoFijoFam: this.formEstudioSocial2.get('telFijo').value,
      numTelefonoCelularFam: this.formEstudioSocial2.get('telCel').value,
      correoElectronicoFam: this.formEstudioSocial2.get('correoF').value,
      objetivoEstudio: this.formEstudioSocial3.get('objetivoEstudio').value,
      datoPaciente: this.formEstudioSocial3.get('datosPaciente').value,
      datoFamiliar: this.formEstudioSocial3.get('datosFamiliares').value,
      datoEconomico: this.formEstudioSocial3.get('datosEconomicos').value,
      condicionHogar: this.formEstudioSocial3.get('datosHogar').value,
      datoComplementario: this.formEstudioSocial3.get('datosComplementarios').value,
      diagSocialPaciente: this.formEstudioSocial3.get('datosSocialP').value,
      diagSocialFamilia: this.formEstudioSocial3.get('datosSocialF').value,
      planTratSocial: this.formEstudioSocial3.get('datosTratamiento').value,
      accionRealizada: this.formEstudioSocial3.get('datosAcciones').value,
      esNuevo: true
    }
    let params = { 'estudioMedico': JSON.stringify(estudioMedicoData) };
    console.log("DATA SAVE: ", estudioMedicoData);
    this.estudioSocialService.addEstudioSocial(estudioMedicoData).subscribe(
      (response: any) => {
        console.log(response);
      }, (resp: HttpErrorResponse) => {
        console.log("RESPUESTA: ", resp.statusText);
        if (resp.statusText === 'OK') {
          this.router.navigate(["detalle-estudio-medico"], { queryParams: params, skipLocationChange: true });
        } else {
          this.showError('Verificar datos capturados');
        }
      }
    );
  }

  //Error
  private showError(error: string) {
    this.alert = {
      message: '<strong>Error.</strong>' + error,
      type: 'error',
      visible: true
    }
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false
      }
    }, 5000);
  }

}
