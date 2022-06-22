import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { objAlert } from 'src/app/common/alerta/alerta.interface';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent implements OnInit {

  constructor(private router: Router) { }
  mensaje!: objAlert;
  lstUbicaciones: any;
  ngOnInit(): void {
    this.mensaje = new objAlert;
    this.lstUbicaciones = new Array();
  }

  btnAtras() {
    this.router.navigateByUrl("/catalogos/cargaCatalogos", { skipLocationChange: true });
  }

}
