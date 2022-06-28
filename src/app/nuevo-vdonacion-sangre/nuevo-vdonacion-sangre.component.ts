import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidatorFn } from '@angular/forms'
import { Validators } from '@angular/forms'

declare var $: any;

@Component({
  selector: 'app-nuevo-vdonacion-sangre',
  templateUrl: './nuevo-vdonacion-sangre.component.html',
  styleUrls: ['./nuevo-vdonacion-sangre.component.css']
})
export class NuevoVdonacionSangreComponent implements OnInit {

  formNuevoVolante: any = this.formBuilder.group({
    idUnidadMedica: ['', Validators.required],
    fechaUnidadMedica: ['', Validators.required],
    nombreBancoSangre: ['', Validators.required],
    horarioInicial: ['', Validators.required],
    horarioFinal: ['', Validators.required],
    codigoPostal: ['', Validators.required],
    estado: ['', Validators.required],
    deleMuni: ['', Validators.required],
    ciudad: ['', Validators.required],
    colonia: ['', Validators.required],
    calle: ['', Validators.required],
    numeroExterior: ['', Validators.required],
    numeroInterior: ['', Validators.required],

    nombrePaciente: ['', Validators.required],
    servicio: ['', Validators.required],
    fechaInternamiento: ['', Validators.required],
    fechaCirugia: ['', Validators.required],
    telefonoPaciente: ['', Validators.required],

    nombreTS: ['', Validators.required],
    matriculaTS: ['', Validators.required],
    telefonoTS: ['', Validators.required],
    observacionesTS: ['', Validators.required],

  })

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
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
    this.router.navigateByUrl("/consulta-estudios-medicos", { skipLocationChange: true });
    $('#content').modal('hide');
  }
}
