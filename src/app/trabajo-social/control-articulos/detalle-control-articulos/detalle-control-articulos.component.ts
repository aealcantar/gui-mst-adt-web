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
    noFolio: "1234567890",
    fecha: "01/04/2022",
    noCama: "320",
    servicio: "Urología",
    telefono: "5541135434 ,  5547329887",
    nombreTrabajadorRecibe: "Roberto García",
    nombreEntregaEnfermeria: "Jorge Daniel Campos Hernandez",
    ubicacion: "Lorem ipsum dolor sit amet",
    horario: "20:00",
    fechaResguardo: "25/01/2022",
    horaResguardo: "14:12:56",
    recibioResguardo: "Roberto García",
    entregoResguardo: "Erick Daniel Rodríguez Hernandez",
    fechaRecepcion: "25/01/2022",
    horaRecepcion: "14:12:56",
    recibioRecepcion: "Roberto García",
    entregoRececpion: "Erick Daniel Rodríguez Hernandez",
    ubicacionRecepcion: "",
    horarioRecepcion: "10:00 - 20:00"
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
      console.log(res.List);
      let valor=res.List[0];
      this.detalle=valor;
      
      console.log(valor)
      console.log(valor["enfermeriaNombreEntrega"])
    },(error:any)=>{
      console.log("fallo y no se porque")
      console.log(error);
    });
    
    
    
    

    
     
      

  }


  impirmiControlArticulos() {
    console.log("adads");
  }
}
