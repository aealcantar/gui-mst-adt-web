import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cronica } from 'src/app/models/cronica.model';
import { MatDialog } from '@angular/material/dialog';
import { AgregarParticipanteDialogComponent } from '../../nueva-cronica/agregar-participante-dialog/agregar-participante-dialog.component';
import { Subscription, timer } from "rxjs";
import { map, share } from "rxjs/operators";
import { Participante } from 'src/app/models/participante.model';
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;
const NUM_PARTICIPANTES: number = 5;

@Component({
  selector: 'app-nueva-cronica-desde-cero',
  templateUrl: './nueva-cronica-desde-cero.component.html',
  styleUrls: ['./nueva-cronica-desde-cero.component.css'],
})
export class NuevaCronicaDesdeCeroComponent implements OnInit, AfterViewInit {
  public listParticipantes: Participante[] = [];
  public cronica!: Cronica;
  public editForm!: FormGroup;
  public grupos: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cronicaGrupalService: CronicaGrupalService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    $('#calendarCronica').datepicker({
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.editForm.controls['fecha'].setValue(date);
        }
      }
    });
  }

  initForm(): void {
    this.editForm = this.fb.group({
      grupo: ["", Validators.required],
      fecha: [null, Validators.required],
      hora: ["", Validators.required],
      descPonentes: [null, Validators.required],
      numParticipantesAsistieron: [null, Validators.required],
      desTecnicaDidactica: [null, Validators.required],
      desMaterialApoyo: [null, Validators.required],
      desModalidad: [null, Validators.required],
      desOcasionServicio: [null, Validators.required],
      desObjetivosSesion: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      desDesarrolloSesion: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      desPerfilGrupo: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
      desObservaciones: [null, Validators.compose([Validators.required, Validators.maxLength(500)])],
    });
    this.cronicaGrupalService.getCatGrupo('15').toPromise().then(
      (grupos) => {
        this.grupos = grupos;
      },
      (httpErrorResponse: HttpErrorResponse) => {
        console.error(httpErrorResponse);
      }
    );

    this.getNumParticipantes();
  }

  getNumParticipantes() {
    // TO DO Implementar servicio para obtener Numero de Participantes 
    // this.cronicaGrupalService.getNumParticipantes(idCita).subscribe((resp: any) => {
    //     if (resp) {
    //       this.editForm.get('numParticipantesAsistieron')?.patchValue(resp.numParticipantes || 0);
    //     }
    //   },
    //   (httpErrorResponse: HttpErrorResponse) => {
    //     console.error(httpErrorResponse);
    //   }
    // );
    this.editForm.get('numParticipantesAsistieron')?.patchValue(NUM_PARTICIPANTES + this.listParticipantes.length);
  }

  addParticipanteDialog() {
    const dialogRef = this.dialog.open(AgregarParticipanteDialogComponent, {
      width: '1170px',
      height: 'auto',
      maxWidth: '1170px',
      position: { top: `100px` },
      panelClass: 'dialog-styles',
      data: '',
    });

    dialogRef.afterClosed().subscribe((participantes: Participante[]) => {
      if (participantes && participantes.length > 0) {
        this.listParticipantes = participantes;
        this.editForm.get('numParticipantesAsistieron')?.patchValue(NUM_PARTICIPANTES + this.listParticipantes.length);
      }
    });
  }

  modalcarga(content: any) {
    //this.modalService.open(content, {centered: true,size: 'lg', backdrop: 'static', keyboard: false})
    $('#content').modal({
      keyboard: false,
      backdrop: 'static'
    })
    $('#content').modal('show');
  }

  cancelarModal() {
    $('#content').modal('hide');
  }

  salirModal() {
    this.router.navigateByUrl("/consulta-cronica-grupal");
    $('#content').modal('hide');
  }

  getNombreGrupo(cveGrupo: number | string) {
    let idGrupoConverted: number;
    if (typeof cveGrupo === 'string') {
      idGrupoConverted = Number(cveGrupo);
    } else if (typeof cveGrupo === 'number') {
      idGrupoConverted = cveGrupo;
    }
    return this.grupos.find(g => g.cve_grupo_programa === cveGrupo)?.des_grupo_programa;
  }

  guardarCronica() {
    this.cronica = {
      id: null,
      idCalendarioAnual: null,
      idEspecialidad: 'CS01',
      desEspecialidad: null,
      idTurno: 1,
      desTurno: null,
      idGrupo: this.editForm.get('grupo')!.value,
      desGrupo: this.getNombreGrupo(this.editForm.get('grupo')!.value),
      idUbicacion: '9',
      desUbicacion: null,
      fecFechaCorta: this.editForm.get('fecha')!.value,
      fecFechaCompleta: null,
      timHora: '10:00:00',
      desModalidad: null,
      numTotalParticipantes: this.editForm.get('numParticipantesAsistieron')!.value,
      numParticipantesAsistieron: this.editForm.get('numParticipantesAsistieron')!.value,
      idEstatusCronica: 1,
      desEstatusCronica: null,
      descPonentes: this.editForm.get('descPonentes')!.value,
      desTecnicaDidactica: this.editForm.get('desTecnicaDidactica')!.value,
      desMaterialApoyo: this.editForm.get('desMaterialApoyo')!.value,
      desObjetivosSesion: this.editForm.get('desObjetivosSesion')!.value,
      desDesarrolloSesion: this.editForm.get('desDesarrolloSesion')!.value,
      desPerfilGrupo: this.editForm.get('desPerfilGrupo')!.value,
      desObservaciones: this.editForm.get('desObservaciones')!.value
    }

    this.editForm.markAllAsTouched();
    if (this.editForm.valid) {
      this.cronica = {
        ...this.cronica,
        ...this.editForm.value,
        participanteList: this.listParticipantes
      };
      // let params = {
      //   'cronica': JSON.stringify(this.cronica),
      // }
      this.cronicaGrupalService.addCronica(this.cronica).subscribe(
        (response: any) => {
        }, (response: HttpErrorResponse) => {
          if (response.statusText === 'OK') {
            // this.router.navigate(["cronicaGuardada"], { queryParams: params, skipLocationChange: true });
            this.router.navigateByUrl('/detalle-cronica-cero');
          }
        }
      );
    }
  }

  cancelar() {
    this.router.navigateByUrl("/consulta-cronica-grupal");
  }

}