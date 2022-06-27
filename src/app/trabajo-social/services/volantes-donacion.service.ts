import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { VolantesDonacion } from 'src/app/trabajo-social/models/volantes-donacion.model';


@Injectable({
    providedIn: 'root',
  })
  export class VolantesDonacionService {
  
    constructor(private httpsClient: HttpClient) { }

    getVolantesByFechas(fechaInicial: string, fechaFinal: string) {
        return this.httpsClient.get<VolantesDonacion[]>(`${environment.urlVolantesDonacion}/msmts-donacion-sangre/api/findVolantesByFechas/${fechaInicial}/${fechaFinal}`, { responseType: 'json'});
    }

    addVolante(volantesDonacion: VolantesDonacion) {
        return this.httpsClient.post<VolantesDonacion>(`${environment.urlVolantesDonacion}/msmts-donacion-sangre/api/guardaNuevoVolanteDonacionSangre`, volantesDonacion);
    }

}

