import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Cronica } from 'src/app/models/cronica.model'
import { MatDialog } from '@angular/material/dialog'
import { AgregarParticipanteDialogComponent } from '../../nueva-cronica/agregar-participante-dialog/agregar-participante-dialog.component'
import { Subscription, timer } from 'rxjs'
import { map, share } from 'rxjs/operators'
import { Participante } from 'src/app/models/participante.model'
import { CronicaGrupalService } from 'src/app/service/cronica-grupal.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

declare var $: any
const NUM_PARTICIPANTES: number = 5

@Component({
  selector: 'app-nueva-cronica-desde-cero',
  templateUrl: './nueva-cronica-desde-cero.component.html',
  styleUrls: ['./nueva-cronica-desde-cero.component.css'],
})
export class NuevaCronicaDesdeCeroComponent implements OnInit {
  public listParticipantes: Participante[] = []
  public cronica!: Cronica
  public cronicaRecibida: any
  public editForm!: FormGroup
  public grupos: any[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cronicaGrupalService: CronicaGrupalService,
    private modalService: NgbModal,
  ) {}

  // initForm(cronicaParse: any): void {
  // }

  ngOnInit(): void {
    let cronicaParse
    this.route.queryParamMap.subscribe((params: any) => {
      cronicaParse = params.getAll('cronica')
      if (cronicaParse.length > 0) {
        this.cronicaRecibida = JSON.parse(params.getAll('cronica'))
        console.log('OBJETO RECIBIDO: ', this.cronicaRecibida)
        if (this.cronicaRecibida.participanteList.length > 0) {
          this.listParticipantes = this.cronicaRecibida.participanteList
        }
      } else {
        this.cronicaRecibida = null
      }
    })
    // this.initForm(cronicaParse)
  }

  cancelarModal() {
    $('#content').modal('hide')
  }

  salirModal() {
    this.router.navigateByUrl('/consulta-cronica-grupal')
    $('#content').modal('hide')
  }

  modalcarga(content: any) {
    $('#content').modal({
      keyboard: false,
      backdrop: 'static',
    })
    $('#content').modal('show')
  }

  ngAfterViewInit(): void {
    $('#calendarCronica').datepicker({
      onSelect: (date: any, datepicker: any) => {
        if (date != '') {
          this.editForm.controls['fecha'].setValue(date)
          console.log('date onSelect: ', date)
        }
      },
    })
  }

  addParticipanteDialog() {
    const dialogRef = this.dialog.open(AgregarParticipanteDialogComponent, {
      width: '1170px',
      height: 'auto',
      maxWidth: '1170px',
      position: { top: `100px` },
      panelClass: 'dialog-styles',
      data: '',
    })
    dialogRef.afterClosed().subscribe((participantes: Participante[]) => {
      if (participantes && participantes.length > 0) {
        this.listParticipantes = participantes
        this.editForm
          .get('numParticipantesAsistieron')
          ?.patchValue(NUM_PARTICIPANTES + this.listParticipantes.length)
      }
    })
  }

  guardarCronica() {
    this.router.navigateByUrl('/detalle-cronica-cero')
  }
}
