import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertInfo } from 'src/app/shared-modules/models/alerta.interface';

@Component({
  selector: 'app-detalle-volantes-donacion-sangre',
  templateUrl: './detalle-volantes-donacion-sangre.component.html',
  styleUrls: ['./detalle-volantes-donacion-sangre.component.css']
})
export class DetalleVolantesDonacionSangreComponent implements OnInit {
  detalle: any = {};
  alert!: AlertInfo;
  constructor(   private rutaActiva: ActivatedRoute,  private route: ActivatedRoute,) { }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe((params: any) => {

    let valida= this.rutaActiva.snapshot.paramMap.get('proviene');
    console.log(valida)
    if(valida!=null){
      this.muestraAlerta(
        '¡La información se guardo con éxito!',
        'alert-success',
        ''
      );
    }


      if (params.getAll('volanteDonacion').length > 0) {
        this.detalle = JSON.parse(params.getAll('volanteDonacion'))
        
      }
      console.log('OBJETO ENVIADO PARA DETALLE: ', this.detalle)
    })
  }


  //muesta el mensaje de alerta
  muestraAlerta(mensaje: string, estilo: string, tipoMsj?: string, funxion?: any) {
    this.alert = new AlertInfo;
    this.alert = {

      message: mensaje,
      type: estilo,
      visible: true,
      typeMsg: tipoMsj
    };
    setTimeout(() => {
      this.alert = {
        message: '',
        type: 'custom',
        visible: false,
      };
      if (funxion != null) {
        funxion();
      }
    }, 5000);
  }


  impirmiVolante(){
    console.log("immpiads")
  }


}
