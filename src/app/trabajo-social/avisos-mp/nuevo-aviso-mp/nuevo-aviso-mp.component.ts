import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms'

@Component({
  selector: 'app-nuevo-aviso-mp',
  templateUrl: './nuevo-aviso-mp.component.html',
  styleUrls: ['./nuevo-aviso-mp.component.css']
})
export class NuevoAvisoMpComponent implements OnInit {
	
  public horasArray: string[] = ["01","02","03","04","05","06","07","08","09","10","11","12",
                                 "13","14","15","16","17","18","19","20","21","22","23","24"]
  public minutosArray: string[] = ["01","02","03","04","05","06","07","08","09","10","11","12",
                                   "13","14","15","16","17","18","19","20","21","22","23","24",
                                   "25","26","27","28","29","30","31","32","33","34","35","36"];


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
