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
  ],
};
