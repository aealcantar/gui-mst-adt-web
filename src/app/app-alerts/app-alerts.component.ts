import { Component, OnInit,Input } from '@angular/core';
import { AlertInfo } from './app-alert.interface';

@Component({
  selector: 'app-app-alerts',
  templateUrl: './app-alerts.component.html',
  styleUrls: ['./app-alerts.component.css']
})
export class AppAlertsComponent implements OnInit {
 @Input() alert!: AlertInfo;
  // @Input() objAlerta!: alertInfo;

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
