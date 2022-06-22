import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
 

@Injectable({
  providedIn: 'root'
})
export class ControlArticulosService {

  constructor(private httpsCliente:HttpClient) { }

  
  setControlArticulos(datos:any){
 
    try {
      return this.httpsCliente.post<any>(`${environment.urlServEstudioMedicos}/msmts-ctrl-articulos/api/insert`,datos);
     
    } catch (error) {
      console.log("error")
      return error;
    }

  }

  getDetalleControlArticulos(datos:any){
    
    try {
      return this.httpsCliente.post<any>(`${environment.urlServEstudioMedicos}/msmts-ctrl-articulos/api/idCa`,datos);
     
    } catch (error) {
      console.log("error")
      return error;
    }

  }

  
  getHorarios(){
    
    try {
      return this.httpsCliente.get<any>(`${environment.urlServEstudioMedicos}/msmts-ctrl-articulos/api/horarios`);
     
    } catch (error) {
      console.log("error")
      return error;
    }

  }


}
