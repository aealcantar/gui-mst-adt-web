export class CitaResponse {
    cita: Cita;
    participantes: ParticipanteCita[];
    constructor() { }
}

export class Cita {
    cveCita: number;
    cveCalendarioAnual: number;
    nss: string;
    descripcionServicio: string;
    grupoPrograma: string;
    fechaInicio: string;
    fechaFin: string;
    duracion: string;
    ubicacion: string;
    direccion: string;
    unidadMedica: string;
    estatus: string;
    turno: string;
    ocasionServicio: string;
    tipoCita: string;
    trabajadorSocial: string;
    modalidad: string;
    horaInicio: string;
    horaFin: string;

    constructor() { }
}


export class ParticipanteCita {
    NOM_COMPLETO: string;
    CVE_TIPO_PACIENTE: number;
    

    constructor() { }
}