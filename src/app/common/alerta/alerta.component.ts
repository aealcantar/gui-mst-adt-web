import { Component, Input, OnInit } from '@angular/core';
import { NgbAlert, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { objAlert } from './alerta.interface';

// interface objAlert {
//   type: string;
//   message: string;
//   visible: boolean;
// }

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaComponent implements OnInit {
  @Input() objAlerta!: objAlert;

  constructor() { }

  ngOnInit(): void {
    console.log("----objAlerta: ",this.objAlerta);
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
