import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CertificadoDefuncion } from 'src/app/models/certificado-defuncion.model';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';

@Component({
  selector: 'app-nuevo-certificado',
  templateUrl: './nuevo-certificado.component.html',
  styleUrls: ['./nuevo-certificado.component.css'],
})
export class NuevoCertificadoComponent implements OnInit {
  formAdd;
  constructor(
    private formBuilder: FormBuilder,
    private cronicaGrupalService: CronicaGrupalService
  ) {
    this.formAdd = formBuilder.group({
      fhDefuncion: ['', Validators.required],
      hrDefuncion: ['', Validators.required],
      folio: ['', Validators.required],
      nss: ['', Validators.required],
      servicio: ['', Validators.required],
      nombreAsegurado: ['', Validators.required],
      fhEntrega: ['', Validators.required],
      hrEntrega: ['', Validators.required],
      funeraria: ['', Validators.required],
      familiar: ['', Validators.required],
      parentesco: ['', Validators.required],
      observaciones: ['', Validators.required],
      trabajadorSocial: [''],
      matricula: [''],
    });
  }

  listaServicios: Array<any> = [];
  ngOnInit(): void {
    this.cargarServicios();
    this.formAdd;
  }
  async cargarServicios() {
    this.cronicaGrupalService.getCatServicios().subscribe((servicios) => {
      this.listaServicios = servicios;
    });
  }

  guardar() {
    if (!this.formAdd.valid) {
      const certificado = new CertificadoDefuncion();
      console.log(this.formAdd.get('fhDefuncion').value);
    } else {
      alert('formulario no valido');
    }
  }
  cancelar() {
    console.log(this.formAdd.value);
  }
}
