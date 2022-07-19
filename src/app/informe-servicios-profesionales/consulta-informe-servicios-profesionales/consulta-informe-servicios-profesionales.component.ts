// TODO: Eliminar datos prueba
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { AlertInfo } from "src/app/app-alerts/app-alert.interface";
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

    // getters
    get fecha(): AbstractControl {
        return this.formularioBusqueda.get('fecha')
    }

    get lugar(): AbstractControl {
        return this.formularioBusqueda.get('lugar')
    }

    get responsable(): AbstractControl {
        return this.formularioBusqueda.get('responsable')
    }

    get servicio(): AbstractControl {
        return this.formularioBusqueda.get('servicio')
    }

    get turno(): AbstractControl {
        return this.formularioBusqueda.get('turno')
    }

    constructor() { }

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
    }

    ngAfterViewInit(): void {
        this.actualizarFecha();
    }

    actualizarFecha(): void {
        $('#calendar').datepicker({
            dateFormat: 'dd/mm/yy',
            onSelect: (date: any) => {
                if (date == '') return
                date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
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
