const CONFIG = {
  nombreEstudiante: "Nayeli Quispe Tica",
  codigoEstudiante: "U00057H",
  universidad: "Universidad Peruana Los Andes",
  supabaseUrl: "https://oxskwanusgxkawygmwr.supabase.co",
  supabaseAnonKey: "sb_publishable_T2rEz5dfO53oVe2yXMFfCA_qTNuieYW",
  supabaseBucket: "portafolio-evidencias"
};

function getSupabaseClient() {
  if (!window.supabase) return null;
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey || CONFIG.supabaseUrl.includes("TU_")) {
    return null;
  }
  return window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
}

const CURSOS = [
  {
    id: "algoritmo",
    codigo: "332141",
    nombre: "Algoritmo y Estructura de Datos",
    unidades: 4,          // 4 unidades
    semanasPorUnidad: 4,  // 4 semanas cada una (16 semanas en total)
    totalSemanas: 16
  },
  {
    id: "taller",
    codigo: "IS-102",
    nombre: "Taller de Apps",
    unidades: 2,          // 2 unidades exactas
    semanasPorUnidad: 8,  // 8 semanas cada unidad (16 semanas en total)
    totalSemanas: 16
  }
];

// Temas oficiales extraídos del sílabo UPLA para Algoritmos y Estructuras de Datos
const TEMAS_INICIALES_ALGORITMO = {
  1: "Arreglos Bidimensionales, representación y aplicaciones",
  2: "Arreglos paralelos, representación y uso de arreglos de objetos",
  3: "Clase ArrayList y Vector (Operaciones básicas)",
  4: "Clase Linked List y sus operaciones",
  5: "Pilas: TDA pila, definición, representación y operaciones",
  6: "Pilas de objetos y aplicaciones con pilas (Clase Stack)",
  7: "Colas: TDA cola, representación, operaciones y aplicaciones de colas",
  8: "Recursividad: Algoritmos de programación recursiva y múltiple",
  9: "Listas Simplemente Enlazadas (LSE): TDA, representación y operaciones",
  10: "Listas Circulares Simples (LCS): definición, representación y objetos",
  11: "Listas Doblemente Enlazadas (LDE): TDA, representación y operaciones",
  12: "Listas Circulares Dobles (LCD): TDA, representación y aplicaciones",
  13: "Árboles: TDA árbol, árboles generales, binarios y recorridos",
  14: "Grafos: TDA grafo, definición, representación y conexiones",
  15: "Métodos de ordenación, Búsqueda secuencial y Búsqueda binaria",
  16: "Exposición de trabajo final y evaluación de desempeño final"
};

function cargarDatos() {
  const claves = ["portafolio_datos_v10", "portafolio_datos_v9", "portafolio_datos_v8"];

  for (const clave of claves) {
    const guardado = localStorage.getItem(clave);
    if (guardado) {
      try {
        return JSON.parse(guardado);
      } catch (e) {
        console.warn("Datos guardados inválidos en", clave, e);
      }
    }
  }

  let datosIniciales = {};
  CURSOS.forEach(curso => {
    datosIniciales[curso.id] = { semanas: {} };
    for (let i = 1; i <= curso.totalSemanas; i++) {
      let unidadActual = Math.ceil(i / curso.semanasPorUnidad);

      let temaSugerido = "";
      if (curso.id === "algoritmo" && TEMAS_INICIALES_ALGORITMO[i]) {
        temaSugerido = TEMAS_INICIALES_ALGORITMO[i];
      } else if (curso.id === "taller" && TEMAS_INICIALES_TALLER[i]) {
        temaSugerido = TEMAS_INICIALES_TALLER[i];
      }

      datosIniciales[curso.id].semanas[i] = {
        unidad: unidadActual,
        tema: temaSugerido,
        entregas: []
      };
    }
  });
  return datosIniciales;
}

