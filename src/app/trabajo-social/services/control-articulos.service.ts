import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
 

@Injectable({
  providedIn: 'root'
})
export class ControlArticulosService {

  constructor(private httpsCliente:HttpClient) { }

  getDetalleControlArticulos(datos:any){
    console.log("dasd",datos)
    try {
      return this.httpsCliente.post<any>(`${environment.urlServEstudioMedicos}/msmts-ctrl-articulos/api/idCa`,datos);
     
    } catch (error) {
      console.log("error")
      return error;
    }

  }

}
