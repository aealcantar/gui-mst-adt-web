import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Nota } from 'src/app/shared-modules/models/notas.model';

//configuración de url modificar cuando haya endpoint
const urlServArticulo = `${environment.urlServNotas}/api`

@Injectable({
  providedIn: 'root'
})

export class ControlArticuloService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getArticulosByFechas(fechaInicial: string, fechaFinal: string) {
    return this.http.get<any>(`${urlServArticulo}/findNotasByFechas/${fechaInicial}/${fechaFinal}`, { responseType: 'json'});
  }

  getArticuloById(id: number){
    return this.http.get<any>(`${urlServArticulo}/getNotaTSById/${id}`, { responseType: 'json'});
  }

  addArticulo(nota: Nota) {
    return this.http.post<Nota>(`${urlServArticulo}/guardaNuevaNota`, nota);
  }

  updateArticulo(nota: Nota) {
    return this.http.post<Nota>(`${urlServArticulo}/actualizaNotaTs`, nota);
  }


}