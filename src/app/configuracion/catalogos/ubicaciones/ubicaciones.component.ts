import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { objAlert } from 'src/app/common/alerta/alerta.interface';
import { UbicacionesService } from 'src/app/services/ubicaciones/ubicaciones.service';


declare var $: any;
//declare var $gmx:any;
var listo: boolean;
var table: any;
var paginaactual: number = 0;

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})

export class UbicacionesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: any = DataTableDirective;


  lstUbicaciones: Array<any> = [];

  txtbusca: string = '';
  numitems: number = 15;
  pagactual: number = 1;
  dtOptions: DataTables.Settings = {};

  
  mensaje!: objAlert;

  constructor(private formBuilder: FormBuilder, private ubicaciones: UbicacionesService,
    private http: HttpClient, private router: Router, private renderer: Renderer2) {


  }
 
  ngOnInit(): void {
    this.mensaje = new objAlert;
    this.getAll();
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: this.numitems,
      processing: true,
      info: false,
      searching: false,
      "lengthChange": false,
      "dom": "t<'table-pie' <'#cargalay.col-md-4'><'col-md-4 col-lg-4 text-center'p><'#nopag.col-md-4'>>",
      "language": {
        "paginate": {
          "first": "First page",
          "previous": '<span class="glyphicon glyphicon-menu-left paginacion-icon-navegacion" aria-hidden="true"></span>',
          "next": '<span class="glyphicon glyphicon-menu-right paginacion-icon-navegacion" aria-hidden="true"></span>',
          "last": "last"
        }
      }
    };
  }

  getAll() {


    this.lstUbicaciones = [];
    this.pagactual = 1;
    this.ubicaciones.getAll().subscribe({
      next: (resp: any) => {

        console.log(resp);
        this.lstUbicaciones = resp.data;



        setTimeout(() => {
          table = $('#tblusuarios').DataTable();
          this.dtOptions.pageLength = this.numitems;


          setTimeout(() => {
            table.on('page', () => {
              console.log('Page: ' + table.page.info().page);
              paginaactual = table.page.info().page;
              this.pagactual = paginaactual + 1;
            });
          }, 1000);
        }, 1000);

      },
      error: (err) => {
        this.lstUbicaciones = [];
        //this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })

  }

  limpiarbusqueda() {
    this.lstUbicaciones = [];
    this.txtbusca = '';
  }
  cargaUbicaciones() {

  }
  buscarUbicacion(){
debugger
    this.ubicaciones.getByDescAbv(this.txtbusca).subscribe({
      next: (resp: any) => {

        console.log(resp);
        this.lstUbicaciones = resp.data;



        setTimeout(() => {
          table = $('#tblusuarios').DataTable();
          this.dtOptions.pageLength = this.numitems;


          setTimeout(() => {
            table.on('page', () => {
              console.log('Page: ' + table.page.info().page);
              paginaactual = table.page.info().page;
              this.pagactual = paginaactual + 1;
            });
          }, 1000);
        }, 1000);

      },
      error: (err) => {
        this.lstUbicaciones = [];
        //this.muestraAlerta(err.error.message.toString(),'alert-danger','Error');
      }
    })

  }

  btnAtras() {
    this.router.navigateByUrl("/catalogos/cargaCatalogos", { skipLocationChange: true });
  }

}
