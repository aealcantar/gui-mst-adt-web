import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms'

@Component({
  selector: 'app-nuevo-aviso-mp',
  templateUrl: './nuevo-aviso-mp.component.html',
  styleUrls: ['./nuevo-aviso-mp.component.css']
})
export class NuevoAvisoMpComponent implements OnInit {

  constructor(
	private formBuilder: FormBuilder,
  ) { }
  
  formNuevoAvisoMP : any = this.formBuilder.group({
	
  });
  
  
  ngOnInit(): void {
  }

  guardar() {
	console.log(this.formNuevoAvisoMP.value);
  }
  
  modalcarga(content: any) {
 
  }
  
}
