import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AvisoMP } from '../models/aviso-mp.model';


@Injectable({
  providedIn: 'root'
})
export class AvisoMinisterioPublicoService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  agregarAvisoMP(aviso: AvisoMP) {
    return this.http.post(`${environment.msmtsAvisosMP}/insertAvisoMP`, aviso);
  }

  getAvisoById(idAviso: number) {
    return this.http.get<any>(`${environment.msmtsAvisosMP}/findAvisoById/${idAviso}`);
  }

  getAvisosByFechas(fechaInicial: string, fechaFinal: string) {
    return this.http.get<any>(`${environment.msmtsAvisosMP}/findAvisosMpByFechas/${fechaInicial}/${fechaFinal}`);
  }

  getCatUnidadesMedicas() {
    return this.http.get<any>(`${environment.msmtsCatalogos}/api/lisUnidades`);
  }

  downloadPdf(data: any): Observable<Blob> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${environment.msmtsAvisosMP}/reporteAvisoMP`, JSON.stringify(data), {responseType : 'blob'});
  }

}
