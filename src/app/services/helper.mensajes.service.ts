
import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class HelperMensajesService {
  /*Tipos de mensajes: Alertas*/
  public ALERT_DANGER: string = 'alert-danger';
  public ALERT_SUCCESS: string = 'alert-success';
  public EXITO: string = 'Éxito';
  public ERROR: string = 'Error';
  public ERROR400: string = 'Error 400';
  public ERROR403: string = 'Error 403';
  public ERROR404: string = 'Error 404';
  public ERROR500: string = 'Error 500';
  public ERROR503: string = 'Error 503';

  /**------------------------ */
  public MSJ_ERROR_GENERAL: string = 'No es posible cargar el archivo, ';
  public MSJ_EXTENSION_NO_PERMITIDA: string = 'el formato es erróneo.';
  public MSJ_WARNING_SELECCIONAR_ARCHIVO: string = 'Seleccionar  archivo';
  public MSJ_ERROR_PLANTILLA_NOVALIDA: string = 'El archivo que intenta cargar no corresponde a una plantilla válida o está vacío.';
  
  public MSJ_EXCEDE_TAMANIO: string = 'supera el máximo permitido';
  public MSJ_ERROR_ARCHIVOVACIO: string = 'El archivo seleccionado está vacío.';
  public MSJ_EXITO_CARGA: string = 'La carga se ha realizado correctamente, se enviará un correo con el acuse de carga.';
  public MSJ_ERROR_CARGA: string = 'El archivo cuenta con errores. Se enviará un correo con el acuse de carga';
  
  /**MENSAJES PERSONALIZADOS CONEXION API */
  public MSJ_ERROR_CONEXION_CARGAINICIAL: string = 'No fue posible conectar con el servicio de Carga inicial.';
  public MSJ_ERROR_CONEXION_UNIDADESMEDICAS: string = 'No fue posible conectar con el servicio de Unidades Médicas.';
  public MSJ_ERROR_CONEXION_UBICACIONES: string = 'No fue posible conectar con el servicio de Ubicaciones.';
  public MSJ_ERROR_CONEXION_SERVICIOS: string = 'No fue posible conectar con el servicio de Servicios.';
  public MSJ_ERROR_CONEXION_RESPONSABLE: string = 'No fue posible conectar con el servicio de Responsables.';
  public MSJ_ERROR_CONEXION_PROGRAMASTS: string = 'No fue posible conectar con el servicio de Programas de Trabajo Social.';
  public MSJ_ERROR_CONEXION_CALENDARIO: string = 'No fue posible conectar con el servicio de Calendario';
  public MSJ_ERROR_CONEXION_PERSONAL: string = 'No fue posible conectar con el servicio de Usuarios';
  public MSJ_ERROR_CONEXION_TURNOS: string = 'No fue posible conectar con el servicio de Turnos';
  public MSJ_ERROR_CONEXION_PUESTOS: string = 'No fue posible conectar con el servicio de Roles';
  public MSJ_ERROR_CONEXION_ACUSE: string = 'No fue posible conectar con el servicio de Acuses';
  public MSJ_ERROR_CONEXION_HORARIO: string = 'No fue posible conectar con el servicio de Horarios';



  //MEnsajes de error servidor
  public MSJ_ERROR_400: string = 'Solicitud no válida, contacte al administrador';
  public MSJ_ERROR_403: string = 'Lo sentimos, pero tu consulta es parecida a las solicitudes automatizadas de un virus informático o aplicación de software espía. Vacía la caché y suprime las cookies del navegador, si el problema persiste te recomendamos usar un navegador diferente como, por ejemplo, Mozilla Firefox.';
  public MSJ_ERROR_404: string = 'La página solicitada puede no estar disponible, haber cambiado de dirección (URL) o no existir. Con frecuencia es debido a algún error al escribir la dirección en la página (URL). Compruebe de nuevo si es correcta.';
  public MSJ_ERROR_500: string = 'El servidor web encontró una condición inesperada que le impidió completar tu solicitud para acceder a la URL requerida. Por favor intentalo más tarde.';
  public MSJ_ERROR_503: string = 'El servidor web actualmente no está disponible para manejar tu solicitud debido a una sobrecarga temporal o a un mantenimiento del servidor.';

  public MSJ_EXITO_CARGAS: string = 'Todos los catálogos han sido cargados correctamente.';
 
  public MSJ_DATOS_OBLIGATORIOS: string = 'Ingresa los datos obligatorios';
  public MSJ_CORREO_NO_REGISTRADO: string = 'Correo no registrado!';
  public MSJ_ERROR_CONEXION_LOGIN: string = 'Servicio no disponible. Favor de reportarlo!';
  public MSJ_CORREO_ENVIADO: string ='Correo enviado satisfactoriamente!';


  //Mensajes Agenda Api
  public MSJ_ERROR_EDITAR_HORARIO: string = 'Es necesario que el día este habilitado para poder editar los horarios';
  public MSJ_ERROR_EDITAR_EXITOSO_HORARIO: string = 'El horario se editó exitosamente';
  public MSJ_ERROR_DATOS_REQUERIDOS_HORARIO: string = 'Seleccione los campos requeridos';
}
