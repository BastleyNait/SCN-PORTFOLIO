/* Versión en español de los casos de estudio. Mismos hechos, misma estructura:
   si se agrega una sección en caseStudies.js, va también aquí. */

export const caseStudies = {
  'boom-pos': {
    slug: 'boom-pos',
    projectId: 'boom-pos',
    title: 'Un cobro que sigue vendiendo cuando la conexión no',
    client: 'Boom POS & CRM',
    role: 'Arquitectura · Diseño de estado · Backend',
    tech: ['Next.js App Router', 'Zustand', 'API Routes', 'Flask', 'PostgreSQL'],
    metrics: [
      { value: '100+', label: 'ventas al día' },
      { value: '500+', label: 'productos en inventario' },
      { value: '2 meses', label: 'de la spec a producción' }
    ],
    sections: [
      {
        heading: 'El problema',
        body: [
          'Un punto de venta se juzga en un eje que la mayoría de las aplicaciones web nunca enfrenta: qué pasa en el momento exacto en que cambia de manos el dinero. Todo lo demás del sistema puede ser lento, incómodo o feo, y el negocio sobrevive. Un cobro que se traba con el cliente parado ahí, no.',
          'El local no tiene conectividad confiable. Eso no es un caso borde a resolver después, es la condición de operación.'
        ]
      },
      {
        heading: 'La restricción que decidió todo',
        body: [
          'Un cajero agrega artículos, cambia cantidades, borra una línea, aplica un descuento. Con un carrito autoritativo en el servidor, cada una de esas pulsaciones es un viaje de ida y vuelta, y cada viaje es una oportunidad de que la interfaz se congele sobre una red que ya es poco confiable.',
          'Así que la pregunta real no era dónde debe vivir el carrito para ser correcto. Era qué partes de una venta toleran un viaje a la red y cuáles no.'
        ]
      },
      {
        heading: 'La decisión',
        body: [
          'El carrito de trabajo vive en el cliente con Zustand y nunca espera al servidor. El servidor es dueño del libro contable, y una venta cerrada se registra como una transacción.',
          'Ese reparto sigue al dinero. Mientras una venta se arma es un borrador, y un borrador perdido cuesta volver a escanear. Una vez cerrada es un registro financiero, y un registro financiero perdido o duplicado cuesta confianza. Solo la segunda mitad necesita al servidor, así que solo la segunda mitad paga la red.',
          'La alternativa, un carrito autoritativo en el servidor en cada pulsación, es más fácil de razonar y se descartó exactamente por la razón que la hace más fácil: convierte a la red en dependencia de cada interacción en vez de una sola.'
        ]
      },
      {
        heading: 'La implementación',
        body: [
          'El front end es Next.js App Router con Zustand sosteniendo el carrito. El back end es un servicio Flask sobre PostgreSQL, alcanzado a través de API Routes de Next.js, y es dueño del libro de transacciones y de los registros del CRM.',
          'Una venta cerrada lleva una clave generada en el cliente. El servidor trata la repetición de esa clave como la misma transacción y no como una nueva, que es lo que hace seguro un reintento sobre una conexión que se cae. Sin eso, la falla obvia es la peor: la petición tiene éxito, la respuesta nunca llega, el cajero vuelve a apretar el botón y al cliente le cobran dos veces.'
        ]
      },
      {
        heading: 'Qué hace hoy',
        body: [
          'La plataforma mueve más de cien ventas al día sobre un inventario de más de quinientos productos, junto a un módulo de CRM para los registros de clientes. Fue de la especificación a producción en dos meses.'
        ]
      },
      {
        heading: 'Qué cambiaría',
        body: [
          'La lógica de reconciliación es la parte que reescribiría. Funciona, pero vive en código de aplicación y no en el modelo de datos, lo que significa que la regla para dos terminales vendiendo el mismo artículo es algo que un lector tiene que buscar en vez de algo que el esquema garantiza. Es el mismo error que evité en Revolt Laptop, donde la restricción está en la base de datos.',
          'Lo segundo es el carrito en el cliente. Hoy sobrevive a una recarga, pero no está diseñado para un cajero que cambia de dispositivo a mitad de venta. Ese es un escenario real en un local con movimiento y hoy está sin resolver, no deliberadamente fuera de alcance.'
        ]
      }
    ]
  },
  'anemivision': {
    slug: 'anemivision',
    projectId: 'anemivision',
    title: 'Tamizaje de anemia que funciona con la red apagada',
    client: 'Anemivision',
    role: 'Arquitectura · Pipeline del modelo · Android',
    tech: ['Kotlin', 'Android', 'TensorFlow Lite', 'PyTorch', 'Visión por computadora'],
    metrics: [
      { value: '0', label: 'imágenes de paciente transmitidas' },
      { value: 'En dispositivo', label: 'inferencia, sin API' },
      { value: 'Offline', label: 'por diseño, no por respaldo' }
    ],
    sections: [
      {
        heading: 'El problema',
        body: [
          'El tamizaje de anemia ocurre donde están los pacientes, que no es donde está el ancho de banda. Las clínicas que más necesitan una herramienta rápida de tamizaje son las que menos pueden depender de una conexión para alcanzarla.',
          'La entrada además es una fotografía de una persona. Ese solo hecho cambia qué tipo de sistema se le permite ser a esto.'
        ]
      },
      {
        heading: 'La restricción que decidió todo',
        body: [
          'Una API de inferencia hospedada es la respuesta por defecto y acá falla dos veces. Necesita una conectividad que el contexto no tiene, y significa que imágenes de pacientes viajan por una red y aterrizan en un servidor que alguien tiene que asegurar, auditar y eventualmente borrar.',
          'Los datos de salud que nunca recolectas son datos de salud que no puedes filtrar. Ese encuadre hizo la decisión más simple de lo que la habría hecho una revisión de seguridad.'
        ]
      },
      {
        heading: 'La decisión',
        body: [
          'El modelo corre dentro de la aplicación Android. Un modelo PyTorch se cuantiza a TensorFlow Lite y viaja en el binario, así que la inferencia pasa en el dispositivo y ninguna imagen se transmite jamás.',
          'La cuantización es el precio. Convertir pesos float32 a int8 reduce el modelo lo suficiente para correr en la CPU de un teléfono y cuesta algo de precisión a cambio. La pregunta nunca fue si la cuantización pierde precisión, fue si esa pérdida es menor que la de una herramienta que no funciona cuando no hay señal. En este contexto claramente lo es.'
        ]
      },
      {
        heading: 'La implementación',
        body: [
          'La aplicación es Android nativo en Kotlin y no multiplataforma, porque el trabajo es captura de cámara e inferencia en dispositivo, y ambos son lugares donde la capa de plataforma justifica su costo.',
          'El modelo se entrena en PyTorch y se convierte a TensorFlow Lite para el runtime del dispositivo. Comparé la precisión del modelo float contra el cuantizado antes de publicar, y ejercité la inferencia en el dispositivo con la red apagada, porque una funcionalidad que nunca se corrió en su condición real de operación no está probada.'
        ]
      },
      {
        heading: 'Qué hace hoy',
        body: [
          'La app hace el tamizaje completamente offline. Ninguna imagen de paciente sale del teléfono, así que no hay transmisión que asegurar ni imagen almacenada que filtrar.'
        ]
      },
      {
        heading: 'Qué cambiaría',
        body: [
          'La vía de actualización es el punto débil y es inherente a la decisión. Un modelo dentro del binario no se puede corregir sin publicar, así que mejorarlo es una actualización de app y una revisión de tienda, no un deploy. Si esto creciera, querría un archivo de modelo firmado que se pueda actualizar aparte de la aplicación, lo que mantiene la inferencia local y vuelve reemplazable al modelo.',
          'También querría que el resultado del tamizaje cargue su propia incertidumbre. Un número sin intervalo de confianza invita a más confianza de la que un modelo cuantizado sobre la cámara de un teléfono se ganó, y en contexto médico eso es un problema de diseño, no un detalle de interfaz.'
        ]
      }
    ]
  },
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
