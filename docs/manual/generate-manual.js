"use strict";

/**
 * Genera docs/Manual-Usuario-Vellon.docx a partir de las capturas en /screenshots.
 * Uso: npm install && npm run generate
 */

const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  TableOfContents,
  Footer,
  PageNumber,
} = require("docx");

const ROOT = path.resolve(__dirname, "..", "..");
const SCREENSHOTS_DIR = path.join(ROOT, "screenshots");
const LOGO_PATH = path.join(
  ROOT,
  "frontend",
  "vellon-web",
  "src",
  "assets",
  "ovejitas",
  "logo.jpg"
);
const OUTPUT_PATH = path.join(ROOT, "docs", "Manual-Usuario-Vellon.docx");

const BRAND_BLUE = "0077B6";
const BRAND_CYAN = "29ABE2";
const BRAND_FONT = "Nunito";

const MAX_IMG_WIDTH_PX = 580;
const MAX_IMG_HEIGHT_PX = 700;

// ---------------------------------------------------------------------------
// Lectura de dimensiones de imagen sin dependencias externas (evita el CVE
// abierto de la librería npm "image-size" para formatos que no usamos).
// ---------------------------------------------------------------------------

function readPngSize(buffer) {
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readJpegSize(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      throw new Error("Marcador JPEG inválido");
    }
    const marker = buffer[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const length = buffer.readUInt16BE(offset + 2);
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  throw new Error("No se encontró el marcador SOF en el JPEG");
}

function getImageSize(filePath, buffer) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return readPngSize(buffer);
  if (ext === ".jpg" || ext === ".jpeg") return readJpegSize(buffer);
  throw new Error(`Formato de imagen no soportado: ${filePath}`);
}

function loadScreenshot(fileName, { maxWidth = MAX_IMG_WIDTH_PX, maxHeight = MAX_IMG_HEIGHT_PX } = {}) {
  const filePath = path.join(SCREENSHOTS_DIR, fileName);
  const data = fs.readFileSync(filePath);
  const { width, height } = getImageSize(filePath, data);
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  const type = path.extname(fileName).toLowerCase() === ".jpg" ? "jpg" : "png";

  return new ImageRun({
    type,
    data,
    transformation: {
      width: Math.round(width * scale),
      height: Math.round(height * scale),
    },
  });
}

// ---------------------------------------------------------------------------
// Helpers de contenido
// ---------------------------------------------------------------------------

function heading1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, text });
}

function heading2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, text });
}

function body(text) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text })],
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text })],
  });
}

function screenshot(fileName, captionText, opts) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 80 },
      children: [loadScreenshot(fileName, opts)],
    }),
  ];
  if (captionText) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({ text: captionText, italics: true, size: 20, color: "555555" })],
      })
    );
  }
  return children;
}

// ---------------------------------------------------------------------------
// Portada
// ---------------------------------------------------------------------------

const today = new Date().toLocaleDateString("es-CR", { year: "numeric", month: "long", day: "numeric" });
const logoData = fs.readFileSync(LOGO_PATH);
const logoSize = getImageSize(LOGO_PATH, logoData);
const logoScale = Math.min(180 / logoSize.width, 180 / logoSize.height, 1);

const coverPage = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1600, after: 400 },
    children: [
      new ImageRun({
        type: "jpg",
        data: logoData,
        transformation: {
          width: Math.round(logoSize.width * logoScale),
          height: Math.round(logoSize.height * logoScale),
        },
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "Manual de Usuario", bold: true, size: 56, color: BRAND_BLUE, font: BRAND_FONT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 },
    children: [
      new TextRun({
        text: "Sistema Vellon — Fundación Ovejitas de Costa Rica",
        size: 28,
        color: BRAND_CYAN,
        font: BRAND_FONT,
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: today, italics: true, size: 22 })],
  }),
];

// ---------------------------------------------------------------------------
// Índice
// ---------------------------------------------------------------------------

const indexPage = [
  new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, text: "Índice" }),
  new TableOfContents("Índice", { hyperlink: true, headingStyleRange: "1-2" }),
];

// ---------------------------------------------------------------------------
// Introducción
// ---------------------------------------------------------------------------

const introduction = [
  heading1("Introducción"),
  body(
    "Vellon es el sistema web de la Fundación Ovejitas de Costa Rica, una organización sin fines de lucro " +
      "orientada al apoyo de familias en condición de vulnerabilidad. El sistema centraliza la gestión de " +
      "donantes, voluntarios, actividades, proyectos y estudios socioeconómicos de las familias beneficiarias."
  ),
  body(
    "El sistema está dividido en dos partes claramente separadas:"
  ),
  bullet("Sitio Público: accesible sin necesidad de iniciar sesión, donde cualquier persona puede conocer a la fundación, ver sus actividades, ofrecerse como voluntaria o dejar sus datos de contacto."),
  bullet("Panel Administrativo: accesible solo para el personal de la fundación mediante inicio de sesión, donde se gestiona todo el contenido que luego se muestra en el sitio público."),
  body(
    "El ciclo clave del sistema es el siguiente: el personal administrativo crea o actualiza información " +
      "(por ejemplo, una actividad nueva) desde el panel administrativo; esa información se guarda en la base " +
      "de datos y el sitio público la muestra automáticamente, sin necesidad de ningún paso adicional."
  ),
];

