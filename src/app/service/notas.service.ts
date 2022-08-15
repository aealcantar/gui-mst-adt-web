import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Nota } from '../models/notas.model';

const urlServNotas = `${environment.msmtsNotas}`

@Injectable({
  providedIn: 'root'
})

export class NotasService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getNotasByFechas(paciente: any) {
    // const params = new HttpParams()
    //   .set('fechaIni', paciente.fechaIni)
    //   .set('fechaFin', paciente.fechaFin)
    //   .set('nssPaciente', paciente.nssPaciente)
    //   .set('nombrePaciente', paciente.nombrePaciente)
    //   .set('agregadoMedico', paciente.agregadoMedico);
    // return this.http.post<any>(`${urlServNotas}/findNotasByFechas`, { responseType: 'json', params: params });
    return this.http.post<any>(`${urlServNotas}/findNotasByFechas`, paciente);
  }

  getNotasById(id: number) {
    return this.http.get<any>(`${urlServNotas}/getNotaTSById/${id}`, { responseType: 'json' });
  }

  addNota(nota: Nota) {
    return this.http.post<Nota>(`${urlServNotas}/guardaNuevaNota`, nota);
  }

  updateNota(nota: Nota) {
    return this.http.post<Nota>(`${urlServNotas}/actualizaNotaTs`, nota);
  }

  getTiposNota() {
    return this.http.get<any>(`${urlServNotas}/getTiposDeNota`, { responseType: 'json' });
  }

  getRedesApoyo() {
    return this.http.get<any>(`${urlServNotas}/getRedesSociales`, { responseType: 'json' });
  }

  getActividadesTecnicas() {
    return this.http.get<any>(`${urlServNotas}/getActividadesTecnicas`, { responseType: 'json' });
  }

  downloadPdf(data: any): Observable<Blob> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post<any>(`${urlServNotas}/reporteNotaTs`, JSON.stringify(data), { headers: headers, responseType: 'blob' as 'json' });
  }

}
