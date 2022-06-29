import { Component, Input, OnInit } from '@angular/core';
import { AlertInfo } from '../models/app-alert.interface copy';

@Component({
  selector: 'app-alerta-general',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaGeneralComponent implements OnInit {
  @Input() alert!: AlertInfo;

  constructor() { }

  ngOnInit(): void {
  }



  public getimage(tipo: string){
    let strruta = "../../../assets/images/";
    switch(tipo){
      case "alert-danger":
        strruta = strruta + "icon-close-danger.svg"
        break;
      case "alert-success":
        strruta = strruta + "icon-close-success.svg"
        break;
      case "custom":
      case "alert-warning":
        strruta = strruta + "icon-close-nt.svg"
        break;
      default:
        strruta = strruta + "icon-close-nt.svg"
        break;
    }
    return strruta;
  }
}
