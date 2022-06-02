import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service.service';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';

declare var $: any;

@Component({
  selector: 'app-consulta-lista-notas-tsocial',
  templateUrl: './consulta-lista-notas-tsocial.component.html',
  styleUrls: ['./consulta-lista-notas-tsocial.component.css']
})
export class ConsultaListaNotasTSocialComponent implements OnInit, AfterViewInit{
  fechaSelected!: string;
  page: number = 1;
  pageSize: number = 15;
  resultadoTotal: number = 0;
  dtOptions: DataTables.Settings = {};
  numitems: number = 15;
  order: string = 'desc';

  tabla = [
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
    {"Fecha":"20/06/2022", "Descripcion":"lorem imput dolor sit amen lorem imput dolor sit amen lorem imput dolor sit amen lorem imput",},
];

  constructor(private router: Router,
    private authService: AuthService) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    $('#calendar').datepicker({
      dateFormat: "yy/mm/dd",
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.fechaSelected = date.replaceAll('/', '-');
          // console.log("date onSelect: ", date);
          setTimeout(() => {
            // this.getCronicasGrupales()
          }, 0)
        }
      }
    });
  }

  irDetalle(cronicaGrupal: any) {

  }

  irNuevaNota(){
    let params = {
      'objetoAEnviar': null,
    }
    this.router.navigate(["nueva-nota"], { queryParams: params, skipLocationChange: true });
  }

}
