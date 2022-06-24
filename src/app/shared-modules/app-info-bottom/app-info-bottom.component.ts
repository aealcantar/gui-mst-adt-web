import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-info-bottom',
  templateUrl: './app-info-bottom.component.html',
  styleUrls: ['./app-info-bottom.component.css']
})
export class AppInfoBottomComponent implements OnInit {

  public usuario!: Usuario;

  constructor() { }

  ngOnInit(): void {
    let userTmp = sessionStorage.getItem('usuario') || '';
    if (userTmp !== '') {
      this.usuario = JSON.parse(userTmp);
      console.log("USER DATA: ", this.usuario);
    }
  }
}
