import { Component, OnInit ,Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input()
  activeItem: number = 0;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  pacientesRuta() {
    this.router.navigate(['busqueda'], { skipLocationChange: true });
  }

  irCronicaGrupal() {
    this.router.navigate(["consulta-cronica-grupal"], { skipLocationChange: true });
  }

  irBusquedaDePacientesPorNss() {
    this.router.navigate(["busqueda"], { skipLocationChange: true });
  }

}
