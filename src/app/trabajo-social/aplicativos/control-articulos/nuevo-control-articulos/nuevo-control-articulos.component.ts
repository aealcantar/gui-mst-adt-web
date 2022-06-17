import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidatorFn } from '@angular/forms'
import { Validators } from '@angular/forms'
@Component({
  selector: 'app-nuevo-control-articulos',
  templateUrl: './nuevo-control-articulos.component.html',
  styleUrls: ['./nuevo-control-articulos.component.css']
})
export class NuevoControlArticulosComponent implements OnInit {

  formNuevoArticulo: any = this.formBuilder.group({
    solicitadoPor: ['', Validators.required],
    noFolio: [null, Validators.required],
    fecha: ['', Validators.required],
    noCama: ['', Validators.required],
    servicio: ['', Validators.required],
    telefono: ['', Validators.required],
    articulos: ['', Validators.required],
    trabajadorNombreRecibe:new FormControl(""),
    enfermeriaNombreEntrega: ['', Validators.required],
    ubicacion: ['', Validators.required],
    horarioEntregaArticulo: ['', Validators.required],
    resguardoFecha: ['', Validators.required],
    resguardoHora: ['', Validators.required],
    resguardoNombreRecibe: new FormControl(""),
    ocupacion: ['', Validators.required],
    numeroInt: [''],
    telefonoFijo: [''],
    telefonoCelular: [''],
    email: ['', Validators.email]
  });
  constructor( private formBuilder: FormBuilder,
    private router: Router,) { }

  ngOnInit(): void {
  }

  guardar(){
    console.log("guardas")
  }
  cancelar(){
    console.log("cancelar")
  }
}
