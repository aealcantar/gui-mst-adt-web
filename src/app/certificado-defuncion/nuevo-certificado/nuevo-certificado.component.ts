import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CertificadoDefuncion } from 'src/app/models/certificado-defuncion.model';
import { Paciente } from 'src/app/models/paciente.model';
import { Usuario } from 'src/app/models/usuario.model';
import { CertificadoDefuncionService } from 'src/app/service/certificado-defuncion.service';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';

declare var $: any;
@Component({
  selector: 'app-nuevo-certificado',
  templateUrl: './nuevo-certificado.component.html',
  styleUrls: ['./nuevo-certificado.component.css'],
})
export class NuevoCertificadoComponent implements OnInit, AfterViewInit {
  formAdd;
  certificado: CertificadoDefuncion;
  usuario!: Usuario;
  paciente!: Paciente;
  hasCertificado: boolean = false;
  validarCampos: boolean = false;
  @ViewChild('btnGuardar') btnGuardar: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private cronicaGrupalService: CronicaGrupalService,
    private certificadoService: CertificadoDefuncionService
  ) {
    this.formAdd = formBuilder.group({
      fechaDefuncion: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      horaDefuncion: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      foliofuncion: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      nssPaciente: new FormControl(''),
      cveServicio: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      nombreAsegurado: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      fechaDeEntregaDeCertificado: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      horaDeEntregaDeCertificado: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      nombreFuneraria: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      nombreFamiliar: new FormControl('', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      parentescoFamiliar: new FormControl('', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      observaciones: new FormControl('', [
        Validators.required,
        Validators.maxLength(1500),
      ]),
      trabajadorSocial: new FormControl(''),
      matricula: new FormControl(''),
      cvePersonalQueElaboro: new FormControl(''),
    });
  }
  ngAfterViewInit(): void {
    $('#fhDefuncion').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.formAdd.get('fechaDefuncion')?.patchValue(date);
          // this.handleDatesChange();
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.formAdd.get('fechaDefuncion')?.patchValue(null);
        }
      },
    });
    $('#entregaCertificado').datepicker({
      dateFormat: 'dd/mm/yy',
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
          this.formAdd.get('fechaDeEntregaDeCertificado')?.patchValue(date);
          // this.handleDatesChange();
        }
      },
      onClose: (date: any) => {
        if (!date) {
          this.formAdd.get('fechaDeEntregaDeCertificado')?.patchValue(null);
        }
      },
    });
  }

  listaServicios: Array<any> = [];
  ngOnInit(): void {
    const userTemp = sessionStorage.getItem('usuario') || '';
    this.paciente = JSON.parse(localStorage.getItem('paciente'));
    if (userTemp !== '') {
      this.usuario = JSON.parse(userTemp);
    } else {
      this.usuario = new Usuario();
      this.usuario.cveUsuario = 12;
      this.usuario.matricula = 'XXXX-XXXX-XX';
      this.usuario.strNombres = 'Alan Isaac';
      this.usuario.strApellidoP = 'Villafan';
      this.usuario.strApellidoM = 'Folres';
    }
    this.cargarServicios();
    this.formAdd
      .get('trabajadorSocial')
      .setValue(
        `${this.usuario.strNombres} ${this.usuario.strApellidoP} ${this.usuario.strApellidoM}`
      );
    this.formAdd.get('matricula').setValue(this.usuario.matricula);
    this.formAdd.get('nssPaciente').setValue(this.paciente.nss);
    this.formAdd.get('cvePersonalQueElaboro').setValue(this.usuario.cveUsuario);
    this.formAdd.controls['trabajadorSocial'].disable();
    this.formAdd.controls['nssPaciente'].disable();
    this.formAdd.controls['matricula'].disable();
    //cvePersonalQueElaboro
  }
  async cargarServicios() {
    this.cronicaGrupalService.getCatServicios().subscribe((servicios) => {
      this.listaServicios = servicios;
    });
  }
  imprimir() {
    if (this.certificado !== undefined) {
      this.certificadoService
        .imprimir(
          this.certificado,
          this.usuario.matricula,
          this.usuario.strNombres
        )
        .subscribe(
          (response) => {
            console.log(response);
            const file = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(file);
            window.open(url);
          },
          (error) => {
            console.log(`Error en certificado de defuncnion`, error);
          }
        );
    }
  }
  async guardar() {
    if (this.formAdd.valid) {
      this.validarCampos = false;
      const certificado = this.formAdd.getRawValue() as CertificadoDefuncion;
      console.log('antes de guardar', certificado);
      //  this.certificado = certificado;

      this.certificadoService
        .insert(certificado)
        .subscribe(async (response) => {
          console.log('despues de guardar', response);
          this.certificado = response.certificadoDeDefuncion;
          sessionStorage.setItem(
            'certificadoDefuncion',
            await JSON.stringify(this.certificado)
          );
          this.router.navigate(['detalle-certificado-defuncion']);
        });
    } else {
      this.validarCampos = true;
      this.onFormChanges();
    }
  }
  onFormChanges() {
    this.formAdd.valueChanges.subscribe((change) => {
      if (this.formAdd.valid) {
        this.validarCampos = false;
      } else {
        console.log('el fomulario sigue siendo invalido', this.formAdd.value);
      }
    });
  }
  cancelar(modal: any) {
    this.dialog.open(modal, {
      width: '450px',
      maxHeight: '350px',
    });
  }

  cancelarSinGuardar() {
    this.router.navigate(['login']);
  }
}