function guardarDatos(datos) {
  try {
    localStorage.setItem("portafolio_datos_v10", JSON.stringify(datos));
  } catch (error) {
    console.error("No se pudo guardar en localStorage:", error);
    alert("El navegador no pudo guardar todas las imágenes. Prueba con menos fotos o imágenes más pequeñas.");
    throw error;
  }
}

function leerArchivoComoDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

function comprimirImagen(file, maxWidth = 1400, quality = 0.72) {
  if (!file || !file.type || !file.type.startsWith("image/")) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(1, maxWidth / Math.max(img.width, img.height));
        canvas.width = Math.max(1, Math.round(img.width * ratio));
        canvas.height = Math.max(1, Math.round(img.height * ratio));

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("No se pudo cargar la imagen."));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

async function crearEntregaDesdeArchivo(file) {
  const clienteSupabase = getSupabaseClient();

  if (clienteSupabase) {
    try {
      const nombreSeguro = (file.name || "archivo").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "_");
      const ruta = `${Date.now()}-${nombreSeguro}`;
      const bucket = CONFIG.supabaseBucket || "portafolio-evidencias";
      const { data, error } = await clienteSupabase.storage
        .from(bucket)
        .upload(ruta, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "application/octet-stream"
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = clienteSupabase.storage.from(bucket).getPublicUrl(data.path);

      return {
        tipo: "archivo",
        nombre: file.name,
        tipoMime: file.type,
        tamanio: Math.round(file.size / 1024) + " KB",
        dataUrl: publicUrlData.publicUrl,
        blobUrl: publicUrlData.publicUrl,
        urlPublica: publicUrlData.publicUrl
      };
    } catch (error) {
      console.warn("Fallo al subir a Supabase; se usará respaldo local:", error);
    }
  }

  let dataUrl = null;
  if (file.type.startsWith("image/")) {
    dataUrl = await comprimirImagen(file);
  }
  if (!dataUrl) {
    dataUrl = await leerArchivoComoDataUrl(file);
  }

  const blobUrl = typeof URL !== "undefined" && URL.createObjectURL ? URL.createObjectURL(file) : dataUrl;

  return {
    tipo: "archivo",
    nombre: file.name,
    tipoMime: file.type,
    tamanio: Math.round(file.size / 1024) + " KB",
    dataUrl: dataUrl,
    blobUrl: blobUrl,
    urlPublica: dataUrl
  };
}

// Temas oficiales del sílabo UPLA - Desarrollo de Aplicaciones I
const TEMAS_INICIALES_TALLER = {
  1: "Inicialización del Proyecto y Ventanas Principales (JFrame)",
  2: "Organización del Espacio con Contenedores (JPanel, JScrollPane)",
  3: "Implementación de Menús de Navegación (JMenuBar, JMenu, JMenuItem)",
  4: "Integración de Componentes Básicos y Validación Visual",
  5: "Gestión de Archivos y Persistencia de Datos Locales (JFileChooser)",
  6: "Personalización Visual Avanzada e Identidad del Proyecto (Look and Feel)",
  7: "Diseño de Interfaces Complejas con Tablas y Listas (JTable, JList, JComboBox)",
  8: "Orquestación de Mensajes, Diálogos de Usuario y Cierre de Fase (JOptionPane)",
  9: "Conectividad y Configuración del Driver de Base de Datos (JDBC)",
  10: "Operaciones de Persistencia: Inserción y Lectura de Datos (CRUD: Insert/Select)",
  11: "Operaciones de Persistencia II: Actualización, Eliminación y Transacciones",
  12: "Vinculación Dinámica y Cierre de la Capa de Datos",
  13: "Migración a Arquitectura Cliente-Servidor e Hilos",
  14: "Depuración, Manejo de Excepciones y Pruebas del Sistema",
  15: "Compilación y Generación del Archivo Ejecutable (.jar)",
  16: "Sustentación del Proyecto Final y Cierre de Curso"
};