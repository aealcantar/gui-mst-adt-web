import { Component, OnInit } from "@angular/core";
import { AlertInfo } from "src/app/app-alerts/app-alert.interface";

@Component({
    selector: 'app-detalle-informe-servicios-profesionales',
    templateUrl: './detalle-informe-servicios-profesionales.component.html',
    styleUrls: ['./detalle-informe-servicios-profesionales.component.css']
})
export class DetalleInformeServiciosProfesionalesComponent implements OnInit {

    public alert!: AlertInfo;

    constructor() { }

    ngOnInit() { }
}