// ---------------------------------------------------------------------------
// Sitio Público
// ---------------------------------------------------------------------------

const publicSite = [
  heading1("Sitio Público"),
  body(
    "Estas son las páginas que puede ver cualquier visitante del sitio, sin necesidad de una cuenta."
  ),

  heading2("Inicio"),
  body(
    "La página principal presenta el logo de la fundación, el eslogan \"Por un futuro mejor...\", una breve " +
      "descripción del propósito de Vellon y las 3 actividades más recientes, con un botón para \"Quiero colaborar\" " +
      "que lleva al formulario de contacto."
  ),
  ...screenshot("Vellon_Inicio.png", "Página de Inicio del sitio público"),

  heading2("Nosotros"),
  body(
    "Presenta la misión, visión e historia de la Fundación Ovejitas, además de sus datos de contacto."
  ),
  ...screenshot("Vellon_Nosotros.png", "Página Nosotros"),

  heading2("Actividades"),
  body(
    "Muestra el listado completo de actividades activas de la fundación, ordenadas de la más reciente a la más " +
      "antigua. Cada actividad se presenta como una tarjeta con título, descripción, fecha e imagen. Esta " +
      "información se actualiza automáticamente cada vez que el personal administrativo crea una nueva actividad " +
      "desde el panel administrativo."
  ),
  ...screenshot("Vellon_Actividades.png", "Página pública de Actividades"),

  heading2("Voluntariado"),
  body(
    "Cualquier persona interesada en colaborar como voluntaria puede llenar este formulario, indicando sus datos " +
      "personales, disponibilidad, habilidades, áreas de interés, referencias y motivación para unirse a la " +
      "fundación. Una vez enviado, la solicitud queda disponible para que el personal administrativo la revise " +
      "y actualice su estado (Pendiente, Activo o Inactivo)."
  ),
  ...screenshot("Vellon_Voluntariado.png", "Formulario público de Voluntariado — datos personales"),
  ...screenshot("Vellon_Voluntariado(1).png", "Formulario público de Voluntariado — disponibilidad y habilidades"),
  ...screenshot("Vellon_Voluntariado(2).png", "Formulario público de Voluntariado — motivación y envío"),

  heading2("Contacto"),
  body(
    "Formulario para que donantes o personas interesadas dejen sus datos y un mensaje. Al enviarlo con éxito, el " +
      "sitio muestra el mensaje \"¡Gracias! Tu información fue registrada. Nos pondremos en contacto contigo " +
      "pronto.\" El registro queda disponible para el personal administrativo en el panel."
  ),
  ...screenshot("Vellon_Contacto.png", "Página de Contacto"),
];

// ---------------------------------------------------------------------------
// Acceso al Panel Administrativo
// ---------------------------------------------------------------------------

const adminAccess = [
  heading1("Acceso al Panel Administrativo"),
  body(
    "El acceso al panel administrativo está reservado para el personal de la fundación. Se ingresa desde el " +
      "enlace discreto \"Personal administrativo\" ubicado a la derecha de la barra de navegación del sitio " +
      "público, o directamente desde la ruta /login."
  ),

  heading2("Inicio de sesión"),
  bullet("Ingresá tu usuario y contraseña en el formulario de inicio de sesión."),
  bullet("Si las credenciales son correctas, el sistema te redirige automáticamente al Dashboard del panel administrativo."),
  bullet("Si las credenciales son incorrectas, se muestra el mensaje \"Las credenciales ingresadas no son correctas.\""),

  heading2("¿Olvidaste tu contraseña?"),
  bullet("Hacé clic en \"¿Olvidaste tu contraseña?\" desde la pantalla de inicio de sesión."),
  bullet("Ingresá el correo electrónico asociado a tu cuenta de administrador."),
  bullet("Vas a recibir un correo con un enlace para restablecer tu contraseña, válido por 1 hora."),
  bullet("Al hacer clic en el enlace, se te pedirá ingresar y confirmar tu nueva contraseña."),
];

// ---------------------------------------------------------------------------
// Panel Administrativo
// ---------------------------------------------------------------------------

