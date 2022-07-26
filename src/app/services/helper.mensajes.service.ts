
import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class HelperMensajesService {
  /*Tipos de mensajes: Alertas*/
  public ALERT_DANGER: string = 'alert-danger';
  public ALERT_SUCCESS: string = 'alert-success';
  public ALERT_INFO: string = 'alert-info';
  public EXITO: string = 'Éxito';
  public ERROR: string = 'Error';
  public INFO: string = 'Información';
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

  public MSJ_ERROR_CONEXION_UBICACION: string = 'No fue posible conectar con el servicio de Ubicaciones';



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

  public MSJ_MSG023: string = 'No existe ningún horario configurado para la ubicación';

  public MSJ_ERROR_BENEFICIARIOS_CITA: string = 'No fue posible conectar con el servicio de consultar beneficiarios.';
  public MSJ_ERROR_CATSERVICIO: string = 'No fue posible consumir el catálogo de servicios.';
  public MSJ_ERROR_CATTURNO: string = 'No fue posible consumir el catálogo de turnos.';
  public MSJ_ERROR_CATPROGRAMA: string = 'No fue posible consumir el catálogo de programas.';
  public MSJ_ERROR_CATLUGAR: string = 'No fue posible consumir el catálogo de lugares.';
  public MSJ_ERROR_CATRESPONSABLE: string = 'No fue posible consumir el catálogo de responsables.';
  public MSJ_ERROR_CATFECHA: string = 'No fue posible consumir el catálogo de fechas disponibles.';
  public MSJ_ERROR_CATHORA: string = 'No fue posible consumir el catálogo de horarios disponibles.';
  public MSJ_ERROR_COMPLEMENTO_CITA: string = 'No fue posible conectar con el servicio de complemento.';
  public MSJ_ERROR_NUMPARTICIPANTES_CITA: string = 'Seleccione mínimo un participante.';
  public MSJ_ERROR_ESPACIO_CITA: string = 'El espacio seleccionado se encuentra al máximo de su cupo, por favor seleccionar otra fecha.';
  public MSJ_EXITO_AGENDA_CITA: string = 'La cita fue agendada correctamente. Favor de realizar la descarga del formato.';
  public MSJ_ERROR_AGENDA_CITA: string = 'Ocurrió un error al agendar la cita.';
  public MSJ_ERROR_CONSULTA_CITA: string = 'No fue posible conectar con el servicio de consultar cita.';
  public MSJ_EXITO_CANCELAR_CITA: string = 'La cita fué cancelada correctamente.';
  public MSJ_ERROR_CANCELAR_CITA: string = 'Ocurrió un error al cancelar la cita.';
  public MSJ_ERROR_BUSCA_CITA: string = 'No fue posible conectar con el servicio de búsqueda de cita.';
  public MSJ_EXITO_CONFIRMAR_CITA: string = 'La asistencia fue confirmada correctamente.';
  public MSJ_ERROR_CONFIRMAR_CITA: string = 'Ocurrió un error al confirmar la asistencia.';
  public MSJ_ERROR_IMPRIMIR_PDF_CITA: string = 'No se puede imprimir, la cita ya fue cancelada';


  //Mensajes Usuarios
  public MSJ_ERROR_CONEXION_USR: string = 'No fue posible conectar con el servicio.';
  public MSJ_WARNING_BUSCA_USR: string = 'Debe ingresar mínimo 7 dígitos para la búsqueda de matrícula.';
  public MSJ_EXITO_GUARDA_USR: string = 'El usuario fue creado correctamente.';
  public MSJ_EXITO_EDITA_USR: string = 'El usuario fue editado correctamente.';
  public MSJ_ERROR_ROLES_USR: string = 'No fue posible conectar con el servicio de consultar roles.';
  public MSJ_ERROR_GUARDA_USR: string = 'Ocurrió un error al guardar el usuario.';
  public MSJ_ERROR_EDITA_USR: string = 'Ocurrió un error al editar el usuario.';
  public MSJ_ERROR_BUSCA_USR: string = 'No fue posible conectar con el servicio de consultar usuarios.';
}
