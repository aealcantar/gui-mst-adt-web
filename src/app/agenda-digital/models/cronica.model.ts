import { Participante } from "./participante.model"
export class Cronica {
    id?: string | null;
    idCalendarioAnual?: string | null;
    idEspecialidad?: string;
    desEspecialidad?: string | null;
    idTurno?: number;
    desTurno?: string | null;
    idGrupo?: number;
    desGrupo?: string | null;
    idUbicacion?: string;
    desUbicacion?: string | null;
    fecFechaCorta?: string;
    fecFechaCompleta?: string | null;
    timHora?: string;
    desModalidad?: string | null;
    numTotalParticipantes?: number;
    numParticipantesAsistieron?: string | null;
    idEstatusCronica?: number;
    desEstatusCronica?: string | null;
    descPonentes?: string;
    desTecnicaDidactica?: string;
    desMaterialApoyo?: string;
    desObjetivosSesion?: string;
    desDesarrolloSesion?: string;
    desPerfilGrupo?: string;
    desObservaciones?: string;
    participanteList?: Participante[];
}