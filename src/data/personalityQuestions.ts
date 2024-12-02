import { v4 as uuidv4 } from 'uuid';

export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  genreWeights: Array<Record<string, number>>;
}

export interface QuestionTemplate {
  category: string;
  templates: {
    questions: string[];
    options: string[][];
    weights: Array<Record<string, number>>[];
  };
}

export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
  createdAt: string;
}

const questionTemplates: QuestionTemplate[] = [
  {
    category: "adventure",
    templates: {
      questions: [
        "¿Qué tipo de aventura te emociona más?",
        "¿Qué compañero de viaje prefieres?",
        "¿Cuál es tu motivación principal para la aventura?",
        "¿En qué tipo de mundo te gustaría aventurarte?",
        "¿Qué tipo de desafíos prefieres enfrentar?"
      ],
      options: [
        ["Exploración de tierras desconocidas", "Búsqueda de tesoros", "Viajes en el tiempo", "Misiones de rescate"],
        ["Un grupo diverso de amigos", "Un mentor sabio", "Un rival convertido en aliado", "Un compañero animal mágico"],
        ["Salvar el mundo", "Crecimiento personal", "Venganza", "Proteger a seres queridos"],
        ["Mundo de fantasía medieval", "Futuro post-apocalíptico", "Dimensiones paralelas", "Civilizaciones antiguas"],
        ["Acertijos y misterios", "Batallas épicas", "Supervivencia", "Dilemas morales"]
      ],
      weights: [
        [
          { "Adventure": 2, "Fantasy": 1 },
          { "Adventure": 2, "Action": 1 },
          { "Sci-Fi": 2, "Adventure": 1 },
          { "Adventure": 2, "Drama": 1 }
        ],
        [
          { "Adventure": 2, "Friendship": 1 },
          { "Adventure": 2, "Fantasy": 1 },
          { "Action": 2, "Drama": 1 },
          { "Fantasy": 2, "Adventure": 1 }
        ],
        [
          { "Adventure": 2, "Action": 1 },
          { "Coming of Age": 2, "Adventure": 1 },
          { "Dark Fantasy": 2, "Action": 1 },
          { "Adventure": 2, "Drama": 1 }
        ],
        [
          { "Fantasy": 2, "Adventure": 1 },
          { "Post-Apocalyptic": 2, "Adventure": 1 },
          { "Sci-Fi": 2, "Adventure": 1 },
          { "Historical": 2, "Adventure": 1 }
        ],
        [
          { "Mystery": 2, "Adventure": 1 },
          { "Action": 2, "Adventure": 1 },
          { "Survival": 2, "Adventure": 1 },
          { "Psychological": 2, "Adventure": 1 }
        ]
      ]
    }
  },
  {
    category: "action",
    templates: {
      questions: [
        "¿Qué tipo de escena de acción prefieres?",
        "¿Qué tipo de héroe te atrae más?",
        "¿Qué ambiente prefieres para las batallas?",
        "¿Qué tipo de poder te gustaría tener?",
        "¿Qué tipo de villano te parece más interesante?"
      ],
      options: [
        ["Peleas cuerpo a cuerpo", "Batallas con poderes", "Estrategias militares", "Persecuciones intensas"],
        ["Guerrero solitario", "Líder carismático", "Genio estratega", "Antihéroe misterioso"],
        ["Ciudad futurista", "Campo de batalla medieval", "Dimensión mágica", "Apocalipsis post-nuclear"],
        ["Super fuerza", "Control mental", "Manipulación elemental", "Habilidades ninja"],
        ["Genio malvado", "Señor de la guerra", "Villano trágico", "Enemigo sobrenatural"]
      ],
      weights: [
        [
          { "Action": 2, "Martial Arts": 1 },
          { "Supernatural": 2, "Fantasy": 1 },
          { "Military": 2, "Strategy": 1 },
          { "Action": 1, "Thriller": 2 }
        ],
        [
          { "Action": 2, "Drama": 1 },
          { "Shounen": 2, "Adventure": 1 },
          { "Psychological": 2, "Mystery": 1 },
          { "Dark Fantasy": 2, "Supernatural": 1 }
        ],
        [
          { "Sci-Fi": 2, "Cyberpunk": 1 },
          { "Fantasy": 2, "Historical": 1 },
          { "Magic": 2, "Fantasy": 1 },
          { "Post-Apocalyptic": 2, "Survival": 1 }
        ],
        [
          { "Superhero": 2, "Action": 1 },
          { "Psychological": 2, "Supernatural": 1 },
          { "Magic": 2, "Fantasy": 1 },
          { "Martial Arts": 2, "Action": 1 }
        ],
        [
          { "Psychological": 2, "Mystery": 1 },
          { "Military": 2, "Action": 1 },
          { "Drama": 2, "Psychological": 1 },
          { "Horror": 2, "Supernatural": 1 }
        ]
      ]
    }
  },
  {
    category: "romance",
    templates: {
      questions: [
        "¿Qué tipo de historia romántica prefieres?",
        "¿En qué ambiente te gustaría que se desarrolle la historia?",
        "¿Qué tipo de protagonista te atrae más?",
        "¿Qué tipo de desarrollo romántico prefieres?",
        "¿Qué elementos adicionales te gustan en una historia romántica?"
      ],
      options: [
        ["Amor a primera vista", "Amigos a amantes", "Rivales enamorados", "Romance prohibido"],
        ["Instituto", "Universidad", "Mundo fantástico", "Vida adulta"],
        ["Tímido y dulce", "Extrovertido y carismático", "Misterioso y distante", "Determinado y apasionado"],
        ["Lento y natural", "Intenso y dramático", "Comedia romántica", "Romance trágico"],
        ["Triángulo amoroso", "Elementos sobrenaturales", "Conflictos familiares", "Diferencias culturales"]
      ],
      weights: [
        [
          { "Romance": 2, "Drama": 1 },
          { "Slice of Life": 2, "Romance": 1 },
          { "Romance": 2, "Comedy": 1 },
          { "Drama": 2, "Romance": 1 }
        ],
        [
          { "School": 2, "Romance": 1 },
          { "College": 2, "Romance": 1 },
          { "Fantasy": 2, "Romance": 1 },
          { "Josei": 2, "Romance": 1 }
        ],
        [
          { "Romance": 2, "Slice of Life": 1 },
          { "Romance": 2, "Comedy": 1 },
          { "Mystery": 2, "Romance": 1 },
          { "Drama": 2, "Romance": 1 }
        ],
        [
          { "Slice of Life": 2, "Romance": 1 },
          { "Drama": 2, "Romance": 1 },
          { "Comedy": 2, "Romance": 1 },
          { "Tragedy": 2, "Romance": 1 }
        ],
        [
          { "Drama": 2, "Romance": 1 },
          { "Supernatural": 2, "Romance": 1 },
          { "Drama": 2, "Slice of Life": 1 },
          { "Romance": 2, "Cultural": 1 }
        ]
      ]
    }
  }
];

export const generateQuestionnaire = (category: string, count: number = 10): Question[] => {
  const template = questionTemplates.find(t => t.category === category);
  if (!template) return [];

  const questions: Question[] = [];
  const indices = Array.from({ length: template.templates.questions.length }, (_, i) => i);
  
  // Shuffle indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Select random questions
  for (let i = 0; i < Math.min(count, indices.length); i++) {
    const idx = indices[i];
    questions.push({
      id: uuidv4(),
      category: template.category,
      question: template.templates.questions[idx],
      options: template.templates.options[idx],
      genreWeights: template.templates.weights[idx]
    });
  }

  return questions;
};

export const createQuestionnaire = (
  title: string,
  description: string,
  category: string,
  questionCount: number = 10
): Questionnaire => {
  return {
    id: uuidv4(),
    title,
    description,
    category,
    questions: generateQuestionnaire(category, questionCount),
    createdAt: new Date().toISOString()
  };
};