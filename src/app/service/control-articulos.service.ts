import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const urlServCatalogos = `${environment.msmtsCatalogos}`

@Injectable({
  providedIn: 'root'
})
export class ControlArticulosService {

  constructor(private httpsClient: HttpClient, private http: HttpClient,) { }

  getCatUbicaciones() {
    return this.httpsClient.get<any>(`${environment.urlMSEDSCatalogos}/listUbicacion`);
  }

  setControlArticulos(datos: any) {
    return this.httpsClient.post<any>(`${environment.msmtsControlArticulos}/insert`, datos);
  }

  getDetalleControlArticulos(datos: any) {
    return this.httpsClient.post<any>(`${environment.msmtsControlArticulos}/idCa`, datos);
  }

  getHorarios() {
    return this.httpsClient.get<any>(`${environment.msmtsControlArticulos}/horarios`);
  }

  downloadPdf(data: any): Observable<Blob> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.httpsClient.post<any>(`${environment.msmtsControlArticulos}/reporteCtrlArticulos`, JSON.stringify(data), { headers: headers, responseType: 'blob' as 'json' });
  }

  getArticulosByFechas(controlArticulos: any) {
    return this.httpsClient.post<any>(`${environment.msmtsControlArticulos}/rango/fechas`, controlArticulos);
  }

  obtenerInformacionTSPorMatricula(matricula: string) {
    return this.http.get<any>(`${urlServCatalogos}/api/getInfoTS/${matricula}`, { responseType: 'json' });
  }

  obtenerEstadoporUnidadMedica(unidadMedica: string){
    return this.http.get<any>(`${urlServCatalogos}/api/getUnidades/${unidadMedica}`, { responseType: 'json' });
  }

}
