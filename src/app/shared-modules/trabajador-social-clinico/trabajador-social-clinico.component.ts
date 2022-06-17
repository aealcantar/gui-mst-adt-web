import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-trabajador-social-clinico',
  templateUrl: './trabajador-social-clinico.component.html',
  styleUrls: ['./trabajador-social-clinico.component.css']
})
export class TrabajadorSocialClinicoComponent implements OnInit {

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