const adminPanel = [
  heading1("Panel Administrativo"),
  body(
    "Una vez dentro del panel, el personal administrativo cuenta con un menú lateral desde el cual puede acceder " +
      "a cada uno de los módulos de gestión. Las opciones visibles dependen del rol: la gestión de Usuarios " +
      "Administrativos está reservada únicamente al rol de SuperAdmin."
  ),

  heading2("Dashboard"),
  body(
    "Pantalla de inicio del panel administrativo. Muestra un resumen general del sistema mediante tarjetas de " +
      "estadísticas (contactos recibidos, actividades activas, voluntarios registrados, estudios socioeconómicos) " +
      "y da acceso rápido a todos los módulos de gestión."
  ),
  ...screenshot("Vellon_PA_Dashboard.png", "Dashboard del panel administrativo"),

  heading2("Gestión de Contactos y Donantes"),
  body(
    "Lista todos los registros enviados desde el formulario público de Contacto, con filtros por tipo (Donante, " +
      "Voluntario, Información) y por estado (leído / no leído). Desde el detalle de un contacto se puede marcar " +
      "como leído o eliminar el registro."
  ),
  ...screenshot("Vellon_PA_Contactos.png", "Listado de Contactos y Donantes"),
  ...screenshot("Vellon_PA_DetalleDeContacto.png", "Detalle de un contacto"),

  heading2("Gestión de Actividades"),
  body(
    "Permite crear, editar, activar/desactivar y eliminar las actividades de la fundación. Toda actividad marcada " +
      "como activa aparece automáticamente en la página pública de Actividades y, si es una de las 3 más " +
      "recientes, también en la página de Inicio."
  ),
  ...screenshot("Vellon_PA_Actividades.png", "Listado de Actividades en el panel administrativo"),
  ...screenshot("Vellon_PA_NuevaActividad.png", "Formulario para crear una nueva actividad"),

  heading2("Gestión de Voluntarios"),
  body(
    "Lista los voluntarios registrados —ya sea desde el formulario público o dados de alta manualmente por un " +
      "administrador— con filtros por estado. Desde el detalle de cada voluntario se puede consultar su " +
      "información completa y actualizar su estado (Pendiente, Activo o Inactivo)."
  ),
  ...screenshot("Vellon_PA_Voluntarios.png", "Listado de Voluntarios"),
  ...screenshot("Vellon_PA_DetalleDelVoluntario.png", "Detalle de un voluntario"),

  heading2("Estudios Socioeconómicos"),
  body(
    "Permite gestionar los estudios socioeconómicos de las familias beneficiarias. El formulario de creación está " +
      "dividido en varias secciones: núcleo familiar, ingresos, gastos, situación financiera, vivienda y menaje " +
      "del hogar."
  ),
  ...screenshot("Vellon_PA_Estudios.png", "Listado de Estudios Socioeconómicos"),
  ...screenshot("Vellon_PA_NuevoEstudio.png", "Nuevo estudio socioeconómico — núcleo familiar"),
  ...screenshot("Vellon_PA_NuevoEstudio(1).png", "Nuevo estudio socioeconómico — ingresos y gastos"),
  ...screenshot("Vellon_PA_NuevoEstudio(2).png", "Nuevo estudio socioeconómico — vivienda y menaje del hogar"),

  heading2("Gestión de Proyectos"),
  body(
    "Módulo de uso interno (sin vista pública) para dar seguimiento a los proyectos de la fundación: cronograma, " +
      "presupuesto y estado de avance. El formulario de creación incluye información general, descripción y " +
      "objetivos, beneficiarios, cronograma, presupuesto, responsable y notas."
  ),
  ...screenshot("Vellon_PA_Proyectos.png", "Listado de Proyectos"),
  ...screenshot("Vellon_PA_NuevoProyecto.png", "Nuevo proyecto — información general"),
  ...screenshot("Vellon_PA_NuevoProyecto(1).png", "Nuevo proyecto — cronograma y presupuesto"),
  ...screenshot("Vellon_PA_NuevoProyecto(2).png", "Nuevo proyecto — responsable y notas"),

  heading2("Usuarios Administrativos"),
  body(
    "Módulo visible únicamente para el rol SuperAdmin. Permite crear nuevas cuentas de personal administrativo, " +
      "activarlas o desactivarlas."
  ),
  ...screenshot("Vellon_PA_Usuarios.png", "Listado de Usuarios Administrativos"),
  ...screenshot("Vellon_PA_NuevoUsuario.png", "Formulario para crear un nuevo usuario administrativo"),
];

// ---------------------------------------------------------------------------
// Soporte
// ---------------------------------------------------------------------------

const support = [
  heading1("Soporte"),
  body("Ante cualquier duda o inconveniente con el sistema, podés contactar a la fundación:"),
  bullet("Contacto: Jessica Ramos Portillo — Coordinadora de Proyectos"),
  bullet("Email: vellonsoftware@gmail.com"),
  bullet("Teléfono: 6480-1020"),
];

// ---------------------------------------------------------------------------
// Documento
// ---------------------------------------------------------------------------

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: BRAND_FONT, size: 22 } },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: BRAND_FONT, size: 32, bold: true, color: BRAND_BLUE },
        paragraph: { spacing: { before: 240, after: 160 } },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: BRAND_FONT, size: 26, bold: true, color: BRAND_CYAN },
        paragraph: { spacing: { before: 200, after: 120 } },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" })],
            }),
          ],
        }),
      },
      children: [
        ...coverPage,
        ...indexPage,
        ...introduction,
        ...publicSite,
        ...adminAccess,
        ...adminPanel,
        ...support,
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Manual generado: ${OUTPUT_PATH} (${(buffer.length / 1024).toFixed(0)} KB)`);
});
