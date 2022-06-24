import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ControlArticulosService } from '../../services/control-articulos.service';

@Component({
  selector: 'app-detalle-control-articulos',
  templateUrl: './detalle-control-articulos.component.html',
  styleUrls: ['./detalle-control-articulos.component.css']
})
export class DetalleControlArticulosComponent implements OnInit {

  detalle: any = {
  };

  idControlArticulos: string = "";


  articulosArray: Array<any> = ["adasdasdasdasdas", "asdasdasdasdasdasd", "asdasdasdasdas", "asdasdasasddas"];

  constructor(private controlArticulosService: ControlArticulosService,
    private rutaActiva: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.idControlArticulos = this.rutaActiva.snapshot.paramMap.get('id');
    console.log(this.idControlArticulos)
    this.buscarDetalleArticulos(   this.idControlArticulos)
  }

  buscarDetalleArticulos(idControlArticulo:string) {
    let datos = {
      "bitacora": {
        "aplicativo": "",
        "flujo": "",
        "idUsuario": 1,
        "nombreUsuario": "",
        "tipoUsuario": 1
      },
      "idCa": idControlArticulo
    };

    
    this.controlArticulosService.getDetalleControlArticulos(datos).subscribe((res:any)=>{
      console.log("-----------asd")
      console.log(res);
      let response= res.response;
      let estatus=response.status;
      if(estatus=="OK"){
        let controlArticulos=response.controlArticulosDto;
        let articulos=controlArticulos.articulosArray;
        this.articulosArray=articulos;
        this.detalle=controlArticulos;

        console.log(controlArticulos)
      }
      console.log(response.estatus);
      // let valor=res.List[0];
      // this.detalle=valor;
      
      // console.log(valor) 
    },(error:any)=>{
      console.log("fallo y no se porque")
      console.log(error);
    });
    
    
    
    

    
     
      

  }


  impirmiControlArticulos() {

    let datos={
      

        "folio":"2010-89-0414",

        "uMedica":"1M1989OR",

        "paternoP":" URIBE ",

        "maternoP":"LOPEZ",

        "nombreP":"CRISTIAN",

        "cama":"10",

        "nss":"UMD No. 11",

        "servicio":"TRAB SOC 01",

        "tel1":"555555555",

        "articulos":["Telefono ","Cartera","Zapatilla","gorra"],

        "diaSA":"20",

        "mesSA":"10",

        "añoSA": "2022",

        "horaSA":"12:12 pm",

        "nombreTS":"Manuel Avila Camacho",

        "nombrePE":"America Hdez",

        "diaR":"10",

        "mesR":"02",

        "añoR": "2017",

        "horaR":"10:10 pm",

        "ubicacionEntrega":"Tlalnepantla de Baz",

        "horarioEntrega":"06:58",

        "nombreTSC":"Manuel Avila Camacho",

        "matriculaTSC":"5542468958"

        
      };
      this.controlArticulosService.downloadPdf(datos).subscribe(
        (response: Blob) => {
          console.log(response)
          var file = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(file);
          window.open(url);
        }, (error: HttpErrorResponse) => {
          console.error("Error al descargar reporte: ", error.message);
        }
      );
  }
}
