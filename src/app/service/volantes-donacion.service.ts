import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { VolantesDonacion } from '../models/volantes-donacion.model';  


@Injectable({
    providedIn: 'root',
  })
  export class VolantesDonacionService {
  
    constructor(private httpsClient: HttpClient) { }

    getVolantesByFechas(fechaInicial: string, fechaFinal: string) {
        return this.httpsClient.get<any>(`${environment.msmtsVolantesDonacion}/findVolantesByFechas/${fechaInicial}/${fechaFinal}`);
    }

    

    
    getBancosSangre( ) {
      try {
         return this.httpsClient.get<any>(`${environment.msmtsVolantesDonacion}/getBancosSangre`);
      } catch (error) { 
          return error;
        }
  }
    getDetatelleVolanteDonacion(idVolanteDonacion:String){
      try {
        return this.httpsClient.get<any>(`${environment.msmtsVolantesDonacion}/findVolantesById/${idVolanteDonacion}`);
     } catch (error) { 
         return error;
       }
    }

    addVolante(datos: any) {
        try {
            return this.httpsClient.post<VolantesDonacion>(`${environment.msmtsVolantesDonacion}/guardaNuevoVolanteDonacionSangre`, datos);
        } catch (error) {
        
            return error;
          }
    }


    downloadPdf(data: any): Observable<Blob> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
      return this.httpsClient.post<any>(`${environment.msmtsVolantesDonacion}/reporteDonacionSangre`, JSON.stringify(data), { headers: headers, responseType: 'blob' as 'json' });
    }

}

