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
      return this.httpsClient.post<any>(`${environment.urlControlArticulos}/msmts-ctrl-articulos/api/insert`, datos);

    } catch (error) {
      console.log("error")
      return error;
    }

  }

  getDetalleControlArticulos(datos: any) {

    try {
      return this.httpsClient.post<any>(`${environment.urlControlArticulos}/msmts-ctrl-articulos/api/idCa`, datos);

    } catch (error) {
      console.log("error")
      return error;
    }

  }




  getHorarios() {

    try {
      return this.httpsClient.get<any>(`${environment.urlControlArticulos}/msmts-ctrl-articulos/api/horarios`);

    } catch (error) {
      console.log("error")
      return error;
    }

  }


  downloadPdf(data: any): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', responseType: 'blob' });
    return this.httpsClient.post<Blob>('http://localhost:8088/reporte/reporteCtrlArticulos', JSON.stringify(data),
    { headers: headers, responseType: 'blob' as 'json'});
  }

}
