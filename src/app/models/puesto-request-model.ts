import { Puesto as Puesto } from "./puesto-model";
import { Turno } from "./turno-model";


export class PuestoRequest {
    public idUser: number;
    public puestos: Puesto[];

}