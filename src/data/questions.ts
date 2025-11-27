export type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

export const QUESTIONS: Record<string, Question[]> = {
  Ingenieria: [
    {
      id: 'ing1',
      question: '¿Qué es un algoritmo?',
      options: ['Conjunto de pasos', 'Un lenguaje', 'Un diagrama', 'Una variable'],
      answer: 'Conjunto de pasos',
    },
    {
      id: 'ing2',
      question: 'Unidad básica de datos en programación:',
      options: ['Variable', 'Array', 'Bit', 'Función'],
      answer: 'Bit',
    },
    {
      id: 'ing3',
      question: '¿Qué significa "CPU"?',
      options: ['Central Process Unit', 'Central Processing Unit', 'Control Program Unit', 'Computer Power Unit'],
      answer: 'Central Processing Unit',
    },
    {
      id: 'ing4',
      question: '¿Cuál de los siguientes es un lenguaje de programación?',
      options: ['Python', 'HTML', 'CSS', 'SQL'],
      answer: 'Python',
    },
    {
      id: 'ing5',
      question: 'En bases de datos, SQL se utiliza para:',
      options: ['Estilos de página', 'Diseño gráfico', 'Administrar datos', 'Compilar código'],
      answer: 'Administrar datos',
    },
    {
      id: 'ing6',
      question: 'Un diagrama de flujo se utiliza para:',
      options: ['Representar procesos', 'Guardar datos', 'Compilar programas', 'Diseñar hardware'],
      answer: 'Representar procesos',
    },
    {
      id: 'ing7',
      question: '¿Qué significa "bug" en programación?',
      options: ['Un programa', 'Un error', 'Una actualización', 'Un lenguaje'],
      answer: 'Un error',
    },
    {
      id: 'ing8',
      question: '¿Cuál es la base del sistema binario?',
      options: ['0 y 1', '1 y 2', '2 y 3', '10 y 11'],
      answer: '0 y 1',
    },
    {
      id: 'ing9',
      question: 'La memoria RAM se utiliza para:',
      options: ['Almacenamiento temporal', 'Almacenamiento permanente', 'Gráficos', 'Energía'],
      answer: 'Almacenamiento temporal',
    },
    {
      id: 'ing10',
      question: '¿Qué es un compilador?',
      options: [
        'Un programa que traduce código fuente a lenguaje máquina',
        'Un lenguaje de programación',
        'Un editor de texto',
        'Un sistema operativo',
      ],
      answer: 'Un programa que traduce código fuente a lenguaje máquina',
    },
    {
      id: 'ing11',
      question: 'En ingeniería de software, UML se utiliza para:',
      options: ['Diseñar diagramas', 'Compilar código', 'Optimizar hardware', 'Depurar programas'],
      answer: 'Diseñar diagramas',
    },

    {
      id: 'ing12',
      question: '¿Qué es un sistema operativo?',
      options: ['Un tipo de hardware', 'Software base del sistema', 'Un lenguaje', 'Un compilador'],
      answer: 'Software base del sistema',
    },
    {
      id: 'ing13',
      question: '¿Qué es una variable?',
      options: ['Un valor fijo', 'Un dato que cambia', 'Un algoritmo', 'Una función'],
      answer: 'Un dato que cambia',
    },
    {
      id: 'ing14',
      question: 'HTML se utiliza para:',
      options: ['Diseño', 'Bases de datos', 'Estructurar páginas web', 'Compilar código'],
      answer: 'Estructurar páginas web',
    },
    {
      id: 'ing15',
      question: '¿Qué es un bit?',
      options: [
        'Unidad mínima de información',
        'Un archivo',
        'Una interacción',
        'Un número decimal'
      ],
      answer: 'Unidad mínima de información',
    },
    {
      id: 'ing16',
      question: '¿Qué es una función?',
      options: ['Un proceso reutilizable', 'Un archivo', 'Una memoria', 'Un compilador'],
      answer: 'Un proceso reutilizable',
    },
    {
      id: 'ing17',
      question: '¿Qué permite un bucle “for”?',
      options: [
        'Repetir acciones',
        'Declarar variables',
        'Conectar servidores',
        'Renderizar gráficos'
      ],
      answer: 'Repetir acciones',
    },
    {
      id: 'ing18',
      question: '¿Qué es una API?',
      options: ['Un hardware', 'Un servidor', 'Un puente entre sistemas', 'Un algoritmo'],
      answer: 'Un puente entre sistemas',
    },
    {
      id: 'ing19',
      question: 'La nube (cloud) permite:',
      options: ['Almacenar datos online', 'Crear virus', 'Mejorar gráficos', 'Apagar computadoras'],
      answer: 'Almacenar datos online',
    },
    {
      id: 'ing20',
      question: '¿Cuál NO es un lenguaje de programación?',
      options: ['Java', 'C++', 'Ruby', 'WiFi'],
      answer: 'WiFi',
    },
    {
      id: 'ing21',
      question: '¿Qué es un servidor?',
      options: [
        'Una computadora que provee servicios',
        'Un smartphone',
        'Un algoritmo',
        'Un lenguaje de programación'
      ],
      answer: 'Una computadora que provee servicios',
    },
    {
      id: 'ing22',
      question: 'CSS sirve para:',
      options: ['Estilos visuales', 'Bases de datos', 'Compilar código', 'Realidad virtual'],
      answer: 'Estilos visuales',
    },
    {
      id: 'ing23',
      question: 'La red LAN se refiere a:',
      options: ['Red global', 'Red local', 'Red satelital', 'Red telefónica'],
      answer: 'Red local',
    },
    {
      id: 'ing24',
      question: '¿Qué es Git?',
      options: ['Un servidor', 'Un lenguaje', 'Un sistema de control de versiones', 'Una base de datos'],
      answer: 'Un sistema de control de versiones',
    },
    {
      id: 'ing25',
      question: '¿Qué es un archivo .exe?',
      options: [
        'Un archivo ejecutable',
        'Un archivo comprimido',
        'Un archivo de texto',
        'Un archivo de imagen'
      ],
      answer: 'Un archivo ejecutable',
    },
    {
      id: 'ing26',
      question: '¿Cuál es un lenguaje orientado a objetos?',
      options: ['Java', 'HTML', 'CSS', 'Markdown'],
      answer: 'Java',
    },
    {
      id: 'ing27',
      question: '¿Qué es un framework?',
      options: [
        'Un conjunto de herramientas',
        'Un compilador',
        'Un sistema operativo',
        'Un diagrama'
      ],
      answer: 'Un conjunto de herramientas',
    },
    {
      id: 'ing28',
      question: '¿Qué es un “array”?',
      options: ['Una variable simple', 'Un conjunto de datos', 'Un servidor', 'Un pixel'],
      answer: 'Un conjunto de datos',
    },
    {
      id: 'ing29',
      question: '¿Qué significa HTTP?',
      options: [
        'HyperText Transfer Protocol',
        'High Transmission Packet Processor',
        'Host Transfer Tunnel Platform',
        'Hardware Transfer Protocol'
      ],
      answer: 'HyperText Transfer Protocol',
    },
    {
      id: 'ing30',
      question: '¿Qué es un “debugger”?',
      options: ['Un editor', 'Un analizador de errores', 'Una red', 'Un sistema operativo'],
      answer: 'Un analizador de errores',
    },
    {
      id: 'ing31',
      question: '¿Cuál es un tipo de dato?',
      options: ['Entero', 'Pantalla', 'Servidor', 'Internet'],
      answer: 'Entero',
    },
  ],

  Medicina: [
    {
      id: 'med1',
      question: '¿Cuál es el órgano más grande del cuerpo humano?',
      options: ['Piel', 'Hígado', 'Corazón', 'Cerebro'],
      answer: 'Piel',
    },
    {
      id: 'med2',
      question: 'La sangre está compuesta principalmente por:',
      options: ['Células', 'Agua', 'Plaquetas', 'Plasma'],
      answer: 'Plasma',
    },
    {
      id: 'med3',
      question: '¿Dónde se produce la insulina?',
      options: ['Hígado', 'Páncreas', 'Riñón', 'Estómago'],
      answer: 'Páncreas',
    },
    {
      id: 'med4',
      question: '¿Cuál es la función principal de los glóbulos rojos?',
      options: ['Defender el cuerpo', 'Transportar oxígeno', 'Formar coágulos', 'Regular hormonas'],
      answer: 'Transportar oxígeno',
    },
    {
      id: 'med5',
      question: '¿Qué hueso protege al cerebro?',
      options: ['Craneo', 'Columna vertebral', 'Costillas', 'Mandíbula'],
      answer: 'Craneo',
    },
    {
      id: 'med6',
      question: '¿Cómo se llama el proceso de división celular?',
      options: ['Meiosis', 'Fisión', 'Mitosis', 'Clonación'],
      answer: 'Mitosis',
    },
    {
      id: 'med7',
      question: '¿Qué tipo de sangre se considera donante universal?',
      options: ['A+', 'O-', 'B+', 'AB+'],
      answer: 'O-',
    },
    {
      id: 'med8',
      question: '¿Cuál es el órgano encargado de filtrar la sangre?',
      options: ['Riñón', 'Pulmón', 'Hígado', 'Bazo'],
      answer: 'Riñón',
    },
    {
      id: 'med9',
      question: 'El corazón está dividido en:',
      options: ['2 cavidades', '3 cavidades', '4 cavidades', '5 cavidades'],
      answer: '4 cavidades',
    },
    {
      id: 'med10',
      question: '¿Cuál es la unidad funcional del riñón?',
      options: ['Glomérulo', 'Nefrona', 'Alvéolo', 'Neurona'],
      answer: 'Nefrona',
    },
    {
      id: 'med11',
      question: '¿Qué vitamina se produce con la exposición al sol?',
      options: ['Vitamina A', 'Vitamina C', 'Vitamina D', 'Vitamina K'],
      answer: 'Vitamina D',
    },

        {
      id: 'med12',
      question: '¿Qué órgano bombea la sangre?',
      options: ['Pulmón', 'Hígado', 'Corazón', 'Riñón'],
      answer: 'Corazón',
    },
    {
      id: 'med13',
      question: '¿Dónde se encuentran los alveolos?',
      options: ['Hígado', 'Pulmones', 'Estómago', 'Corazón'],
      answer: 'Pulmones',
    },
    {
      id: 'med14',
      question: '¿Qué tipo de tejido cubre superficies del cuerpo?',
      options: ['Epitelial', 'Óseo', 'Muscular', 'Nervioso'],
      answer: 'Epitelial',
    },
    {
      id: 'med15',
      question: '¿Qué órgano produce bilis?',
      options: ['Corazón', 'Páncreas', 'Hígado', 'Riñón'],
      answer: 'Hígado',
    },
    {
      id: 'med16',
      question: '¿Qué componente transporta oxígeno en la sangre?',
      options: ['Plaquetas', 'Plasma', 'Glóbulos rojos', 'Glóbulos blancos'],
      answer: 'Glóbulos rojos',
    },
    {
      id: 'med17',
      question: '¿Qué parte del ojo controla la cantidad de luz?',
      options: ['Iris', 'Retina', 'Córnea', 'Cristalino'],
      answer: 'Iris',
    },
    {
      id: 'med18',
      question: '¿Qué hueso es el más largo del cuerpo?',
      options: ['Fémur', 'Húmero', 'Tibia', 'Radio'],
      answer: 'Fémur',
    },
    {
      id: 'med19',
      question: '¿Qué sistema controla movimientos voluntarios?',
      options: ['Endocrino', 'Digestivo', 'Nervioso', 'Respiratorio'],
      answer: 'Nervioso',
    },
    {
      id: 'med20',
      question: '¿Dónde ocurre la digestión química inicial?',
      options: ['Boca', 'Intestino grueso', 'Esófago', 'Tráquea'],
      answer: 'Boca',
    },
    {
      id: 'med21',
      question: '¿Qué parte del cerebro coordina el equilibrio?',
      options: ['Bulbo', 'Cerebelo', 'Hipotálamo', 'Tronco'],
      answer: 'Cerebelo',
    },
    {
      id: 'med22',
      question: '¿Cuántos huesos tiene el cuerpo humano adulto?',
      options: ['106', '206', '150', '300'],
      answer: '206',
    },
    {
      id: 'med23',
      question: '¿Qué estructura conecta músculo y hueso?',
      options: ['Ligamento', 'Tendón', 'Cartílago', 'Fascia'],
      answer: 'Tendón',
    },
    {
      id: 'med24',
      question: '¿Qué célula combate infecciones?',
      options: ['Plaquetas', 'Glóbulos blancos', 'Neurona', 'Eritrocito'],
      answer: 'Glóbulos blancos',
    },
    {
      id: 'med25',
      question: '¿Qué órgano regula la temperatura corporal?',
      options: ['Hígado', 'Hipotálamo', 'Corazón', 'Bazo'],
      answer: 'Hipotálamo',
    },
    {
      id: 'med26',
      question: '¿El páncreas produce?',
      options: ['Insulina', 'Bilis', 'Urea', 'Adrenalina'],
      answer: 'Insulina',
    },
    {
      id: 'med27',
      question: '¿Qué estructura permite el intercambio gaseoso?',
      options: ['Bronquios', 'Alvéolos', 'Tráquea', 'Diafragma'],
      answer: 'Alvéolos',
    },
    {
      id: 'med28',
      question: '¿Qué es la anemia?',
      options: [
        'Exceso de oxígeno',
        'Deficiencia de glóbulos rojos',
        'Fiebre alta',
        'Inflamación del hígado'
      ],
      answer: 'Deficiencia de glóbulos rojos',
    },
    {
      id: 'med29',
      question: '¿Cuál es la función principal del hígado?',
      options: ['Bombear sangre', 'Filtrar toxinas', 'Regular hormonas', 'Transmitir impulsos'],
      answer: 'Filtrar toxinas',
    },
    {
      id: 'med30',
      question: '¿Dónde se almacena la orina?',
      options: ['Riñón', 'Uréter', 'Vejiga', 'Intestino'],
      answer: 'Vejiga',
    },
    {
      id: 'med31',
      question: '¿Qué vitamina es esencial para la coagulación?',
      options: ['Vitamina K', 'Vitamina E', 'Vitamina B12', 'Vitamina C'],
      answer: 'Vitamina K',
    },

    
  ],
};
