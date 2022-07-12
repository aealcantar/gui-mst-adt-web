import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms'

@Component({
  selector: 'app-nuevo-certificado-defuncion',
  templateUrl: './nuevo-certificado-defuncion.component.html',
  styleUrls: ['./nuevo-certificado-defuncion.component.css']
})
export class NuevoCertificadoDefuncionComponent implements OnInit {

  constructor(
	private formBuilder: FormBuilder,
  ) { }
  
  formNuevoCertDefuncion : any = this.formBuilder.group({
	
  });

  ngOnInit(): void {
  }

  guardar() {
	console.log(this.formNuevoCertDefuncion.value);
  }	
  
}
