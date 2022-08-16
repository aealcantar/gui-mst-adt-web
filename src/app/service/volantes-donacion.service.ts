import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'
import { VolantesDonacion } from '../models/volantes-donacion.model'

@Injectable({
  providedIn: 'root',
})
export class VolantesDonacionService {
  constructor(private httpsClient: HttpClient) {}

  getVolantesByFechas(datosBusqueda: any) {
  // getVolantesByFechas(fechaInicial: string, fechaFinal: string) {
    // return this.httpsClient.get<any>(`${environment.msmtsVolantesDonacion}/findVolantesByFechas/${fechaInicial}/${fechaFinal}`,
    return this.httpsClient.post<any>(`${environment.msmtsVolantesDonacion}/findVolantesByFechas`, datosBusqueda);
  }

  getBancosSangre() {
    return this.httpsClient.get<any>(
      `${environment.msmtsVolantesDonacion}/getBancosSangre`,
    )
  }
  getDetatelleVolanteDonacion(idVolanteDonacion: String) {
    return this.httpsClient.get<any>(
      `${environment.msmtsVolantesDonacion}/findVolantesById/${idVolanteDonacion}`,
    )
  }

  addVolante(datos: any) {
    return this.httpsClient.post<VolantesDonacion>(
      `${environment.msmtsVolantesDonacion}/guardaNuevoVolanteDonacionSangre`,
      datos,
    )
  }

  downloadPdf(data: any): Observable<Blob> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })
    return this.httpsClient.post<any>(
      `${environment.msmtsVolantesDonacion}/reporteDonacionSangre`,
      JSON.stringify(data),
      { headers: headers, responseType: 'blob' as 'json' },
    )
  }

  getVolantesAdministracion(fechaInicial: string, fechaFinal: string, tipoSangre: string) {
    return this.httpsClient.get<any>(`${environment.msmtsVolantesDonacion}/findVolantesAdministracion/${fechaInicial}/${fechaFinal}/${tipoSangre}`);
  }
}
