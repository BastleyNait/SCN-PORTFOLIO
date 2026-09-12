/* Versión en español de los casos de estudio. Mismos hechos, misma estructura:
   si se agrega una sección en caseStudies.js, va también aquí. */

export const caseStudies = {
  'geotop-certificates': {
    slug: 'geotop-certificates',
    projectId: 'geotop-certificates',
    title: 'Certificados de calibración que un técnico puede verificar en campo',
    client: 'GEOTOP — equipos de topografía',
    role: 'Arquitectura · Backend · Infraestructura',
    tech: ['Flask', 'Google Compute Engine', 'Nginx', 'Almacenamiento de objetos compatible con S3', 'QR'],
    metrics: [
      { value: '700+', label: 'certificados en la nube' },
      { value: 'Segundos', label: 'para verificar un instrumento' },
      { value: '0', label: 'apps que instalar' }
    ],
    sections: [
      {
        heading: 'El problema',
        body: [
          'GEOTOP vende y da servicio a equipos de topografía. Cada instrumento que calibra recibe un certificado, y ese certificado era una hoja de papel. El papel se archiva, se fotocopia, se lleva a obra y se pierde.',
          'La consecuencia no era administrativa sino operativa. Con el instrumento en la mano, nadie podía decir si su calibración seguía vigente. No había trazabilidad entre el equipo físico y el documento que lo respaldaba.'
        ]
      },
      {
        heading: 'La restricción que decidió todo',
        body: [
          'Quien necesita la respuesta es un técnico parado en campo con el instrumento en las manos. Puede estar lejos de una oficina, con un teléfono, y con una conectividad pobre o intermitente.',
          'Ese solo hecho descartó casi todos los diseños obvios antes de construir ninguno. Fuera cual fuera la respuesta, tenía que funcionar para alguien que no se preparó para ese momento.'
        ]
      },
      {
        heading: 'La decisión',
        body: [
          'Un código QR impreso va pegado al instrumento físico. Al escanearlo se resuelve directamente el certificado de ese equipo, guardado como PDF en almacenamiento de objetos en la nube.',
          'Las alternativas fallaban contra la restricción. Una app móvil le pide al técnico instalar algo antes de poder responder una pregunta que tiene ahora mismo. Un login le pide guardar credenciales de un sistema que no es suyo y tener señal suficiente para autenticarse. Un catálogo interno implica buscar el instrumento por un número de serie que tendría que leer del equipo y escribir sin equivocarse.',
          'El QR elimina cada uno de esos pasos. El identificador vive en el objeto mismo, el teléfono ya trae el escáner, y lo único que la red tiene que entregar es un PDF. El documento es el producto, así que la arquitectura no hace más que entregarlo.'
        ]
      },
      {
        heading: 'La implementación',
        body: [
          'Un servicio Flask corre sobre una VM aprovisionada en Google Compute Engine, con Nginx delante como proxy inverso terminando el tráfico público. Los certificados viven en almacenamiento de objetos compatible con S3 y no en la base de datos, así que servir un documento nunca pasa por la lógica de aplicación.',
          'La base de datos registra el instrumento y apunta a su objeto. El QR codifica la ruta. Nada en el camino de lectura necesita ser ingenioso, porque el camino de lectura es el que tiene que funcionar con mala conexión.'
        ]
      },
      {
        heading: 'Qué hace hoy',
        body: [
          'Más de 700 certificados están en la nube y son direccionables desde el equipo al que pertenecen. Verificar, que antes era una llamada y un archivador, es un escaneo y unos segundos.',
          'La trazabilidad es la parte silenciosa: un certificado ahora está atado a un objeto físico y no a una carpeta que alguien tiene que mantener.'
        ]
      },
      {
        heading: 'Qué cambiaría',
        body: [
          'El camino de lectura asume que la red está ahí cuando el técnico escanea. Normalmente lo está, aunque sea un momento, pero una copia en caché en el dispositivo tras el primer escaneo dejaría el peor caso igual de bueno que el habitual. Es lo primero que agregaría.',
          'Lo segundo es la VM. Una sola instancia de Google Compute Engine con Nginx delante es infraestructura honesta para esta carga y puedo razonar sobre toda ella, pero también es una máquina que tengo que mantener parchada. Para un servicio cuyo trabajo entero es entregar documentos estáticos, eso es más superficie operativa de la que el problema merece.'
        ]
      }
    ]
  }
};

export default caseStudies;
