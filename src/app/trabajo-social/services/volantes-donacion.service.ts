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
        try {
           return this.httpsClient.get<any>(`${environment.urlVolantesDonacion}/findVolantesByFechas/${fechaInicial}/${fechaFinal}`);
        } catch (error) { 
            return error;
          }
    }

    

    
    getBancosSangre( ) {
      try {
         return this.httpsClient.get<any>(`${environment.urlVolantesDonacion}/getBancosSangre`);
      } catch (error) { 
          return error;
        }
  }
    getDetatelleVolanteDonacion(idVolanteDonacion:String){
      try {
        return this.httpsClient.get<any>(`${environment.urlVolantesDonacion}/findVolantesById/${idVolanteDonacion}`);
     } catch (error) { 
         return error;
       }
    }

    addVolante(datos: any) {
        try {
            return this.httpsClient.post<VolantesDonacion>(`${environment.urlVolantesDonacion}/guardaNuevoVolanteDonacionSangre`, datos);
        } catch (error) {
        
            return error;
          }
    }


    downloadPdf(data: any): Observable<Blob> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
      return this.httpsClient.post<any>(`${environment.urlVolantesDonacion}/reporteDonacionSangre`, JSON.stringify(data), { headers: headers, responseType: 'blob' as 'json' });
    }

}

