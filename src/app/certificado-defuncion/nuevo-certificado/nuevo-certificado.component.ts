import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';

@Component({
  selector: 'app-nuevo-certificado',
  templateUrl: './nuevo-certificado.component.html',
  styleUrls: ['./nuevo-certificado.component.css']
})
export class NuevoCertificadoComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private cronicaGrupalService: CronicaGrupalService) { }
  formAdd: any = this.formBuilder.group({
    fhDefuncion: new FormControl('', Validators.required),
    hrDefuncion: new FormControl('', Validators.required),
    folio: new FormControl('', Validators.required),
    nss: new FormControl('', Validators.required),
    servicio: new FormControl('', Validators.required),
    nombreAsegurado: new FormControl('', Validators.required),
    fhEntrega: new FormControl('', Validators.required),
    hrEntrega: new FormControl('', Validators.required),
    funeraria: new FormControl('', Validators.required),
    familiar: new FormControl('', Validators.required),
    parentesco: new FormControl('', Validators.required),
    observaciones: new FormControl('', Validators.required),
    trabajadorSocial: new FormControl(''),
    matricula: new FormControl('')
  })
  listaServicios: Array<any> = []
  ngOnInit(): void {
    this.cargarServicios()
    this.formAdd
  }
  async cargarServicios() {
    this.cronicaGrupalService.getCatServicios().subscribe(servicios => {
      this.listaServicios = servicios
    })
  }

}
