import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { HorarioDias, HorarioNuevoRequest } from 'src/app/models/horario-dias.model';
import { HorarioResponse } from 'src/app/models/horario-response-model';
import { Horario } from 'src/app/models/horario.model';
import { environment } from 'src/environments/environment';
import { HorarioRequest, NuevoHorarioRequest } from '../../models/horario-request.model';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private serverEndPointURLHorarios = `${environment.urlMSEDSCHorarios}`+`/horario/`;
  constructor(private http: HttpClient) { }

  getHorariosByDia(dia:string): Observable<HorarioResponse> {

    return this.http.get<HorarioResponse>(this.serverEndPointURLHorarios + `getAllAndFilters/${dia}/`, {

    }).pipe(
        catchError(this.handleError),
        map((response: HorarioResponse) => {
            return response;
        })
    );
}

modificarEstatusDia(request: HorarioRequest):Observable<HttpResponse<HorarioResponse>> {
  return this.http.post<HorarioResponse>(`${this.serverEndPointURLHorarios}` + `updateEstatusDia`, request, { observe: 'response' });

}

saveLstHorarios(lstHorarioBean: HorarioNuevoRequest):Observable<HttpResponse<HorarioResponse>> {
  return this.http.post<any>(`${this.serverEndPointURLHorarios}` + `saveListHorarios`, lstHorarioBean, { observe: 'response' });

}

save(request: Horario):Observable<HttpResponse<HorarioResponse>> {
  return this.http.post<HorarioResponse>(`${this.serverEndPointURLHorarios}` + `save`, request, { observe: 'response' });

}

private handleError(error: HttpErrorResponse) {
  console.log("Error", error.status);
  // Return an observable with a user-facing error message.
  return throwError(error);
}

}
