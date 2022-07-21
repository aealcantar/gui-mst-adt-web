import { HorarioStatus } from "./horario.status.model";
import { HorarioTurno } from "./horario.turno.model";

export class Horario {
  	public  horario:number;
	public idUbicacion: number;
	public estatus:HorarioStatus;
	public dia:string;
	public turno:HorarioTurno;
    public horaInicial:string;
	public horaFinal:string;
	public duracion:number;
}