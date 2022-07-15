import { LongDateFormatKey } from "moment";
import { Horario } from "./horario.model";

export class HorarioRequest {
	
  	 public  dia:string;
	 public estatus:string;	 
	 public cve_estatus: number;
	 public idUbicacion: number;
}

export class NuevoHorarioRequest {
	
	public  lstHorarios:Horario[];
 
}