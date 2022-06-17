import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  // headers: any = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(protected http: HttpClient) { }

  getAll(args: any) {
    return this.http.get<any>(`${environment.msmtsPacientes}`+args);
  }

}











