import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth-service.service';
// import { AuthService } from './service/auth-service.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit {
  tituloAplicativo: string = '';
  title = 'Ecosistema Digital';
  email: string | undefined;
  nombre: string | undefined;
  matricula: string | undefined;
  proyecto: string = "";

  isAuthenticated$!: Observable<boolean>;

  constructor(
    private authenticationService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authenticationService.isAuthenticatedObs$;
    this.authenticationService.isAuthenticatedObs$.subscribe(
      (isAuthiticated: boolean) => {
        this.nombre = isAuthiticated ? this.authenticationService.usuario.strNombres + " " + this.authenticationService.usuario.strApellidoP : "";
        this.email = isAuthiticated ? this.authenticationService.usuario.strEmail : "";
        this.matricula = isAuthiticated ? this.authenticationService.usuario.strUserName : "";
      }
    )
    this.authenticationService.getProjectObs().subscribe(
      (proyectoActual) => {
        this.proyecto = proyectoActual;
      }
    );
  }

  logOut() {
    this.authenticationService.logout();
  }

  redirecciona(val: number){
    var ruta:string;
    switch(val){
      case 1:
        ruta = '/catalogos/cargaCatalogos';
        break;
      case 2:
        ruta = '/buscauser';
        break;
      case 3:
        ruta = '/TrabajoSocial/horarios';
        break;
      case 4:
        ruta = '/login';
        break;
    }
    this.router.navigate([ruta]);
  }

}
