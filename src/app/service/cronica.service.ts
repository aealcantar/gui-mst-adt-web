import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AdmonPasswordRequest } from '../models/admon-password-request.model';
import { AdmonPasswordResponse } from '../models/admon-password-response.model';
import { Cronica } from '../models/cronica.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CronicaService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  addCronica(cronica: Cronica) {
    return this.http.post<AdmonPasswordResponse>(`${environment.urlServOauth}/api/saveCronica/`, cronica);
  }

}
