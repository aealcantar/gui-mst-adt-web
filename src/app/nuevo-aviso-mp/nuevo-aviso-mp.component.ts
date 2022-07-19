import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms'
import { AvisoMP } from '../models/aviso-mp.model';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EstudioSocialMedicoService } from '../service/estudio-social-medico.service';
import { Estado } from '../models/estado.model';
import { Municipio } from '../models/municipio.model';
import { AvisoMinisterioPublicoService } from '../service/aviso-mp.service';
import { AppTarjetaPresentacionService } from '../app-tarjeta-presentacion/app-tarjeta-presentacion.service';
import { pacienteSeleccionado } from '../busqueda-nss/paciente.interface';
import * as moment from 'moment';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-nuevo-aviso-mp',
  templateUrl: './nuevo-aviso-mp.component.html',
  styleUrls: ['./nuevo-aviso-mp.component.css']
})
export class NuevoAvisoMpComponent implements OnInit {

  paciente!: pacienteSeleccionado;
  public submitted: boolean = false;
  public avisoMP: AvisoMP;
  public listaServicios: Array<any> = [];
  public catEstados: Estado[] = [];
  public catMunicipios: Municipio[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private cronicaGrupalService: CronicaGrupalService,
    private estudioSocialService: EstudioSocialMedicoService,
    private avisoMinisterioPublico: AvisoMinisterioPublicoService,
    private tarjetaService: AppTarjetaPresentacionService,
  ) { }

  editForm: any = this.formBuilder.group({
    fechaRegistroAviso: [null, Validators.required],
    alcaldia: [null, Validators.required],
    agenciaMP: [null, Validators.required],
    nombrePaciente: [null, Validators.required],
    idUnidadHospital: [null, Validators.required],
    ubicacionHospital: [null, Validators.required],
    cveServicio: [null, Validators.required],
    numCama: [null, Validators.required],
    fechaIngreso: [null, Validators.required],
    horaIngreso: [null, Validators.required],
    lesionesPaciente: [null, Validators.required],
    nombreMedicoTratante: [null, Validators.required],
    matriculaMedicoTratante: [null, Validators.required],
    nombreTrabajadorSocial: [null],
    matriculaTrabajadorSocial: [null],
    horaIngresoTmp: [null, Validators.required],
    minutosIngresoTmp: [null, Validators.required],
    idEstado: [null, Validators.required],
  });


  ngOnInit(): void {
    this.obtenerCatalogos();
    this.paciente = this.tarjetaService.get();
    if (this.paciente) {
      this.getCatUnidadesMedicas();
    }
  }

  ngAfterViewInit(): void {
    $('#fechaAvisoMP').datepicker({
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.editForm.controls['fechaRegistroAviso'].setValue(date);
          console.log("date onSelect: ", date);
        }
      }
    });

    $('#fechaIngresoAvisoMP').datepicker({
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.editForm.controls['fechaIngreso'].setValue(date);
          console.log("date onSelect: ", date);
        }
      }
    });
  }

  obtenerCatalogos() {
    this.cronicaGrupalService
      .getCatServicios()
      .toPromise()
      .then(
        (res) => {
          this.listaServicios = res;
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      );

    this.getEstados();
  }

  getEstados() {
    this.estudioSocialService.getCatEstados().toPromise().then(
      (estados: Estado[]) => {
        this.catEstados = estados;

      },

      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  getCatUnidadesMedicas(): void {
    this.avisoMinisterioPublico.getCatUnidadesMedicas().toPromise().then(
      (unidadesMedicas: any[]) => {
        const unidadMedica = unidadesMedicas.filter(e => e.cve_unidad_medica === `UMF${this.paciente.unidadMedica}`) || [];
        this.editForm.get('idUnidadHospital').patchValue(unidadMedica[0]?.cve_unidad_medica);
        this.editForm.get('ubicacionHospital').patchValue(unidadMedica[0]?.dom_direccion);
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  guardar() {
    this.submitted = true;
    this.avisoMP = {
      ...this.avisoMP,
      ...this.editForm.value,
      fechaRegistroAviso: moment(this.editForm.get('fechaRegistroAviso')).format('YYYY/MM/DD'),
      fechaIngreso: moment(this.editForm.get('fechaIngreso')).format('YYYY/MM/DD'),
    }
    console.log(this.avisoMP);

    this.avisoMinisterioPublico.agregarAvisoMP(this.avisoMP).subscribe(
      (response: any) => {
        debugger;
        if (response && response?.idAvisoMp) {
          let idAvisoMp = response?.idAvisoMp;
          let params = { idAvisoMp };
          this.router.navigate(["detalle-aviso-mp"], { queryParams: params, skipLocationChange: true });
        }
      }, (resp: HttpErrorResponse) => {
        console.log(resp);
      }
    );

  }

  modalcarga(content: any) {

  }

  onChangeEstado(): void {
    this.estudioSocialService.getCatMunicipiosByEstado(this.editForm.get('idEstado').value).toPromise().then(
      (municipios: Municipio[]) => {
        this.catMunicipios = municipios;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

  horaIngresoChange() {
    const hora = this.editForm.get('horaIngresoTmp').value;
    const minutos = this.editForm.get('minutosIngresoTmp').value;
    if (hora && minutos) {
      this.editForm.get('horaIngreso').patchValue(moment(`${hora} ${minutos}`, 'HH:mm').format('HH:mm:SSS'));

    }
  }

}
