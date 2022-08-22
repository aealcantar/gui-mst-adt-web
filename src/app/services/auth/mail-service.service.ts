import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MailResponse } from '../../models/mail-response.model';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient) { }

  recuperarPassword(correo: string) {
    return this.http.get<MailResponse>(`${environment.msmtsOauth}/recuperarPassword/${correo}/`);
  }
}
