import { Component, OnInit } from '@angular/core';

import {  Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';
@Component({
  selector: 'app-datos-generales-usuario',
  templateUrl: './datos-generales-usuario.component.html',
  styleUrls: ['./datos-generales-usuario.component.css']
})
export class DatosGeneralesUsuarioComponent implements OnInit {

  title = 'Ecosistema Digital';
  email: string | undefined;
  nombre: string | undefined;
  matricula: string | undefined;
  proyecto: string = "";

  isAuthenticated$!: Observable<boolean>;

  constructor(
    private authenticationService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated$ = this.authenticationService.isAuthenticatedObs$;
    this.authenticationService.isAuthenticatedObs$.subscribe(
      (isAuthiticated: boolean) => {
        this.nombre = isAuthiticated ? this.authenticationService.usuario.strNombres + " " + this.authenticationService.usuario.strApellidoP : "";
        this.email = isAuthiticated ? this.authenticationService.usuario.strEmail : "";
        this.matricula = isAuthiticated ? this.authenticationService.usuario.strUserName : "";
      }
    )
    this.authenticationService.project$.asObservable().subscribe(
      (proyectoActual) => this.proyecto = proyectoActual
    );
  }

  logOut() {
    this.authenticationService.logout();
  }

}
