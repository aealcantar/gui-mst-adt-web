import { Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotasService } from '../service/notas.service';
import { CronicaGrupalService } from '../service/cronica-grupal.service';
import { Nota } from '../models/notas.model';
import * as moment from 'moment';
import { AppTarjetaPresentacionService } from '../app-tarjeta-presentacion/app-tarjeta-presentacion.service';
import { pacienteSeleccionado } from '../busqueda-nss/paciente.interface';
declare var $: any;

@Component({
  selector: 'app-nueva-nota-tsocial',
  templateUrl: './nueva-nota-tsocial.component.html',
  styleUrls: ['./nueva-nota-tsocial.component.css'],
})
export class NuevaNotaTSocialComponent implements OnInit {
  camposCompletos: boolean = true

  alertMensaje: string = ''
  alertVisible: boolean = false
  alertTipo: string = ''
  nota!: Nota;

  formNuevaNota: any = this.formBuilder.group({
    idTipoNota: [-1, Validators.required],
    idRedApoyo: [-1, Validators.required],
    idActividadTecnica: [-1, Validators.required],
    diagnosticoMedico: [null, Validators.required],
    redaccion: ['', Validators.required],
    diagnostico: ['', Validators.required],
  });

  paciente!: pacienteSeleccionado;
  catTiposNotas: any[] = [];
  catRedesApoyo: any[] = [];
  catActividadesTecnicas: any[] = [];
  catDiagnosticosMedicos: any[] = [];
  filteredOptions!: Observable<any[]>;
  filterControl = new FormControl('');

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private notasService: NotasService,
    private catServices: CronicaGrupalService,
    private tarjetaServce: AppTarjetaPresentacionService,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.getAll('nota').length > 0) {
        this.nota = JSON.parse(params.getAll('nota'))
      }
    });

    this.getCatalogos();
    this.paciente = this.tarjetaServce.get();
    this.filteredOptions = this.filterControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(typeof value === 'object' ? value?.nombre : value))
    );
  }

  getCatalogos() {
    this.notasService.getTiposNota().subscribe(
      (res) => {
        this.catTiposNotas = res.ArrayList;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );

    this.notasService.getRedesApoyo().subscribe(
      (res) => {
        if (res) {
          this.catRedesApoyo = res.ArrayList;
        }
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );

    this.notasService.getActividadesTecnicas().subscribe(
      (res) => {
        if (res) {
          this.catActividadesTecnicas = res.ArrayList;
        }
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );

    if (this.nota?.id) {
      this.updateForm()
    }
  }

  updateForm() {
    this.formNuevaNota.patchValue({
      ...this.nota,
      diagnosticoMedico: { id: this.nota.idDiagnosticoMedico, nDiagnosticoMedicoCie: this.nota.nombreDiagnostico }
    });
    console.log(this.formNuevaNota.value);

  }

  handleChangeDiagnostico() {
    let value = this.formNuevaNota.get('diagnosticoMedico').value;
    // TO DO Remover validacion Cuando se ajuste servicio para enviar cadena vacia (devolver todo)
    if (typeof value === 'string' && value !== '') {
      this.catServices.getCatDiagnosticosMedicos(value).subscribe(
        (res) => {
          if (res) {
            this.catDiagnosticosMedicos = res;
            this.filterControl.patchValue(value);
          }
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse);
        }
      );
    }
  }

  onSelectionChanged(evt: any) {
    this.filterControl.patchValue(this.formNuevaNota.get('diagnosticoMedico').value);
  }

  muestraAlerta(mensaje: string, estilo: string, funxion: any) {
    this.alertMensaje = mensaje
    this.alertTipo = estilo
    this.alertVisible = true

    setTimeout(() => {
      this.alertMensaje = mensaje
      this.alertTipo = estilo
      this.alertVisible = false

      if (funxion != null) {
        funxion()
      }
    }, 5000)
  }

  modalcarga(content: any) {
    //this.modalService.open(content, {centered: true,size: 'lg', backdrop: 'static', keyboard: false})
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    $('#content').modal('show');
  }

  cancelar() {
    $('#content').modal('hide');
  }

  salirModal() {
    this.router.navigateByUrl("/consulta-notas", { skipLocationChange: true });
    $('#content').modal('hide');
  }

  guardar() {
    console.log(this.formNuevaNota.value);

    let { descripcion: nombreTipoNota } = this.catTiposNotas.find((item: any) => item.id === parseInt(this.formNuevaNota.get('idTipoNota').value));
    let { descripcion: nombreRedApoyo } = this.catRedesApoyo.find((item: any) => item.id === parseInt(this.formNuevaNota.get('idRedApoyo').value));
    let { descripcion: nombreActividadTecnica } = this.catActividadesTecnicas.find((item: any) => item.id === parseInt(this.formNuevaNota.get('idActividadTecnica').value));

    let notaToSave: Nota = {
      fecFecha: moment().format('YYYY/MM/DD'),
      timHora: moment().format('HH:mm:ss'),
      numNss: String(this.paciente.nss),
      idActividadTecnica: parseInt(this.formNuevaNota.get('idActividadTecnica').value),
      idRedApoyo: parseInt(this.formNuevaNota.get('idRedApoyo').value),
      idTipoNota: parseInt(this.formNuevaNota.get('idTipoNota').value),
      nombreTipoNota,
      nombreRedApoyo,
      nombreActividadTecnica,
      idDiagnosticoMedico: parseInt(this.formNuevaNota.get('diagnosticoMedico').value?.id),
      nombreDiagnostico: this.formNuevaNota.get('diagnosticoMedico').value?.nDiagnosticoMedicoCie,
      redaccion: this.formNuevaNota.get('redaccion').value,
      diagnostico: this.formNuevaNota.get('diagnostico').value
    };

    if (this.nota?.id) {
      notaToSave.id = this.nota.id;
      let params = { 'nota': JSON.stringify(notaToSave) };

      this.notasService.updateNota(notaToSave).subscribe(
        (response: any) => {
          console.log(response);
        }, (resp: HttpErrorResponse) => {
          if (resp.statusText === 'OK') {
            this.router.navigate(["detalle-nota"], { queryParams: params, skipLocationChange: true });
          }
        }
      );
    } else {
      this.notasService.addNota(notaToSave).subscribe(
        (response: any) => {
          if (response && response?.idNuevaNotaTS) {
            notaToSave.id = response?.idNuevaNotaTS;
            let params = { 'nota': JSON.stringify(notaToSave) };
            this.router.navigate(["detalle-nota"], { queryParams: params, skipLocationChange: true });
          }
        }, (resp: HttpErrorResponse) => {
          console.log(resp);
        }
      );
    }
  }

  // this.muestraAlerta(
  //   '¡La información se guardó con exito!',
  //   'alert-danger',
  //   null,
  // );
  // setTimeout(() => {
  //   this.router.navigate(["consulta-nota"], { skipLocationChange: true });
  // }, 2000);

  // irConsultaNota() {
  //   let params = {
  //     'objetoAEnviar': null,
  //   }
  //   this.router.navigate(["consulta-nota"], { queryParams: params, skipLocationChange: true });
  // }

  private _filter(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.catDiagnosticosMedicos.filter(option => option?.nDiagnosticoMedicoCie.toLowerCase().includes(filterValue));
  }

  public getOptionText(option: any) {
    return option ? option.nDiagnosticoMedicoCie : null;
  }

}
