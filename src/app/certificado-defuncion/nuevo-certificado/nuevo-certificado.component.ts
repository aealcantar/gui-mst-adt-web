import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CertificadoDefuncion } from 'src/app/models/certificado-defuncion.model';
import { CertificadoDefuncionService } from 'src/app/service/certificado-defuncion.service';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';

@Component({
  selector: 'app-nuevo-certificado',
  templateUrl: './nuevo-certificado.component.html',
  styleUrls: ['./nuevo-certificado.component.css'],
})
export class NuevoCertificadoComponent implements OnInit {
  formAdd;
  certificado : CertificadoDefuncion;
  constructor(
    private formBuilder: FormBuilder,
    private cronicaGrupalService: CronicaGrupalService,
    private certificadoService : CertificadoDefuncionService
  ) {
    this.formAdd = formBuilder.group({
      fechaDefuncion:new FormControl ('', Validators.required),
      horaDefuncion:new FormControl ('', Validators.required),
      foliofuncion:new FormControl ('', Validators.required),
      nssPaciente:new FormControl ('', Validators.required),
      cveServicio:new FormControl ('', Validators.required),
      nombreAsegurado:new FormControl ('', Validators.required),
      fechaDeEntregaDeCertificado:new FormControl ('', Validators.required),
      horaDeEntregaDeCertificado:new FormControl ('', Validators.required),
      nombreFuneraria:new FormControl ('', Validators.required),
      nombreFamiliar:new FormControl ('', Validators.required),
      parentescoFamiliar:new FormControl ('', Validators.required),
      observaciones:new FormControl ('', Validators.required),
      trabajadorSocial:new FormControl (''),
      matricula:new FormControl (''),
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
    if (this.formAdd.valid) {
      const certificado = this.formAdd.value as CertificadoDefuncion;
      console.log(certificado);
      this.certificadoService.insert(certificado).subscribe(response=>{
        console.log(response)
        this.certificado = certificado
      })
      
    } else {
      console.log(
        `'formulario no valido' ${JSON.stringify(this.formAdd.value)}`
      );
    }
  }
  cancelar() {
    console.log(this.formAdd.value);
  }
}
