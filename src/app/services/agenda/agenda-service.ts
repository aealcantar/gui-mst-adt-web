import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { HorarioResponse } from 'src/app/models/horario-response-model';
import { Turno } from 'src/app/models/turno-model';
import { TurnoResponse } from 'src/app/models/turno-response-model';
import { environment } from 'src/environments/environment';
import { HorarioRequest } from '../../models/horario-request.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private serverEndPointURLHorarios = `${environment.urlMSEDSCHorarios}`+`/api/`;
  constructor(private http: HttpClient) { }

  getLstTurnos(): Observable<TurnoResponse[]> {

    return this.http.get<TurnoResponse[]>(this.serverEndPointURLHorarios + `listTurnos/`, {

    }).pipe(
        catchError(this.handleError),
        map((response: TurnoResponse[]) => {
            return response;
        })
    );
}


private handleError(error: HttpErrorResponse) {
  console.log("Error", error.status);
  // Return an observable with a user-facing error message.
  return throwError(error);
}

}
