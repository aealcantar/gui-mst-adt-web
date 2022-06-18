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
  submitted = false;
  articulo: string = "";
  mostrarArticulos:boolean=false;


  bitacora = {
    aplicativo: "",
    flujo: "",
    idUsuario: 1,
    nombreUsuario: "leandro"
  };

  nuevosArticulosArray: Array<any> = [];

  formNuevoArticulo:any =new FormGroup({

    bitacora:new FormControl("",Validators.required), 
    personalQueElaboro:new FormControl("",Validators.required), 
    idCa:new FormControl("",Validators.required), 
    noFolioControl:new FormControl("",Validators.required), 
    fecha:new FormControl("",Validators.required), 
    noCama:new FormControl("",Validators.required), 
    servicio:new FormControl("",Validators.required), 
    telefono:new FormControl("",Validators.required), 
    articulo:new FormControl(""), 
    trabajadorNombreRecibe: new FormControl(""),
    enfermeriaNombreEntrega:new FormControl("",Validators.required), 
    ubicacion:new FormControl("",Validators.required), 
    horarioEntregaArticulo:new FormControl("",Validators.required), 
    resguardoFecha:new FormControl("",Validators.required), 
    resguardoHora:new FormControl("",Validators.required), 
    resguardoNombreRecibe: new FormControl("",Validators.required),
    resguardoNombreEntrega: new FormControl("",Validators.required),
    recepcionFecha: new FormControl("",Validators.required),
    recepcionHora: new FormControl("",Validators.required),
    recepcionNombreRecibe: new FormControl("",Validators.required),
    recepcionNombreEntrega: new FormControl("",Validators.required),
    recepcionUbicacion: new FormControl("",Validators.required),
    recepcionHorarioEntregaArticulo: new FormControl("",Validators.required),
  
  });





  
  constructor(private formBuilder: FormBuilder,
    private router: Router,) { }

  ngOnInit(): void {
  }

  guardarControl() {
    this.submitted = true;
    console.log(this.formNuevoArticulo.controls.recepcionHorarioEntregaArticulo.errors);
    console.log(this.formNuevoArticulo.value)
  }
  cancelar() {
    console.log("cancelar")
  }

  agegarArticulo() {

    let articulo = this.formNuevoArticulo.value.articulo;
    console.log(articulo)

    if (articulo.trim().length == 0 ? true : false) {
      return;
    }

    let indice = this.nuevosArticulosArray.indexOf(articulo.trim());

    if (indice !== -1) {
      return;
    } else {
      this.nuevosArticulosArray.push(articulo.trim());
      this.formNuevoArticulo.controls["articulo"].setValue("");
      this.mostrarArticulos=true;
    }
  
  }

  eliminarArticulo(articulo:string){
    
    let i =this.nuevosArticulosArray.indexOf(articulo);

    if(i !== -1){ 
      this.nuevosArticulosArray.splice(i,1);
    }

    if(this.nuevosArticulosArray.length==0){
      this.mostrarArticulos=false;
    }else{ this.mostrarArticulos=true;}
    console.log(this.nuevosArticulosArray)
  }

 
  
}
