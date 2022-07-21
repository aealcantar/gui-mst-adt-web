// TODO: Eliminar datos prueba
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { AlertInfo } from "src/app/app-alerts/app-alert.interface";
import { InformeServiciosProfesionalesService } from "src/app/service/informe-servicios-profesionales.service";
declare var $: any;

@Component({
    selector: 'app-consulta-informe-servicios-profesionales',
    templateUrl: './consulta-informe-servicios-profesionales.component.html',
    styleUrls: ['./consulta-informe-servicios-profesionales.component.css']
})
export class ConsultaInformeServiciosProfesionalesComponent implements OnInit {

    public alert!: AlertInfo;

    // catalogos
    grupos: any[] = [];
    lugares: any[] = [];
    responsables: any[] = [];
    serviciosEspecialidad: any[] = [];
    turnos: any[] = [];
    // tabla
    dtOptions: DataTables.Settings = {};
    // paginado
    page: number = 1;
    pageSize: number = 15;
    // datos
    datosBusqueda: Array<any> = [];

    order: string = 'desc';
    columnaId: string = 'fecha';


    // Formulario
    formularioBusqueda = new FormGroup({
        fecha: new FormControl('', Validators.required),
        lugar: new FormControl('', Validators.required),
        responsable: new FormControl('', Validators.required),
        servicio: new FormControl('', Validators.required),
        turno: new FormControl('', Validators.required),
    })

    // Datos prueba
    public datosPrueba = [
        {
            "numero": "12345",
            "paciente": "Miguel Sanchez",
            "horaCita": "10:00:00",
            "agregadoMedico": "Nataly",
            "primeraVez": "true",
            "citado": "11",
        },
        {
            "numero": "67890",
            "paciente": "Angel Hernandez",
            "horaCita": "10:00:00",
            "agregadoMedico": "Nataly",
            "primeraVez": "true",
            "citado": "12",
        }
    ];

    // observers
    lugaresObserver = {
        next: (response: any) => console.log(response),
        error: (error: HttpErrorResponse) => console.log(error),
        finally: () => console.log('end')
    }
    serviciosObserver = {
        next: (servicios: any) => this.serviciosEspecialidad = servicios,
        error: (error: HttpErrorResponse) => console.log(error),
        finally: () => console.log('end')
    }
    turnosObserver = {
        next: (turnos: any) => this.turnos = turnos,
        error: (error: HttpErrorResponse) => console.log(error),
        finally: () => console.log('end')
    }

    constructor(private informeServProfService: InformeServiciosProfesionalesService) { }

    ngOnInit(): void {
        this.dtOptions = {
            order: [[2, 'desc']],
            ordering: false,
            paging: false,
            processing: false,
            info: false,
            searching: false,
        };
        // this.datosBusqueda = this.datosPrueba
        this.cargarCatalogos();
    }

    ngAfterViewInit(): void {
        this.actualizarFecha();
    }

    actualizarFecha(): void {
        $('#calendar').datepicker({
            dateFormat: 'dd/mm/yy',
            onSelect: (date: any) => {
                if (date == '') return
                // date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
                this.formularioBusqueda.get('fecha')?.patchValue(date)
            },
            onClose: (date: any) => {
                if (date) return
                this.formularioBusqueda.get('fecha')?.patchValue('')
            }
        })
    }

    asignarValoresDefault(): void {
        this.formularioBusqueda = new FormGroup({
            fecha: new FormControl('', Validators.required),
            lugar: new FormControl('', Validators.required),
            responsable: new FormControl('', Validators.required),
            servicio: new FormControl('', Validators.required),
            turno: new FormControl('', Validators.required),
        })
    }

    limpiar(): void {
        this.asignarValoresDefault()
        this.formularioBusqueda.reset(this.formularioBusqueda.value);
    }

    buscar(): void {
        this.validarCamposObligatorios();
        console.log(this.formularioBusqueda.value)
        this.revisarCamposVacios();
    }

    sortBy(columnaId: string, order: string, type: string): void {
    }

    irDetalle(informeServicios: any): void {

    }

    cargarCatalogos(): void {
        this.informeServProfService.getCatTurnos().subscribe(this.turnosObserver);
        this.informeServProfService.getCatServicios().subscribe(this.serviciosObserver);
        // this.informeServProfService.getCatLugar().subscribe(this.lugaresObserver);
    }

    validarCamposObligatorios(): void {
        const campos = Object.keys(this.formularioBusqueda.controls);
        campos.forEach(campo => {
            const control = this.formularioBusqueda.get(campo);
            control.markAsTouched({ onlySelf: true });
        });
    }

    revisarCamposVacios(): void {

    }
}
