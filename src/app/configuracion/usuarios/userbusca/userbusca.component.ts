import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { objAlert } from '../../../common/alerta/alerta.interface';
import { AlertaComponent} from '../../../common/alerta/alerta.component' ;
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UsuariosService } from '../usuarios.service';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/service/auth-service.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CargamasivaComponent } from '../../catalogos/cargamasiva/cargamasiva.component'
import { HelperMensajesService } from '../../../services/helper.mensajes.service';
import Swal from 'sweetalert2';
//import { rootCertificates } from 'tls';
declare var $:any;
//declare var $gmx:any;
var listo: boolean;
var table:any;
var paginaactual:number=0;


@Component({
  selector: 'app-userbusca',
  templateUrl: './userbusca.component.html',
  styleUrls: ['./userbusca.component.css']
})
export class UserbuscaComponent implements OnInit  {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: any = DataTableDirective;

  alert = new objAlert;

  lstUsuarios: Array<any> = [];

  txtbusca: string = '';
  numitems:number = 15;
  pagactual:number = 1;
  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>();


  constructor(private authService: AuthService,
    private http: HttpClient, private router: Router,
    private userservice: UsuariosService,
    private renderer: Renderer2,
    private elementRef:ElementRef,
    public dialog: MatDialog,
    private _Mensajes: HelperMensajesService) {}


  public ngOnInit(): void {
    this.authService.setProjectObs("Agenda Digital Transversal");
    //buscarusuario2();
    this.buscarusuario();

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


  limpiarbusqueda(){
    this.lstUsuarios = [];
    this.txtbusca = '';
  }

  buscarusuario(){

    if(this.txtbusca.trim() != ""){
      if(!isNaN(+this.txtbusca.trim().toString()) && this.txtbusca.trim().toString().length < 7 ){
        //this.muestraAlerta('Debe ingresar mínimo 7 dígitos para la búsqueda de matrícula','alert-warning','Alerta');
        this.muestraAlerta(this._Mensajes.MSJ_WARNING_BUSCA_USR, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
        return;
      }
    }
    this.lstUsuarios = [];
    this.pagactual = 1;
    this.msjLoading("Cargando...");
    this.userservice.getUsuarios(this.txtbusca.trim().toString()).subscribe({
      next: (resp:any) => {

        console.log(resp);
        this.lstUsuarios = resp;



        // table = $('#tblusuarios').DataTable({
        //   pagingType: 'simple_numbers',
        //   pageLength: this.numitems,
        //   processing: true,
        //   info: false,
        //   searching: false,
        //   "lengthChange": false,
        //   "dom": "t<'table-pie' <'#cargalay.col-md-4'><'col-md-4 col-lg-4 text-center'p><'#nopag.col-md-4'>>",
        //   "language": {
        //     "paginate": {
        //       "first": "First page",
        //       "previous": '<span class="glyphicon glyphicon-menu-left paginacion-icon-navegacion" aria-hidden="true"></span>',
        //       "next": '<span class="glyphicon glyphicon-menu-right paginacion-icon-navegacion" aria-hidden="true"></span>',
        //       "last": "last"
        //     }
        //   }
        // });

        //this.dtTrigger.next('#tblusuarios');

        setTimeout(()=>{
          table = $('#tblusuarios').DataTable();
          //$('#tblusuarios').DataTable().page.len( this.numitems ).draw();
          this.dtOptions.pageLength = this.numitems;

          const app = document.getElementById("cargalay");

          if(document.querySelector(".cargalayout")){
            document.querySelector(".cargalayout").remove();
          }

          // // 2. Create a new <p></p> element programmatically
          // const p = document.createElement('div');
          // // 3. Add the text content
          // p.className = 'cargalayout';
          // p.innerHTML = '<span (click)="cargalayoutusuarios()">Carga de personal: <img src="../../../../assets/images/icon-upload.png"> </span>';
          // // 4. Append the p element to the div element
          // app?.appendChild(p);
          // //app?.appendChild("")

          const recaptchaContainer = this.renderer.createElement('div');
          // Set the id of the div
          this.renderer.setProperty(recaptchaContainer, 'className', 'cargalayout');
          this.renderer.setProperty(recaptchaContainer, 'innerHTML', '<span (click)="cargalayoutusuarios()">Carga de personal: <img src="../../../../assets/images/icon-upload.png"> </span>');

          // Append the created div to the body element
          this.renderer.appendChild(app, recaptchaContainer);


          this.elementRef.nativeElement.querySelector('.cargalayout')
                                  .addEventListener('click', this.cargalayoutusuarios.bind(this));

          // const dm = document.getElementById("nopag");
          // const dv = document.createElement('div');
          // dv.className = "nopag";
          // dv.textContent = "Página";
          // dv.innerHTML = 'Página<span class="bg-nopag" (innerText)="pagactual"></span>';
          // dm?.appendChild(dv);

          setTimeout(()=>{
            table.on( 'page', ()=> {
              console.log('Page: ' + table.page.info().page );
              paginaactual = table.page.info().page;
              this.pagactual = paginaactual + 1;
              } );
          },1000);
          Swal.close();
        },1000);
      },
      error: (err) => {
        this.lstUsuarios = [];
        this.muestraAlerta(this._Mensajes.MSJ_ERROR_CONEXION_USR, this._Mensajes.ALERT_DANGER, this._Mensajes.ERROR);
        Swal.close();
      }
    })

  }

  nuevousuario(){
    this.router.navigateByUrl("/guardauser", { skipLocationChange: true });
  }

  muestrausuario(id: number){
    this.router.navigateByUrl("/consultauser/" + id, { skipLocationChange: true });
  }

  cargalayoutusuarios(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idCatalogos: 7,
      "nombreCatalogo": "Usuarios",
      "sheetName": "C_personal"
    };

    const dialogo1 = this.dialog.open(CargamasivaComponent, dialogConfig);

    dialogo1.afterClosed().subscribe(art => {
      console.log("result: ", art);
      //if (art != undefined)

    });

    dialogo1.componentInstance.onAlert.subscribe(dats => {
      console.log("result: ", dats);
      this.muestraAlerta(dats.message, dats.type, dats.typeMsg);
    });

  }

  regresar(){
    const org = localStorage.getItem('origen');
    if(org){
      localStorage.removeItem('origen');
      this.router.navigateByUrl(org, { skipLocationChange: true });
    } else{
      this.router.navigateByUrl("busqueda", { skipLocationChange: true });
    }

  }

  private msjLoading(titulo: string) {
    Swal.fire({
      title: titulo,

      didOpen: () => {
        Swal.showLoading();
      }
    })
  }

  muestraAlerta(mensaje: string, estilo: string,tipoMsj?: string){
    this.alert = {
      message: mensaje,
      type: estilo,
      visible: true,
      typeMsg: tipoMsj
    }
    setTimeout(() => {
      this.alert = {
        message:'',
        type: 'custom',
        visible: false
      }
    }, 2000);
  }

  cambiatotalpaginas(numpag:number){
    this.numitems = numpag;
    $('#tblusuarios').DataTable().page.len( this.numitems ).draw();
    paginaactual = table.page.info().page;
    this.pagactual = paginaactual + 1;
  }
}





