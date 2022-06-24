import { Component, OnInit,Input } from '@angular/core';
import { alertInfo } from './app-alert.interface';

@Component({
  selector: 'app-app-alerts',
  templateUrl: './app-alerts.component.html',
  styleUrls: ['./app-alerts.component.css']
})
export class AppAlertsComponent implements OnInit {
  @Input() alert!: alertInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
