import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fichapaciente',
  templateUrl: './fichapaciente.component.html',
  styleUrls: ['./fichapaciente.component.css']
})
export class FichapacienteComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redireccion(ruta: string){

    this.router.navigate([ruta]);

  }

}
