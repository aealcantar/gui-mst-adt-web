import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms'
import { AvisoMP } from '../models/aviso-mp.model';

@Component({
  selector: 'app-nuevo-aviso-mp',
  templateUrl: './nuevo-aviso-mp.component.html',
  styleUrls: ['./nuevo-aviso-mp.component.css']
})
export class NuevoAvisoMpComponent implements OnInit {

  public avisoMP: AvisoMP;

  constructor(
    private formBuilder: FormBuilder,
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
  });


  ngOnInit(): void {
  }

  guardar() {
    console.log(this.formEdit.value);
  }

  modalcarga(content: any) {

  }

}
