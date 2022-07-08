export class InformeServicios {
	id?: number;
    fecha?: string;
	idEspecialidad?: string;
    desEspecialidad?: string | null;
    idTurno?: number;
    desTurno?: string | null;
    idUbicacion?: string;
    desUbicacion?: string | null;
    idResponsable?: number;
    desResponsable?: string | null;
    numero?: string;
    paciente?: string;
    horaCita?: string;
    agregadoMedico?: string;
    primeraVez?: string;
    citado?: string;
}