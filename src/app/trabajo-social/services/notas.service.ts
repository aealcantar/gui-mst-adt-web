import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Nota } from '../../models/notas.model';

const urlServNotas = `${environment.urlServNotas}/msmts-notas/api`

@Injectable({
  providedIn: 'root'
})

export class NotasService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getNotasByFechas(fechaInicial: string, fechaFinal: string) {
    return this.http.get<any>(`${urlServNotas}/findNotasByFechas/${fechaInicial}/${fechaFinal}`, { responseType: 'json'});
  }

  getNotasById(id: number) {
    return this.http.get<any>(`${urlServNotas}/getNotaTSById/${id}`, { responseType: 'json'});
  }

  addNota(nota: Nota) {
    return this.http.post<Nota>(`${urlServNotas}/guardaNuevaNota`, nota);
  }

  updateNota(nota: Nota) {
    return this.http.post<Nota>(`${urlServNotas}/actualizaNotaTs`, nota);
  }

  getTiposNota() {
    return this.http.get<any>(`${urlServNotas}/getTiposDeNota`, { responseType: 'json'});
  }

  getRedesApoyo() {
    return this.http.get<any>(`${urlServNotas}/getRedesSociales`, { responseType: 'json'});
  }

  getActividadesTecnicas() {
    return this.http.get<any>(`${urlServNotas}/getActividadesTecnicas`, { responseType: 'json'});
  }

  // getDiagnosticosMedicos(texto: string) {
  //   return this.http.get<any>(`${environment.urlServNotas}/registroNotasTs/getDiagnosticosMedicos/${texto}`, { responseType: 'json'});
  // }

  downloadPdf(data: any): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', responseType: 'blob' });
    return this.http.post<Blob>(`${urlServNotas}/reporteNotaTs`, JSON.stringify(data),
    { headers: headers, responseType: 'blob' as 'json'});
  }

}
