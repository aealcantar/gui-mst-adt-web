// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlLogin: 'http://localhost:4200/login',
  //Agenda
  urlMSADCargasCatalogos: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-carga-catalogos',
  //urlMSADCargasCatalogos: 'http://localhost:8080/msedsc-carga-catalogos',
  urlMSEDSCatalogos: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos/api',
  urlMSADTCITAS: 'https://adt-qa.cloudapps.imss.gob.mx/msadt-citas/api',
  urlMSEDSCatalogosHorarios: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos/api',
  //urlMSEDSCHorarios: 'http://localhost:8080/msedsc-catalogos',
  urlMSEDSCHorarios: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos',
  urlMSEDSCAgenda: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos',
  urlMSADTUSUARIOS: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-usuarios/api',


  //Trabajo Social
  msmtsPacientes: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-pacientes/api/busquedanss/',
  msmtsCronicasReporte: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-cronica-grupal/api',
  msmtsCatalogos: 'https://adt-qa.cloudapps.imss.gob.mx/msedsc-catalogos',
  msmtsCronicas: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-cronica-grupal/api',
  msmtsNotas: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-notas/api',
  msmtsEstudioMedicos: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-estudios-medicos/api',
  msmtsControlArticulos: 'https://mts-qa.cloudapps.imss.gob.mx/msmts-control-articulos/api',
  msmtsOauth: 'http://localhost:8081/',
  urlServOauth: 'http://localhost:8081',

  urlSiteGoogleRecaptcha: 'https://www.google.com/recaptcha/api/siteverify',
  recaptcha: {
    siteKey: '6LdbfOUfAAAAACVHNAE5P66uCngEas0k6VpEywJR',
  },
  siteKey: '6LcjT7wfAAAAAJtcZyGa0K44UBogPnXoeCd2RAuC',
  secretKey: '6LcjT7wfAAAAAGj4dG-nQ258Nf8i2gEEqFIwZxC5',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
