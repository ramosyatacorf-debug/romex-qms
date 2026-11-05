/**
 * Qualy AI - Cerebro local (sin APIs de pago)
 * Responde sobre el sistema RomEx QMS y conocimiento general básico.
 */

export function qualyThink(input: string): string {
  const t = normalize(input);

  // —— Saludos ——
  if (match(t, ["hola", "buenos dias", "buenas tardes", "buenas noches", "que tal", "hey"])) {
    return "Hola. Soy Qualy AI, asistente del laboratorio RomEx. Puedo ayudarte con el sistema QMS, módulos, guías y consultas generales del laboratorio. ¿Qué necesitas?";
  }

  if (match(t, ["gracias", "muchas gracias", "te agradezco"])) {
    return "Con gusto. Si necesitas algo más del laboratorio o del sistema, aquí estoy.";
  }

  if (match(t, ["adios", "hasta luego", "chao", "nos vemos"])) {
    return "Hasta luego. Que tengas un buen día en el laboratorio.";
  }

  // —— Identidad ——
  if (match(t, ["quien eres", "que eres", "como te llamas", "tu nombre"])) {
    return "Soy Qualy AI, el asistente inteligente del sistema de gestión de calidad de Exportadora RomEx. Estoy integrado al QMS para apoyarte en el laboratorio.";
  }

  if (match(t, ["que puedes hacer", "que sabes", "en que ayudas", "ayuda", "help"])) {
    return "Puedo orientarte sobre Microbiología, Físico Químico, Gestión de Guías, el uso del dashboard, y responder consultas generales de laboratorio y calidad. Pregúntame lo que necesites.";
  }

  // —— Módulos del sistema ——
  if (match(t, ["microbiologia", "micro", "muestra", "muestras", "cultivo", "bacteria"])) {
    return "El módulo de Microbiología es el módulo uno del QMS. Está orientado al registro de muestras, análisis y seguimiento microbiológico. Pronto tendrás más funciones operativas dentro de ese módulo.";
  }

  if (match(t, ["fisico quimico", "fisico", "quimico", "ph", "acidez"])) {
    return "El módulo de Físico Químico es el módulo dos. Sirve para análisis físico-químicos del laboratorio. Forma parte del ecosistema QMS de RomEx.";
  }

  if (match(t, ["guia", "guias", "documento", "documentos", "procedimiento", "protocolo", "manual"])) {
    return "Las guías se gestionan en el módulo tres, Gestión de Guías. Allí puedes buscar, organizar y almacenar procedimientos y protocolos del laboratorio.";
  }

  if (match(t, ["dashboard", "inicio", "modulos", "sistema", "qms", "romex"])) {
    return "El dashboard de RomEx QMS es el punto central. Desde ahí accedes a Microbiología, Físico Químico, Gestión de Guías y a mí, Qualy AI. Un solo inicio de sesión para todo el ecosistema.";
  }

  if (match(t, ["login", "iniciar sesion", "contraseña", "password", "acceso"])) {
    return "El acceso al sistema es desde la pantalla de login. Con tu cuenta ingresas al QMS y quedas listo para usar los módulos sin volver a autenticarte en cada uno.";
  }

  // —— Laboratorio / calidad (conocimiento general) ——
  if (match(t, ["que es un laboratorio", "laboratorio"])) {
    return "Un laboratorio es un espacio controlado para realizar análisis, ensayos y controles de calidad. En RomEx el laboratorio apoya la inocuidad y la calidad de los productos de exportación.";
  }

  if (match(t, ["control de calidad", "calidad", "iso", "bpm", "buenas practicas"])) {
    return "El control de calidad verifica que los procesos y productos cumplan especificaciones. Incluye muestreo, análisis, registros y acciones correctivas. El QMS ayuda a ordenar esa gestión.";
  }

  if (match(t, ["muestra representativa", "como tomar muestra", "muestreo"])) {
    return "Una muestra representativa debe reflejar el lote o proceso que se evalúa. Usa utensilios limpios, identifica bien la muestra, evita contaminación cruzada y registra fecha, origen y responsable.";
  }

  if (match(t, ["contaminacion", "contaminacion cruzada", "asepsia"])) {
    return "Para reducir contaminación: limpia y desinfecta superficies, usa material estéril o limpio según el ensayo, separa zonas limpias y sucias, y registra cualquier desviación.";
  }

  if (match(t, ["ph"])) {
    return "El pH mide acidez o alcalinidad en una escala de 0 a 14. Siete es neutro, menor a siete es ácido y mayor a siete es alcalino. En laboratorio se calibra el pH-metro con buffers estándar.";
  }

  if (match(t, ["esterilizacion", "autoclave", "esteril"])) {
    return "La esterilización elimina microorganismos viables. El autoclave usa vapor a presión, típicamente alrededor de 121 grados Celsius. El tiempo y la carga deben validarse según el protocolo del laboratorio.";
  }

  if (match(t, ["temperatura", "cadena de frio", "refrigeracion"])) {
    return "La temperatura correcta preserva muestras y reactivos. Sigue el rango indicado en cada protocolo, registra lecturas y evita dejar material fuera de condición por tiempos prolongados.";
  }

  // —— Ciencia / general simple ——
  if (match(t, ["que hora", "hora es"])) {
    const now = new Date();
    return `Son aproximadamente las ${now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}.`
  }

  if (match(t, ["que dia", "fecha de hoy", "que fecha"])) {
    const now = new Date();
    return `Hoy es ${now.toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`
  }

  if (match(t, ["agua"])) {
    return "El agua es esencial en el laboratorio: como solvente, en lavado y en muchos ensayos. Según el análisis se usa agua potable, destilada o ultrapura.";
  }

  if (match(t, ["seguridad", "epp", "proteccion", "guantes", "lentes"])) {
    return "En laboratorio usa EPP según el riesgo: guantes, bata, lentes de protección y, si aplica, mascarilla. Conoce las hojas de seguridad de reactivos y la ubicación de lavaojos y extintores.";
  }

  // —— Cálculos simples ——
  const calc = trySimpleMath(t);
  if (calc) return calc;

  // —— Fallback inteligente ——
  if (t.length < 3) {
    return "No alcancé a entender. ¿Puedes repetirlo con un poco más de detalle?";
  }

  return (
    "Entendí tu consulta. Puedo ayudarte con el sistema RomEx QMS, módulos del laboratorio, guías, buenas prácticas y temas generales de calidad. " +
    "Si me das un poco más de contexto, te oriento mejor."
  );
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s+\-*/.=?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function match(text: string, keys: string[]): boolean {
  return keys.some((k) => text.includes(normalize(k)));
}

function trySimpleMath(text: string): string | null {
  // Ej: "cuanto es 12 + 5", "25*4", "100/5"
  const m = text.match(/(\d+(?:\.\d+)?)\s*([+\-*/x×])\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const a = parseFloat(m[1]);
  const op = m[2];
  const b = parseFloat(m[3]);
  let result: number;
  if (op === "+") result = a + b;
  else if (op === "-") result = a - b;
  else if (op === "*" || op === "x" || op === "×") result = a * b;
  else if (op === "/") {
    if (b === 0) return "No se puede dividir entre cero.";
    result = a / b;
  } else return null;
  return `El resultado es ${Number.isInteger(result) ? result : result.toFixed(4)}.`
}
