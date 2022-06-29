import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ControlArticulosService {

  constructor(private httpsClient: HttpClient) { }

  setControlArticulos(datos: any) {
    try {
      return this.httpsClient.post<any>(`${environment.msmtsControlArticulos}/insert`, datos);
    } catch (error) {      
      return error;
    }
  }

  getDetalleControlArticulos(datos: any) {
    try {
      return this.httpsClient.post<any>(`${environment.msmtsControlArticulos}/idCa`, datos);
    } catch (error) {     
      return error;
    }
  }
 



  getHorarios() {
    try {
      return this.httpsClient.get<any>(`${environment.msmtsControlArticulos}/horarios`);
    } catch (error) {
      return error;
    }

  }


  downloadPdf(data: any): Observable<Blob> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.httpsClient.post<any>(`${environment.msmtsControlArticulos}/reporte/reporteCtrlArticulos`, JSON.stringify(data), { headers: headers, responseType: 'blob' as 'json' });
  }

  getArticulosByFechas(controlArticulos: any) {
    try {
      return this.httpsClient.post<any>(`${environment.msmtsControlArticulos}/rango/fechas`, controlArticulos);
    } catch (error) {
      return error;
    }
  }

}
