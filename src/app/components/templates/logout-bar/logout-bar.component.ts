import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-bar',
  templateUrl: './logout-bar.component.html',
  styleUrls: ['./logout-bar.component.css']
})
export class LogoutBarComponent implements OnInit {

  nombreUsuario: string = '';
  rol: string = '';
  constructor(private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon("usuario", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/usuario.svg"));
    this.matIconRegistry.addSvgIcon("cerrar_sesion", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/icons/cerrar_sesion.svg"));
  }

  ngOnInit(): void {

   this.nombreUsuario = 'Roberto García';
   this.rol = 'Trabajador(a) social - Nivel 2';
  }


  btnLogin() {
    this.router.navigate(['/login']);
  }

  btnCatalogos() {

    this.router.navigate(['catalogos/cargaCatalogos']);

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
