import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms'
import { AvisoMP } from '../models/aviso-mp.model';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EstudioSocialMedicoService } from '../service/estudio-social-medico.service';
import { Estado } from '../models/estado.model';
import { Municipio } from '../models/municipio.model';
@Component({
  selector: 'app-nuevo-aviso-mp',
  templateUrl: './nuevo-aviso-mp.component.html',
  styleUrls: ['./nuevo-aviso-mp.component.css']
})
export class NuevoAvisoMpComponent implements OnInit {

  public submitted: boolean = false;
  public avisoMP: AvisoMP;
  public listaServicios: Array<any> = [];
  public catEstados: Estado[] = [];
  public catMunicipios: Municipio[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cronicaGrupalService: CronicaGrupalService,
    private estudioSocialService: EstudioSocialMedicoService,
  ) { }

  formEdit: any = this.formBuilder.group({
    fecha: [null, Validators.required],
    alcaldia: [null, Validators.required],
    agenciaMP: [null, Validators.required],
    nombrePaciente: [null, Validators.required],
    nombreHospital: [null, Validators.required],
    servicio: [null, Validators.required],
    numeroCama: [null, Validators.required],
    fechaIngreso: [null, Validators.required],
    horaInicial: [null, Validators.required],
    horaFinal: [null, Validators.required],
    lesionesPresentadas: [null, Validators.required],
    nombreMedico: [null, Validators.required],
    matriculaMedico: [null, Validators.required],
    nombreTrabajador: [null, Validators.required],
    matriculaTrabajador: [null, Validators.required],
    idEstado: [null, Validators.required],
  });


  ngOnInit(): void {
    this.obtenerCatalogos();
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

  guardar() {
    this.submitted = true;
    console.log(this.formEdit.value);
  }

  modalcarga(content: any) {

  }

  onChangeEstado(): void {
    this.estudioSocialService.getCatMunicipiosByEstado(this.formEdit.get('idEstado').value).toPromise().then(
      (municipios: Municipio[]) => {
        this.catMunicipios = municipios;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );
  }

}
