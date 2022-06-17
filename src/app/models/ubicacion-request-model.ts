import { Servicio } from "./servicio-model";
import { Ubicacion } from "./ubicacion-model";

export class UbicacionRequest {
    public idUser: number;
    public ubicaciones: Ubicacion[];

}