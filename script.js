/* ================== CONFIGURACIÓN ================== */
const CONFIG = {
  nombreEstudiante: "Nayeli Quispe Tica",
  codigoEstudiante: "U00057H",
  universidad: "Universidad Peruana Los Andes",
  claveAdministrador: "1234",
  usuario: "ticaruth06-jpg",
  repo: "MI-PORTAFOLIO-ACADEMICO",
  rama: "main",
  outlook: "https://outlook.office.com/mail/",
  intranet: "https://intranet.upla.edu.pe/sesion",
  aulaVirtual: "https://uplavirtual.instructure.com/login/canvas"
};

const CURSOS = [
  {
    id: "algoritmo", codigo: "332141", nombre: "Algoritmo y Estructura de Datos", icono: "🧮", cls: "c-algoritmo",
    unidades: 4, semanasPorUnidad: 4, totalSemanas: 16,
    colores: [["#0a56b4", "#27d3ff"], ["#6a3df0", "#27d3ff"], ["#0aa57a", "#2de2a6"], ["#e08a00", "#ffc83d"]]
  },
  {
    id: "taller", codigo: "IS-102", nombre: "Desarrollo de Aplicaciones", icono: "💻", cls: "c-taller",
    unidades: 2, semanasPorUnidad: 8, totalSemanas: 16,
    colores: [["#6a3df0", "#ff5fa2"], ["#e0307a", "#ffc83d"]]
  }
];

// Temas oficiales del sílabo UPLA - Algoritmos y Estructuras de Datos
const TEMAS_INICIALES_ALGORITMO = {
  1: "Arreglos Unidimensionales",
  2: "Arreglos Bidimensionales",
  3: "Arreglos paralelos",
  4: "Arreglos de Objetos",
  5: "ArrayList",
  6: "Pilas de objetos y aplicaciones con pilas",
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

// Temas oficiales del sílabo UPLA - Desarrollo de Aplicaciones I
const TEMAS_INICIALES_TALLER = {
  1: "Diseño, que es Maven y Pom.xml",
  2: "Aplicacion en Maven, Web Application",
  3: "Programación Orientada a Objetos en Web Application",
  4: "Diseño de una pagina web en Maven",
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

/* ================== ESTADO ================== */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const CLAVE_ROL = "portafolio_rol";
let rol = sessionStorage.getItem(CLAVE_ROL) || "";
let cursoActual = "algoritmo";
let openSem = null;
let RAMA = CONFIG.rama;
const abiertas = new Set();          // semanas con la lista de evidencias desplegada

function crearDatosIniciales() {
  const d = {};
  CURSOS.forEach(c => {
    d[c.id] = { semanas: {} };
    for (let i = 1; i <= c.totalSemanas; i++) {
      const t = c.id === "algoritmo" ? TEMAS_INICIALES_ALGORITMO[i] : TEMAS_INICIALES_TALLER[i];
      d[c.id].semanas[i] = { unidad: Math.ceil(i / c.semanasPorUnidad), tema: t || "", temaPath: null, entregas: [] };
    }
  });
  return d;
}
let datos = crearDatosIniciales();

/* ================== UTILIDADES ================== */
function toast(m, ms = 3500) {
  const t = $("#toast"); t.textContent = m; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), ms);
}
const fmtSize = b => !b ? "" : b < 1024 ? b + " B" : b < 1048576 ? Math.max(1, Math.round(b / 1024)) + " KB" : (b / 1048576).toFixed(1) + " MB";
const extension = n => (String(n).split(".").pop() || "").toLowerCase();
const esImagen = e => e && e.tipo === "archivo" && ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "avif"].includes(extension(e.nombre));
const esPdf = e => e && e.tipo === "archivo" && extension(e.nombre) === "pdf";
function icono(e) {
  if (e.tipo === "enlace") return "🔗";
  const x = extension(e.nombre);
  if (esImagen(e)) return "🖼️";
  if (["zip", "rar", "7z", "gz"].includes(x)) return "📦";
  if (x === "pdf") return "📕";
  if (["doc", "docx", "odt"].includes(x)) return "📘";
  if (["xls", "xlsx", "csv"].includes(x)) return "📗";
  if (["ppt", "pptx"].includes(x)) return "📙";
  if (["java", "js", "html", "css", "py", "c", "cpp", "sql", "json", "txt", "md", "jar"].includes(x)) return "📄";
  return "📁";
}
const semDe = (cid, n) => datos[cid].semanas[n];
const semActual = () => semDe(openSem.cid, openSem.num);
const cursoDe = id => CURSOS.find(c => c.id === id);
const pad = n => String(n).padStart(2, "0");
const rangoSemanas = (c, u) => { const s = (u - 1) * c.semanasPorUnidad + 1; return Array.from({ length: c.semanasPorUnidad }, (_, i) => s + i); };

/* ================== LECTURA DE ENTREGAS (GitHub, visible para todos) ================== */
function infoRepo() {
  const h = location.hostname, p = location.pathname.split("/").filter(Boolean);
  if (h.endsWith(".github.io") && p[0] && !p[0].includes(".")) return { usuario: h.split(".")[0], repo: p[0] };
  if (h.endsWith(".github.io")) return { usuario: h.split(".")[0], repo: h };
  return { usuario: CONFIG.usuario, repo: CONFIG.repo };
}
async function cargarEntregasPublicadas(d) {
  const { usuario, repo } = infoRepo();
  let arbol = null;
  try {
    const c = JSON.parse(sessionStorage.getItem("arbol_v2") || "null");
    if (c && Date.now() - c.t < 60000) { arbol = c.d; RAMA = c.r || RAMA; }
  } catch (e) {}
  if (!arbol) {
    for (const br of [...new Set([CONFIG.rama, "main", "master"])]) {
      try {
        const r = await fetch(`https://api.github.com/repos/${usuario}/${repo}/git/trees/${br}?recursive=1`);
        if (!r.ok) continue;
        arbol = (await r.json()).tree; RAMA = br;
        try { sessionStorage.setItem("arbol_v2", JSON.stringify({ t: Date.now(), d: arbol, r: br })); } catch (e) {}
        break;
      } catch (e) {}
    }
  }
  if (!arbol) return false;
  const tareas = [];
  for (const n of arbol) {
    const m = n.type === "blob" && n.path.match(/^entregas\/([^/]+)\/semana-(\d+)\/(.+)$/);
    if (!m || !d[m[1]]) continue;
    const sem = d[m[1]].semanas[parseInt(m[2], 10)];
    if (!sem) continue;
    const url = n.path.split("/").map(encodeURIComponent).join("/");
    const nombre = m[3];
    if (nombre.toLowerCase() === "tema.txt") {
      sem.temaPath = n.path;
      tareas.push(fetch(url + "?v=" + Date.now()).then(r => r.text()).then(t => { t = t.trim(); if (t) sem.tema = t; }).catch(() => {}));
    } else if (/^enlaces?.*\.txt$/i.test(nombre)) {
      tareas.push(fetch(url + "?v=" + Date.now()).then(r => r.text()).then(t => {
        const ls = t.split(/\r?\n/).map(x => x.trim()).filter(x => /^https?:\/\//i.test(x));
        ls.forEach(x => sem.entregas.push({ tipo: "enlace", valor: x, path: n.path, nEnlaces: ls.length }));
      }).catch(() => {}));
    } else {
      sem.entregas.push({ tipo: "archivo", nombre, url, path: n.path, size: n.size || 0 });
    }
  }
  await Promise.all(tareas);
  const ord = (a, b) => String(a.nombre || a.valor).localeCompare(String(b.nombre || b.valor), "es", { numeric: true, sensitivity: "base" });
  CURSOS.forEach(c => Object.values(d[c.id].semanas).forEach(sm =>
    sm.entregas.sort((a, b) => a.tipo === b.tipo ? ord(a, b) : (a.tipo === "archivo" ? -1 : 1))));
  return true;
}

/* ================== ENLACES A GITHUB (administradora, sin llaves) ================== */
const carpetaSemana = (cid, n) => `entregas/${cid}/semana-${pad(n)}`;
function urlSubir(cid, n) {
  const { usuario, repo } = infoRepo();
  return `https://github.com/${usuario}/${repo}/upload/${RAMA}/${carpetaSemana(cid, n)}`;
}
function urlNuevoEnlace(cid, n, enlace) {
  const { usuario, repo } = infoRepo();
  if (!/^https?:\/\//i.test(enlace)) enlace = "https://" + enlace;
  return `https://github.com/${usuario}/${repo}/new/${RAMA}/${carpetaSemana(cid, n)}?filename=${encodeURIComponent("enlace-" + Date.now() + ".txt")}&value=${encodeURIComponent(enlace)}`;
}
function urlTema(cid, n, sem, texto) {
  const { usuario, repo } = infoRepo();
  return sem.temaPath
    ? `https://github.com/${usuario}/${repo}/edit/${RAMA}/${sem.temaPath.split("/").map(encodeURIComponent).join("/")}`
    : `https://github.com/${usuario}/${repo}/new/${RAMA}/${carpetaSemana(cid, n)}?filename=tema.txt&value=${encodeURIComponent(texto)}`;
}

/* ================== RENDER ================== */
function progreso(c) {
  let hechas = 0;
  for (let i = 1; i <= c.totalSemanas; i++) if (semDe(c.id, i).entregas.length) hechas++;
  return { hechas, total: c.totalSemanas };
}
function totalEntregas() {
  let t = 0; CURSOS.forEach(c => Object.values(datos[c.id].semanas).forEach(s => t += s.entregas.length)); return t;
}
function renderAll(anim) { renderCourses(); renderUnits(anim); countTo($("#statWorks"), totalEntregas()); }

function renderCourses() {
  $("#courses").innerHTML = CURSOS.map(c => {
    const p = progreso(c), pct = Math.round(p.hechas / p.total * 100), R = 34, C = 2 * Math.PI * R;
    return `<div class="course ${c.cls} ${c.id === cursoActual ? "active" : ""} reveal in" data-course="${c.id}">
      <div class="top"><div><div class="ico">${c.icono}</div><span class="code">${esc(c.codigo)}</span><h3>${esc(c.nombre)}</h3>
      <p>${c.unidades} Unidades Académicas (${c.semanasPorUnidad} semanas por unidad)</p></div>
      <div class="ring"><svg width="78" height="78"><circle class="t" cx="39" cy="39" r="${R}"/><circle class="p" cx="39" cy="39" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/></svg><b>${pct}%</b></div></div>
      <div class="meta">${p.hechas}/${p.total} semanas con tareas · ${c.id === cursoActual ? "✔ Viendo este curso" : "Toca para ingresar"}</div></div>`;
  }).join("");
}

const textoToggle = (abierta, n) => (abierta ? "📄 Ocultar evidencias" : "📄 Ver evidencias") + (n ? ` (${n})` : "");

function cardSemana(c, n, i) {
  const s = semDe(c.id, n), cnt = s.entregas.length, abierta = abiertas.has(c.id + "-" + n), admin = rol === "admin";
  const lista = cnt ? s.entregas.map((e, k) => {
    const des = admin ? `<button class="action-btn danger" type="button" data-del="${k}">🗑 Descartar</button>` : "";
    if (e.tipo === "enlace") return `<li><span class="entry-icon">🔗</span><a class="entry-link" href="${esc(e.valor)}" target="_blank" rel="noopener">${esc(e.valor)}</a><div class="entry-actions">${des}</div></li>`;
    return `<li><span class="entry-icon">${icono(e)}</span><button class="entry-link" type="button" data-ver="${k}" title="${esc(e.nombre)}">${esc(e.nombre)}${e.size ? " (" + fmtSize(e.size) + ")" : ""}</button>
      <div class="entry-actions"><button class="action-btn" type="button" data-ver="${k}">👁️ Ver</button><button class="action-btn" type="button" data-desc="${k}">📥 Descargar</button>${des}</div></li>`;
  }).join("") : `<li><span class="empty-note">Sin evidencias adjuntas todavía.</span></li>`;
  const caja = admin ? `<div class="admin-box">
      <div class="row-form"><input class="in-tema" type="text" value="${esc(s.tema)}" placeholder="Tema de la semana"><button class="mini btn-tema" type="button">✏️ Guardar tema</button></div>
      <a class="add-btn subir-github" href="${urlSubir(c.id, n)}" target="_blank" rel="noopener">➕ Subir archivos (PDF, ZIP, imágenes, carpetas)</a>
      <div class="upload-row"><input class="in-enlace" type="url" placeholder="Pega aquí el enlace (https://...)"><button class="add-btn btn-enlace" type="button">🔗 Añadir enlace</button></div>
      <div class="note">⏳ Lo que subas se verá en aproximadamente 1 minuto. Si te equivocas, usa <b>🗑 Descartar</b>. <button class="mini btn-refresh" type="button">↻ Actualizar lista</button></div>
    </div>` : "";
  return `<div class="week ${cnt ? "has" : ""} ${abierta ? "open" : ""}" data-c="${c.id}" data-s="${n}" style="animation-delay:${i * 45}ms">
    <div class="wn"><span>Semana ${n}</span><span class="pill">${cnt ? "✓ Entregado" : "• Pendiente"}</span></div>
    <div class="tp ${s.tema ? "" : "empty"}">${s.tema ? esc(s.tema) : "Tema por definir"}</div>
    <button class="toggle-btn" type="button">${textoToggle(abierta, cnt)}</button>
    <div class="week-panel">${caja}<ul class="entries">${lista}</ul></div></div>`;
}

function renderUnits(anim) {
  const c = cursoDe(cursoActual); let h = "";
  $("#units").classList.toggle("anim", !!anim);
  for (let u = 1; u <= c.unidades; u++) {
    const sems = rangoSemanas(c, u);
    const unidadTallerDos = c.id === "taller" && u === 2;
    const unidadAlgoritmoTres = c.id === "algoritmo" && u === 3;
    const unidadAlgoritmoCuatro = c.id === "algoritmo" && u === 4;
    const [c1, c2] = unidadTallerDos ? ["#32145f", "#1266bd"]
      : unidadAlgoritmoTres ? ["#701f3d", "#a34d69"]
        : unidadAlgoritmoCuatro ? ["#3b2618", "#805536"]
          : c.colores[u - 1];
    const claseColorUnidad = unidadTallerDos ? " taller-unit-2"
      : unidadAlgoritmoTres ? " algoritmo-unit-3"
        : unidadAlgoritmoCuatro ? " algoritmo-unit-4" : "";
    h += `<section class="unit reveal in${claseColorUnidad}" style="--c1:${c1};--c2:${c2}"><div class="unit-head"><div class="num" style="background:linear-gradient(135deg,${c1},${c2})">${u}</div>
      <div><h3>Unidad Didáctica ${u}</h3><span>Semanas ${sems[0]} a ${sems[sems.length - 1]}</span></div><div class="line"></div></div><div class="weeks">`;
    sems.forEach((n, i) => { h += cardSemana(c, n, i); });
    h += "</div></section>";
  }
  $("#units").innerHTML = h;
}
function selectCourse(id) { cursoActual = id; renderAll(true); }
function irACurso(id) { selectCourse(id); setTimeout(() => $("#units").scrollIntoView({ behavior: "smooth", block: "start" }), 50); }
function irASemana(cid, n) {
  cursoActual = cid; abiertas.add(cid + "-" + n); renderAll(true);
  setTimeout(() => {
    const el = document.querySelector(`.week[data-c="${cid}"][data-s="${n}"]`);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 2400); }
  }, 80);
}

/* ================== SESIÓN (solo la administradora) ================== */
function applyRole() {
  document.body.classList.toggle("is-admin", rol === "admin");
  const b = $("#roleBadge");
  b.style.display = rol ? "" : "none"; b.className = "badge admin"; b.textContent = "🎓 Administradora";
  $("#btnLogin").style.display = rol ? "none" : "";
  $("#btnLogout").style.display = rol ? "" : "none";
}
function cerrarVentanas() { document.querySelectorAll(".overlay").forEach(o => o.classList.remove("show")); }
$("#btnLogin").onclick = () => { $("#loginOv").classList.add("show"); setTimeout(() => $("#passIn").focus(), 60); };
$("#btnLogout").onclick = () => { rol = ""; sessionStorage.removeItem(CLAVE_ROL); applyRole(); cerrarVentanas(); renderAll(); toast("Sesión cerrada"); };
function loginAdmin() {
  if ($("#passIn").value === CONFIG.claveAdministrador) {
    rol = "admin"; sessionStorage.setItem(CLAVE_ROL, rol); applyRole(); cerrarVentanas(); renderAll();
    $("#passIn").value = ""; $("#loginErr").style.display = "none";
    confetti(); toast("¡Hola Nayeli! Ahora puedes subir tus tareas y descartar las que te equivoques 🎉", 4500);
  } else {
    $("#loginErr").style.display = "block";
    const m = $("#pane-admin"); m.classList.remove("shake"); void m.offsetWidth; m.classList.add("shake");
  }
}
$("#loginAdmin").onclick = loginAdmin;
$("#passIn").addEventListener("keydown", e => { if (e.key === "Enter") loginAdmin(); });

/* ================== ADMINISTRADORA ================== */
function accionEnlace(card, cid, num) {
  const inp = card.querySelector(".in-enlace"), v = inp.value.trim();
  if (!v) { toast("Escribe o pega un enlace primero."); inp.focus(); return; }
  window.open(urlNuevoEnlace(cid, num, v), "_blank", "noopener");
  toast('Se abrió GitHub: pulsa "Commit new file" para guardar el enlace', 6500);
  inp.value = "";
}
function accionTema(card, cid, num) {
  const v = card.querySelector(".in-tema").value.trim();
  if (!v) { toast("Escribe el tema primero."); return; }
  const s = semDe(cid, num);
  if (s.temaPath) {
    try { navigator.clipboard.writeText(v).catch(() => {}); } catch (e) {}
    toast("Se abrirá GitHub: borra el texto anterior, pega el nuevo tema (Ctrl+V) y pulsa Commit changes", 8000);
  } else toast('Se abrió GitHub con el tema listo: solo pulsa "Commit new file"', 6500);
  window.open(urlTema(cid, num, s, v), "_blank", "noopener");
}

function descartar(it) {
  if (!it || rol !== "admin") return;
  const { usuario, repo } = infoRepo();
  const solo = it.tipo !== "enlace" || (it.nEnlaces || 1) <= 1;
  const nombre = it.tipo === "enlace" ? it.valor : it.nombre;
  const aviso = solo
    ? "Se abrirá GitHub: pulsa el botón verde “Commit changes” para borrarlo definitivamente."
    : "Este enlace está en un archivo con varios enlaces. Se abrirá GitHub para que borres solo esa línea y pulses “Commit changes”.";
  if (!confirm("¿Descartar “" + nombre + "”?\n\n" + aviso)) return;
  window.open(`https://github.com/${usuario}/${repo}/${solo ? "delete" : "edit"}/${RAMA}/${it.path.split("/").map(encodeURIComponent).join("/")}`, "_blank", "noopener");
  toast("Cuando termines en GitHub, vuelve aquí: la lista se actualiza sola 🔄", 7000);
}
let recargando = false, ultimaRecarga = Date.now();
async function recargar(avisar) {
  if (recargando) return; recargando = true;
  try {
    try { sessionStorage.removeItem("arbol_v2"); } catch (e) {}
    const nuevo = crearDatosIniciales();
    if (await cargarEntregasPublicadas(nuevo)) {
      datos = nuevo; renderAll();
      if (avisar) toast("Lista actualizada ✔");
    } else if (avisar) toast("No se pudo actualizar. Intenta en unos minutos.", 5000);
  } finally { recargando = false; ultimaRecarga = Date.now(); }
}
document.addEventListener("visibilitychange", () => {      // al volver de GitHub, se actualiza sola
  if (document.visibilityState === "visible" && rol === "admin" && Date.now() - ultimaRecarga > 8000) recargar(false);
});

/* ================== VISOR (imagen con zoom, PDF) ================== */
const V = { z: 1, x: 0, y: 0, list: [], i: 0 };
const MAXZ = 6;
function aplicarV() {
  const img = $("#vImg"), st = $("#vStage");
  // límites: la imagen ampliada no se puede arrastrar fuera de la pantalla
  const lx = Math.max(0, (img.offsetWidth * V.z - st.clientWidth) / 2) + 90;
  const ly = Math.max(0, (img.offsetHeight * V.z - st.clientHeight) / 2) + 90;
  V.x = Math.max(-lx, Math.min(lx, V.x)); V.y = Math.max(-ly, Math.min(ly, V.y));
  img.style.transform = `translate(${V.x}px,${V.y}px) scale(${V.z})`;
  img.style.cursor = V.z > 1 ? "grab" : "zoom-in";
  $("#vZoom").textContent = Math.round(V.z * 100) + "%";
}
function zoomEn(factor, cx, cy) {            // cx, cy: posición respecto al centro del visor
  const nz = Math.min(MAXZ, Math.max(1, V.z * factor)), k = nz / V.z;
  V.x = cx - (cx - V.x) * k; V.y = cy - (cy - V.y) * k; V.z = nz;
  if (V.z <= 1.001) { V.z = 1; V.x = 0; V.y = 0; }
  aplicarV();
}
function centroRel(e) { const r = $("#vStage").getBoundingClientRect(); return [e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)]; }
function descargar(url, nombre) {
  const a = document.createElement("a"); a.href = url; a.download = nombre || "archivo"; a.rel = "noopener";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
function abrirVisor(it) {
  if (!it) return;
  const imgs = semActual().entregas.filter(esImagen);
  V.list = esImagen(it) ? imgs : [it]; V.i = Math.max(0, V.list.indexOf(it));
  $("#toast").classList.remove("show");
  $("#viewer").classList.add("show"); document.body.style.overflow = "hidden";
  mostrarVisor(true);
}
function mostrarVisor(anim) {
  const it = V.list[V.i], img = $("#vImg"), fr = $("#vFrame"), info = $("#vInfo"), vw = $("#viewer");
  $("#vTitle").textContent = it.nombre + (V.list.length > 1 ? `   (${V.i + 1}/${V.list.length})` : "");
  img.style.display = "none"; fr.style.display = "none"; info.style.display = "none"; fr.src = "about:blank";
  V.z = 1; V.x = 0; V.y = 0;
  vw.classList.toggle("noimg", !esImagen(it));
  if (esImagen(it)) {
    img.src = it.url; img.alt = it.nombre; img.style.display = "block"; aplicarV();
    img.classList.remove("grow"); void img.offsetWidth; if (anim) img.classList.add("grow");
  } else if (esPdf(it)) {
    fr.src = it.url; fr.style.display = "block";
  } else {
    info.style.display = "block";
    info.innerHTML = `<div class="vinfo"><div style="font-size:3rem">${icono(it)}</div><h3>Este archivo no tiene vista previa en el navegador</h3><p>Los archivos Word, ZIP, RAR o de código deben descargarse y abrirse con su programa.</p></div>`;
  }
  $("#vPrev").style.display = $("#vNext").style.display = V.list.length > 1 ? "" : "none";
}
function cerrarVisor() { $("#viewer").classList.remove("show"); $("#vFrame").src = "about:blank"; document.body.style.overflow = ""; }
const pasoVisor = d => { V.i = (V.i + d + V.list.length) % V.list.length; mostrarVisor(true); };
$("#vPrev").onclick = () => pasoVisor(-1);
$("#vNext").onclick = () => pasoVisor(1);
$("#vClose").onclick = cerrarVisor;
$("#vIn").onclick = () => zoomEn(1.4, 0, 0);
$("#vOut").onclick = () => zoomEn(1 / 1.4, 0, 0);
$("#vReset").onclick = () => { V.z = 1; V.x = 0; V.y = 0; aplicarV(); };
$("#vDl").onclick = () => { const it = V.list[V.i]; descargar(it.url, it.nombre.split("/").pop()); };
$("#vStage").addEventListener("wheel", e => {
  if (!esImagen(V.list[V.i])) return;
  e.preventDefault(); const [cx, cy] = centroRel(e); zoomEn(e.deltaY < 0 ? 1.25 : 0.8, cx, cy);
}, { passive: false });
(function () {
  const img = $("#vImg"), ptrs = new Map(); let drag = null, pinch = null, moved = 0;
  img.addEventListener("pointerdown", e => {
    img.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = 0;
    if (ptrs.size === 1) { drag = { sx: e.clientX, sy: e.clientY, ox: V.x, oy: V.y }; if (V.z > 1) img.classList.add("dragging"); }
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: V.z }; img.classList.add("dragging"); }
  });
  img.addEventListener("pointermove", e => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2 && pinch) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      const nz = Math.min(MAXZ, Math.max(1, pinch.z * d / pinch.d)), k = nz / V.z;
      V.x *= k; V.y *= k; V.z = nz; if (V.z <= 1.001) { V.z = 1; V.x = V.y = 0; }
      aplicarV(); moved = 99; return;
    }
    if (drag && ptrs.size === 1) {
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy; moved = Math.max(moved, Math.hypot(dx, dy));
      if (V.z > 1) { V.x = drag.ox + dx; V.y = drag.oy + dy; aplicarV(); }
    }
  });
  const fin = e => {
    const eraUno = ptrs.size === 1; ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    img.classList.remove("dragging");
    if (e.type === "pointerup" && eraUno && moved < 6) {          // un clic: acerca o aleja
      if (V.z > 1) { V.z = 1; V.x = 0; V.y = 0; aplicarV(); }
      else { const [cx, cy] = centroRel(e); zoomEn(2.5, cx, cy); }
    }
    drag = null;
  };
  img.addEventListener("pointerup", fin); img.addEventListener("pointercancel", fin);
})();

/* ================== EVENTOS ================== */
document.querySelectorAll("[data-close]").forEach(b => b.onclick = cerrarVentanas);
document.querySelectorAll(".overlay").forEach(o => o.addEventListener("mousedown", e => { if (e.target === o) cerrarVentanas(); }));
document.addEventListener("keydown", e => {
  if ($("#viewer").classList.contains("show")) {
    if (e.key === "Escape") cerrarVisor();
    else if (e.key === "ArrowLeft" && V.list.length > 1) pasoVisor(-1);
    else if (e.key === "ArrowRight" && V.list.length > 1) pasoVisor(1);
    else if (e.key === "+" || e.key === "=") zoomEn(1.4, 0, 0);
    else if (e.key === "-") zoomEn(1 / 1.4, 0, 0);
    else if (e.key === "0") { V.z = 1; V.x = 0; V.y = 0; aplicarV(); }
    return;
  }
  if (e.key === "Escape") { cerrarVentanas(); cerrarChat(); }
});
document.addEventListener("click", e => {
  const dl = e.target.closest("[data-del]"); if (dl) { descartar(semActual().entregas[+dl.dataset.del]); return; }
  const v = e.target.closest("[data-ver]"); if (v) { abrirVisor(semActual().entregas[+v.dataset.ver]); return; }
  const d = e.target.closest("[data-desc]"); if (d) { const it = semActual().entregas[+d.dataset.desc]; descargar(it.url, it.nombre.split("/").pop()); return; }
  const cc = e.target.closest("[data-course]");
  if (cc) { irACurso(cc.dataset.course); return; }
});
$("#units").addEventListener("click", e => {        // acciones dentro de cada tarjeta de semana
  const card = e.target.closest(".week"); if (!card) return;
  const cid = card.dataset.c, num = +card.dataset.s, key = cid + "-" + num;
  openSem = { cid, num };
  if (e.target.closest(".toggle-btn")) {
    const abre = !card.classList.contains("open");
    card.classList.toggle("open", abre); abre ? abiertas.add(key) : abiertas.delete(key);
    card.querySelector(".toggle-btn").textContent = textoToggle(abre, semDe(cid, num).entregas.length);
  } else if (e.target.closest(".btn-tema")) accionTema(card, cid, num);
  else if (e.target.closest(".btn-enlace")) accionEnlace(card, cid, num);
  else if (e.target.closest(".btn-refresh")) recargar(true);
});
window.addEventListener("scroll", () => $("#nav").classList.toggle("solid", scrollY > 40), { passive: true });

/* ================== EFECTOS ================== */
function countTo(el, n) {
  const from = +el.dataset.cur || 0; el.dataset.cur = n;
  if (from === n && el.textContent == n) return;
  const t0 = performance.now(), dur = 900;
  (function f(t) { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(from + (n - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
}
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); const c = en.target.querySelector("[data-count]"); if (c) countTo(c, +c.dataset.count); io.unobserve(en.target); }
}), { threshold: .2 });
document.querySelectorAll(".reveal").forEach(el => { if (!el.classList.contains("in")) io.observe(el); });

(function () {   // máquina de escribir
  const frases = ["Estudiante de la " + CONFIG.universidad, "Algoritmo y Estructura de Datos", "Desarrollo de Aplicaciones", "Programando mi futuro 🚀"];
  let i = 0, j = 0, del = false; const el = $("#typed");
  (function tick() {
    const f = frases[i]; el.textContent = f.slice(0, j);
    if (!del && j < f.length) { j++; setTimeout(tick, 60); }
    else if (!del) { del = true; setTimeout(tick, 1600); }
    else if (j > 0) { j--; setTimeout(tick, 28); }
    else { del = false; i = (i + 1) % frases.length; setTimeout(tick, 300); }
  })();
})();

(function () {   // partículas de fondo
  const cv = $("#bg"), cx = cv.getContext("2d"); let W, H, P = [], mouse = { x: -999, y: -999 };
  function size() { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; P = Array.from({ length: Math.min(70, Math.floor(W / 16)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, r: Math.random() * 2 + 1 })); }
  addEventListener("resize", size); size();
  cv.parentElement.addEventListener("mousemove", e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  (function draw() {
    cx.clearRect(0, 0, W, H);
    P.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fillStyle = "rgba(255,255,255,.75)"; cx.fill();
      for (let k = i + 1; k < P.length; k++) { const q = P[k], d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 120) { cx.strokeStyle = `rgba(120,220,255,${.35 * (1 - d / 120)})`; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke(); } }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y); if (dm < 150) { cx.strokeStyle = `rgba(255,200,61,${.6 * (1 - dm / 150)})`; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(mouse.x, mouse.y); cx.stroke(); }
    });
    requestAnimationFrame(draw);
  })();
})();

function confetti() {
  const cv = $("#confetti"), cx = cv.getContext("2d"); cv.width = innerWidth; cv.height = innerHeight;
  const cols = ["#27d3ff", "#7b5cff", "#ff5fa2", "#ffc83d", "#2de2a6"];
  const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 3, s: Math.random() * 8 + 4, c: cols[Math.random() * 5 | 0], r: Math.random() * 6, vr: Math.random() * .4 - .2 }));
  let f = 0; (function d() { cx.clearRect(0, 0, cv.width, cv.height); ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += p.vr; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); cx.restore(); }); if (++f < 150) requestAnimationFrame(d); else cx.clearRect(0, 0, cv.width, cv.height); })();
}

/* ================== ASISTENTE (chatbot sin servidor) ================== */
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const rangos = a => {
  const out = []; let i = 0;
  while (i < a.length) { let j = i; while (j + 1 < a.length && a[j + 1] === a[j] + 1) j++; out.push(j - i >= 2 ? `${a[i]} a ${a[j]}` : a.slice(i, j + 1).join(", ")); i = j + 1; }
  return out.join(", ");
};
const semanasSin = c => { const r = []; for (let i = 1; i <= c.totalSemanas; i++) if (!semDe(c.id, i).entregas.length) r.push(i); return r; };
const cursosEn = q => { const r = []; if (/algoritm|estructura de datos|\baed\b/.test(q)) r.push("algoritmo"); if (/desarrollo|aplicaciones|taller|\bda\b/.test(q)) r.push("taller"); return r; };
const STOP = new Set("semana semanas tema temas cual cuales donde esta estas estan sobre quiero saber como hay tiene tienen curso cursos tarea tareas evidencia evidencias algoritmo algoritmos desarrollo aplicaciones datos estructura estructuras para puedo unidad dime dame busca buscar encuentro veo nayeli hola gracias jdbc".split(" "));
function buscarTema(q) {
  const toks = q.split(" ").filter(t => t.length >= 4 && !STOP.has(t)).map(t => t.replace(/s$/, ""));
  if (!toks.length) return [];
  const res = [];
  CURSOS.forEach(c => { for (let i = 1; i <= c.totalSemanas; i++) {
    const palabras = norm(semDe(c.id, i).tema).split(" "), sc = toks.filter(t => palabras.some(w => w.startsWith(t))).length;
    if (sc) res.push({ c, n: i, sc });
  } });
  return res.sort((a, b) => b.sc - a.sc || a.n - b.n).slice(0, 4);
}
const evidTxt = (c, n) => { const k = semDe(c.id, n).entregas.length; return k ? `${k} evidencia${k === 1 ? "" : "s"} publicada${k === 1 ? "" : "s"}` : "aún sin evidencias"; };
const accSemana = (c, n) => ({ label: `📂 Abrir semana ${n}${CURSOS.length > 1 ? " · " + c.nombre.split(" ")[0] : ""}`, fn: () => { irASemana(c.id, n); if (innerWidth < 600) cerrarChat(); } });
const accCurso = c => ({ label: `${c.icono} Abrir ${c.nombre}`, fn: () => { irACurso(c.id); if (innerWidth < 600) cerrarChat(); } });
const accLink = (label, href) => ({ label, href });

function responder(raw) {
  const q = norm(raw), has = re => re.test(q), admin = rol === "admin";
  if (!q) return { text: "Escribe tu pregunta y te ayudo 🙂" };
  if (has(/clave|contrasena|password/)) return { text: "La clave es personal de Nayeli, así que no puedo compartirla 🔒. Si eres Nayeli, escríbela en “Iniciar sesión”.", actions: admin ? [] : [{ label: "🔐 Iniciar sesión", fn: () => { $("#btnLogin").click(); } }] };
  if (has(/^(hola|holi|holas|buenas|buenos dias|buen dia|hey|hi)\b/)) return { text: "¡Hola! 👋 Puedo ayudarte con los dos cursos del portafolio: Algoritmo y Estructura de Datos, y Desarrollo de Aplicaciones. Pregúntame por temas, semanas, tareas o conceptos de programación. ¿Qué necesitas?" };
  if (has(/gracias|thank/)) return { text: "¡De nada! 😊 Si necesitas algo más, aquí estoy." };
  if (has(/adios|chau|chao|hasta luego|nos vemos/)) return { text: "¡Hasta pronto! 👋" };
  if (has(/como estas|que tal|como va/)) return { text: "¡Estoy listo para ayudarte! 🤖 Puedo conversar sobre programación, tecnología y estudio, además de responder preguntas sobre este portafolio." };
  if (has(/chiste|cuentame algo gracioso/)) return { text: "¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 = DEC 25. 🎃💻" };
  if (has(/consejo.*estudi|como estudiar|organizar.*estudio|estudiar mejor/)) return { text: "Prueba este método: divide el tema en bloques de 25 minutos, descansa 5, y al final intenta explicar lo aprendido sin mirar tus apuntes. Para programación, escribe y ejecuta un ejemplo pequeño. 📚" };
  if (has(/que es|que son|definicion|define|defineme|significado|que significa|explicame|explica/)) {
    if (has(/arraylist/)) return { text: "📋 ArrayList es una colección de Java que guarda elementos en un orden y permite que la cantidad de elementos cambie. Se puede agregar, consultar o quitar elementos, por ejemplo con `add`, `get` y `remove`." };
    if (has(/arreglo bidimensional|array bidimensional|matriz/)) return { text: "🔢 Un arreglo bidimensional organiza elementos del mismo tipo en filas y columnas, como una tabla. En Java se declara, por ejemplo, como `int[][] matriz = new int[3][4]`; cada elemento se consulta con dos índices: fila y columna." };
    if (has(/arreglo de objetos|array de objetos/)) return { text: "🧩 Un arreglo de objetos guarda referencias a varios objetos de una misma clase. Por ejemplo, `Alumno[] alumnos = new Alumno[3]` crea espacio para tres referencias a objetos Alumno; cada objeto debe crearse por separado con `new Alumno()`." };
    if (has(/arreglo unidimensional|array unidimensional/)) return { text: "📊 Un arreglo unidimensional almacena varios elementos del mismo tipo en una sola secuencia. En Java, `int[] notas = {15, 18, 20}` contiene tres números y se accede a cada uno con un índice, empezando desde 0." };
    if (has(/arreglo|array/)) return { text: "📊 Un arreglo almacena una cantidad fija de elementos del mismo tipo y permite acceder a cada elemento mediante su índice, que empieza en 0. En Java, por ejemplo: `int[] numeros = {10, 20, 30}`." };
    if (has(/base de datos|database/)) return { text: "🗄️ Una base de datos es un conjunto organizado de información que puede guardarse, buscarse, consultarse y actualizarse. En una base de datos relacional, los datos suelen organizarse en tablas relacionadas." };
    if (has(/\balgoritmo\b/)) return { text: "🧠 Un algoritmo es una secuencia finita y ordenada de pasos que resuelve un problema o realiza una tarea. Debe indicar qué hacer con claridad y llegar a un resultado." };
    if (has(/pila|lifo/)) return { text: "📚 Una pila es una estructura de datos LIFO: el último elemento que entra es el primero que sale. Sus operaciones comunes son apilar (`push`), desapilar (`pop`) y consultar el elemento superior (`peek`)." };
    if (has(/cola|fifo/)) return { text: "🚶 Una cola es una estructura de datos FIFO: el primer elemento que entra es el primero que sale. Sus operaciones comunes son encolar al final y desencolar desde el inicio." };
    if (has(/lista enlazada|listas enlazadas/)) return { text: "🔗 Una lista enlazada es una secuencia de nodos; cada nodo guarda un dato y una referencia a otro nodo. En una lista simple apunta al siguiente; en una doble, al siguiente y al anterior. A diferencia de un arreglo, sus nodos no necesitan estar juntos en memoria." };
    if (has(/programacion orientada a objetos|\bpoo\b/)) return { text: "🧱 La programación orientada a objetos (POO) organiza el programa en clases y objetos. Las clases describen atributos (datos) y métodos (acciones); los objetos son instancias concretas. Sus principios incluyen encapsulación, abstracción, herencia y polimorfismo." };
    if (has(/\bsql\b/)) return { text: "🗃️ SQL (Structured Query Language) es un lenguaje usado para definir, consultar y modificar datos en bases de datos relacionales. Incluye instrucciones como `SELECT` para consultar, `INSERT` para agregar, `UPDATE` para actualizar y `DELETE` para eliminar registros." };
    if (has(/\bazure\b/)) return { text: "☁️ Microsoft Azure es una plataforma de computación en la nube de Microsoft. Ofrece servicios para alojar aplicaciones, almacenar datos, usar bases de datos, redes y otras herramientas sin tener que administrar toda la infraestructura física." };
  }
  if (has(/busqueda binaria|busqueda secuencial|busqueda lineal/) && has(/explica|explicame|como funciona|como se|ejemplo|codigo|implement|paso a paso|que es/)) {
    if (has(/binaria/)) return { text: "🔎 Búsqueda binaria (requiere un arreglo ordenado): compara el objetivo con el elemento del medio. Si es menor, continúa en la mitad izquierda; si es mayor, en la derecha. Repite hasta encontrarlo o quedarse sin elementos. Cada paso descarta la mitad, por eso tarda O(log n).\n\nJava:\nint buscar(int[] a, int objetivo) {\n  int izq = 0, der = a.length - 1;\n  while (izq <= der) {\n    int medio = izq + (der - izq) / 2;\n    if (a[medio] == objetivo) return medio;\n    if (a[medio] < objetivo) izq = medio + 1;\n    else der = medio - 1;\n  }\n  return -1;\n}\n\nEjemplo: en [2, 5, 8, 12, 16], para buscar 12 primero se revisa 8 y después 12." };
    return { text: "🔎 La búsqueda secuencial revisa los elementos uno por uno hasta encontrar el objetivo o llegar al final. Funciona aunque los datos no estén ordenados y tarda O(n) en el peor caso.\n\nJava:\nint buscar(int[] a, int objetivo) {\n  for (int i = 0; i < a.length; i++) {\n    if (a[i] == objetivo) return i;\n  }\n  return -1;\n}\n\nEjemplo: para encontrar 8 en [4, 2, 8], compara 4, luego 2 y finalmente 8." };
  }
  if (has(/ordenamiento|ordenacion|ordenar|burbuja|seleccion|insercion/) && has(/explica|explicame|como funciona|como se|ejemplo|codigo|implement|paso a paso|que es/)) {
    if (has(/burbuja/)) return { text: "🫧 Ordenamiento burbuja: compara elementos vecinos e intercambia los que están en el orden incorrecto. Repite las pasadas hasta ordenar el arreglo. Es sencillo, pero tarda O(n²) en promedio y en el peor caso.\n\nEjemplo con [3, 1, 2]: compara 3 y 1 → [1, 3, 2]; compara 3 y 2 → [1, 2, 3]." };
    return { text: "Ordenar es acomodar los datos según un criterio, por ejemplo, de menor a mayor. Métodos como selección e inserción suelen requerir O(n²) comparaciones; para pocos elementos son fáciles de entender. ¿Quieres que te explique burbuja, selección o inserción paso a paso?" };
  }
  if (has(/complejidad|big o|orden de crecimiento/) && has(/explica|explicame|que es|ejemplo|significa/)) return { text: "⏱️ La complejidad describe cómo crecen el tiempo o la memoria que necesita un algoritmo al aumentar la entrada n. O(1): constante; O(log n): búsqueda binaria; O(n): recorrer una lista; O(n²): dos ciclos anidados. Es una estimación del crecimiento, no el tiempo exacto." };
  if (has(/pila|lifo/) && has(/ejemplo|como funciona|explica|explicame|codigo|operacion/)) return { text: "📚 Una pila funciona como una pila de platos: el último que colocas es el primero que retiras (LIFO). push agrega arriba, pop retira el elemento superior y peek lo consulta sin retirarlo.\n\nEjemplo: push(4), push(7), pop() devuelve 7.\n\nEn Java puedes usar Deque<Integer> pila = new ArrayDeque<>(); y llamar pila.push(4), pila.pop()." };
  if (has(/cola|fifo/) && has(/ejemplo|como funciona|explica|explicame|codigo|operacion/)) return { text: "🚶 Una cola funciona como una fila: el primero que llega es el primero que sale (FIFO). Encolar agrega al final y desencolar retira del inicio.\n\nEjemplo: encolar(4), encolar(7), desencolar() devuelve 4.\n\nEn Java puedes usar Queue<Integer> cola = new ArrayDeque<>(); y llamar cola.offer(4), cola.poll()." };
  if (has(/recursividad|recursivo/) && has(/ejemplo|como funciona|explica|explicame|codigo|implement/)) return { text: "🔁 La recursividad resuelve un problema llamando a la misma función con una entrada más pequeña. Debe tener un caso base para detener las llamadas.\n\nFactorial en Java:\nint factorial(int n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nfactorial(4) = 4 × 3 × 2 × 1 = 24." };
  if (has(/arreglo|arraylist/) && has(/ejemplo|como funciona|explica|explicame|codigo|indice/)) return { text: "🧮 Un arreglo guarda elementos del mismo tipo y permite acceder a ellos por índice (comenzando en 0). En Java: int[] numeros = {10, 20, 30}; numeros[1] vale 20. Su tamaño queda fijo al crearlo. ArrayList<Integer> permite agregar o quitar elementos y cambiar de tamaño." };
  if (has(/maven/) && has(/pom xml|archivo pom|\bpom\b/) && has(/que es|que son|que significa|definicion|define|explica|explicame|para que|como funciona|ejemplo|configur/)) return { text: "📦 Maven es una herramienta que automatiza la construcción de proyectos Java: descarga bibliotecas, compila, ejecuta pruebas y empaqueta el programa.\n\n📄 POM significa Project Object Model (Modelo de Objeto de Proyecto). El archivo `pom.xml` es la configuración XML que Maven lee para conocer el proyecto, sus dependencias, plugins y cómo compilarlo o empaquetarlo.\n\nEn resumen: Maven es la herramienta; `pom.xml` es el archivo que le indica cómo trabajar con ese proyecto." };
  if (has(/pom xml|archivo pom|\bpom\b/) && has(/que es|que son|que significa|definicion|define|explica|explicame|para que|como funciona|ejemplo|configur/)) return { text: "📄 POM significa Project Object Model (Modelo de Objeto de Proyecto). El archivo `pom.xml` es la configuración XML principal de un proyecto Maven: describe el proyecto y sus dependencias, plugins y opciones de compilación, pruebas y empaquetado. Maven lee este archivo para saber cómo construir el programa.\n\nEjemplo: `<groupId>com.ejemplo</groupId>`, `<artifactId>mi-app</artifactId>` y `<version>1.0</version>` identifican el proyecto." };
  if (has(/maven|dependencia/) && has(/que es|que son|que significa|definicion|define|explica|explicame|para que|como funciona|ejemplo|configur/)) return { text: "📦 Maven es una herramienta de construcción y administración de proyectos Java. Automatiza tareas como compilar, ejecutar pruebas y empaquetar el programa, y descarga las bibliotecas que necesita el proyecto. Se configura principalmente con el archivo `pom.xml`, donde se declaran los datos del proyecto, sus dependencias y cómo construirlo." };
  if (has(/web application|aplicacion web|aplicacion en maven/) && has(/que es|que son|que significa|explica|explicame|como funciona|ejemplo|crear|diferencia/)) return { text: "🌐 Una aplicación web se ejecuta en un servidor y se utiliza desde un navegador. En un proyecto Maven, pom.xml administra librerías y plugins; el código se organiza en módulos como la lógica Java y los recursos web. Para ejecutarla se empaqueta y despliega en un servidor compatible." };
  if (has(/poo|programacion orientada a objetos|clase|objeto|encapsulacion|herencia|polimorfismo|abstraccion/) && has(/que es|explica|explicame|como funciona|ejemplo|diferencia/)) {
    if (has(/herencia/)) return { text: "🧬 Herencia permite crear una clase derivada que reutiliza y especializa atributos o métodos de una clase base. En Java se declara con `class Gato extends Animal`. Úsala cuando existe una relación “es un”; para compartir servicios entre objetos distintos, suele convenir composición." };
    if (has(/polimorfismo/)) return { text: "🎭 Polimorfismo permite tratar objetos distintos mediante un tipo común y que cada clase ejecute su propia versión de un método. Por ejemplo, Animal a = new Perro(); a.sonido() puede ejecutar la implementación de Perro." };
    if (has(/encapsulacion/)) return { text: "🔒 Encapsulación protege el estado de un objeto y controla su acceso. En Java se suelen declarar atributos private y proporcionar métodos públicos, como getters, setters o métodos que validan antes de cambiar el estado." };
    if (has(/abstraccion/)) return { text: "🧩 Abstracción representa lo esencial de una idea y oculta detalles internos. En Java puede expresarse con interfaces y clases abstractas, por ejemplo una interfaz Forma con un método calcularArea()." };
    return { text: "🧱 En programación orientada a objetos, una clase define atributos y métodos; un objeto es una instancia concreta de esa clase.\n\nEjemplo Java:\nclass Alumno {\n  String nombre;\n  void saludar() { System.out.println(\"Hola, \" + nombre); }\n}\nAlumno a = new Alumno();\na.nombre = \"Ana\";\na.saludar();\n\nLos pilares de POO son encapsulación, abstracción, herencia y polimorfismo." };
  }
  if (has(/jfilechooser|selector de archivos|archivo local|persistencia local/) && has(/que es|que significa|explica|explicame|para que|como funciona|ejemplo|codigo|abrir|guardar/)) return { text: "📁 JFileChooser es el selector de archivos de Swing: permite que la persona elija un archivo o carpeta en su equipo. `showOpenDialog(...)` abre el selector; si el resultado es `JFileChooser.APPROVE_OPTION`, `getSelectedFile()` devuelve el archivo elegido. Para guardar, `showSaveDialog(...)` deja elegir la ruta. La persistencia local conserva datos en archivos del dispositivo, incluso cuando no hay conexión a internet." };
  if (has(/look and feel|lookfeel|apariencia visual|estilo visual/) && has(/que es|que significa|explica|explicame|para que|como funciona|cambiar|configur/)) return { text: "🎨 Look and Feel es la apariencia visual que Swing aplica a botones, tablas, cuadros y otros componentes. Puede usarse la apariencia del sistema operativo o una apariencia instalada. Se configura con `UIManager.setLookAndFeel(...)` antes de crear o actualizar la interfaz; una apariencia consistente ayuda a identificar el proyecto y mejora la experiencia de uso." };
  if (has(/jtable|jlist|jcombobox|tabla|lista desplegable/) && has(/que es|que significa|que son|explica|explicame|para que|como funciona|ejemplo|codigo/)) return { text: "🖥️ En Swing, JTable muestra datos en filas y columnas; JList muestra una lista de opciones; JComboBox ofrece una lista desplegable para elegir. Se conectan a modelos de datos para agregar o actualizar elementos. Ejemplo: `new JComboBox<>(new String[]{\"Java\", \"SQL\"})` crea un selector sencillo." };
  if (has(/joptionpane|dialogo|dialogos|mensaje de usuario/) && has(/que es|que significa|que son|explica|explicame|para que|como funciona|ejemplo|codigo|confirm/)) return { text: "💬 JOptionPane muestra mensajes y cuadros de diálogo en Swing. `showMessageDialog` informa; `showConfirmDialog` pregunta y devuelve la opción escogida; `showInputDialog` solicita un dato. Conviene validar la respuesta y permitir cancelar sin cerrar inesperadamente la aplicación." };
  if (has(/crud|insert|select|actualizar|eliminar|transaccion|transacciones/) && has(/que es|que significa|que son|explica|explicame|como funciona|ejemplo|codigo|insert|select|actualizar|eliminar/)) return { text: "🗄️ CRUD son las operaciones básicas sobre registros: Create (INSERT), Read (SELECT), Update (UPDATE) y Delete (DELETE). Una transacción agrupa cambios relacionados: `commit()` confirma todos; `rollback()` deshace los cambios si ocurre un error." };
  if (has(/dao|acceso a datos|vinculacion dinamica|capa de datos/) && has(/que es|que significa|explica|explicame|para que|como funciona|ejemplo|arquitectura/)) return { text: "🧩 La capa de datos concentra las operaciones de almacenamiento y separa el acceso a la base de datos de la interfaz. Un DAO (Data Access Object) puede ofrecer métodos como buscar, guardar o eliminar. La vinculación dinámica permite que una referencia a una interfaz use en tiempo de ejecución la implementación concreta asignada." };
  if (has(/cliente servidor|hilo|hilos|concurrencia/) && has(/que es|que son|que significa|explica|explicame|para que|como funciona|ejemplo|codigo/)) return { text: "🖧 En arquitectura cliente-servidor, el cliente solicita servicios y el servidor procesa la solicitud y responde. Un hilo (thread) permite ejecutar una tarea concurrentemente; en interfaces Swing, las operaciones lentas no deben bloquear el hilo de eventos: ejecútalas en segundo plano y actualiza la interfaz en el hilo de Swing." };
  if (has(/excepcion|depuracion|debug|prueba|testing|pruebas|error/) && has(/que es|que significa|que son|explica|explicame|como funciona|ejemplo|codigo|manejo|depurar|probar/)) return { text: "🧪 Depurar es localizar y corregir errores observando el programa paso a paso, usando puntos de interrupción e inspeccionando variables. Maneja excepciones concretas para informar errores recuperables, valida entradas y prueba casos normales, límites y errores. No ocultes los errores con bloques `catch` vacíos." };
  if (has(/jar|ejecutable|compilar|empaquetar/) && has(/que es|que significa|explica|explicame|como funciona|como hacer|como se hace|crear|generar|ejemplo/)) return { text: "📦 Un JAR (Java Archive) empaqueta clases y recursos Java para distribuirlos. En Maven normalmente se compila y empaqueta con `mvn package`; el resultado aparece en `target/`. Para ejecutar `java -jar archivo.jar`, el proyecto debe indicar una clase principal y empaquetar también las dependencias si las necesita." };
  if (has(/lista enlazada|arbol|grafo/) && has(/explica|explicame|ejemplo|como funciona|que es|recorrido|codigo/)) {
    if (has(/grafo/)) return { text: "🕸️ Un grafo modela vértices conectados por aristas, dirigidas o no dirigidas. Puede representarse con una matriz o listas de adyacencia. BFS explora primero los vecinos cercanos con una cola; DFS explora un camino y retrocede. Ejemplo: ciudades son vértices y carreteras son aristas." };
    if (has(/arbol/)) return { text: "🌳 Un árbol es una estructura jerárquica de nodos conectados desde una raíz. En un árbol binario cada nodo tiene como máximo dos hijos. Recorridos comunes: preorden (raíz-izquierda-derecha), inorden (izquierda-raíz-derecha) y postorden (izquierda-derecha-raíz)." };
    return { text: "🔗 Una lista enlazada está formada por nodos que guardan un valor y referencias. En una lista simple cada nodo apunta al siguiente; en una doble también al anterior; en una circular el último vuelve al primero. Insertar o quitar con el nodo localizado puede ser O(1), pero buscar un valor requiere recorrer la lista en O(n)." };
  }
  if (has(/que es (un |una )?(algoritmo|variable|arreglo|arraylist|poo|programacion orientada a objetos|java|html|css|javascript|js|maven|crud|recursividad|pila|cola|lista enlazada|base de datos)/)) {
    if (has(/\b(algoritmo)\b/)) return { text: "Un algoritmo es una secuencia finita y ordenada de pasos para resolver un problema. Por ejemplo, una receta describe pasos para preparar un plato. 🧩" };
    if (has(/\b(variable)\b/)) return { text: "Una variable es un espacio con nombre donde un programa guarda un dato que puede consultar o modificar. En Java, por ejemplo: int edad = 20;" };
    if (has(/\b(arreglo|arraylist)\b/)) return { text: "Un arreglo guarda varios valores del mismo tipo y permite acceder a ellos mediante índices. ArrayList es una colección de Java cuyo tamaño puede crecer o reducirse." };
    if (has(/\b(poo|programacion orientada a objetos)\b/)) return { text: "La programación orientada a objetos organiza un programa en objetos que combinan datos (atributos) y acciones (métodos). Sus ideas centrales incluyen encapsulación, herencia, abstracción y polimorfismo." };
    if (has(/\b(java)\b/)) return { text: "Java es un lenguaje de programación orientado a objetos. Se compila a bytecode y se ejecuta en una máquina virtual Java (JVM), lo que permite usarlo en distintas plataformas." };
    if (has(/\b(html)\b/)) return { text: "HTML es el lenguaje de marcado que organiza el contenido de una página web, como títulos, párrafos, enlaces e imágenes." };
    if (has(/\b(css)\b/)) return { text: "CSS describe la presentación de una página web: colores, tipografía, distribución y adaptación a distintos tamaños de pantalla." };
    if (has(/\b(javascript|js)\b/)) return { text: "JavaScript es un lenguaje que permite agregar interactividad y lógica a páginas web; también puede ejecutarse en servidores y otros entornos." };
    if (has(/\b(maven)\b/)) return { text: "Maven es una herramienta de construcción para proyectos Java. Gestiona dependencias y tareas del proyecto mediante su archivo de configuración pom.xml." };
    if (has(/\b(crud)\b/)) return { text: "CRUD reúne las operaciones básicas de persistencia: crear (Create), consultar (Read), actualizar (Update) y eliminar (Delete) datos." };
    if (has(/\b(recursividad)\b/)) return { text: "La recursividad ocurre cuando una función se llama a sí misma para resolver partes más pequeñas de un problema. Debe tener un caso base para detenerse." };
    if (has(/\b(pila)\b/)) return { text: "Una pila es una estructura de datos LIFO: el último elemento que entra es el primero que sale. Sus operaciones típicas son apilar (push) y desapilar (pop)." };
    if (has(/\b(cola)\b/)) return { text: "Una cola es una estructura de datos FIFO: el primer elemento que entra es el primero que sale. Sus operaciones típicas son encolar y desencolar." };
    if (has(/\b(lista enlazada)\b/)) return { text: "Una lista enlazada está formada por nodos; cada nodo guarda un dato y una referencia al siguiente (y, en algunas variantes, al anterior)." };
    if (has(/\b(base de datos)\b/)) return { text: "Una base de datos organiza información para almacenarla, consultarla y actualizarla. Las bases de datos relacionales la organizan en tablas relacionadas." };
  }
  if (has(/aula virtual|canvas/)) return { text: "El aula virtual de la UPLA (Canvas) está aquí 👇", actions: [accLink("🧑‍🏫 Abrir Aula Virtual", CONFIG.aulaVirtual)] };
  if (has(/outlook|correo|email|e mail|\bmail\b|microsoft|office/)) return { text: "Aquí tienes el correo Outlook. Inicia sesión con tu cuenta institucional de la UPLA 📧 (también está el ícono ✉️ arriba, junto a “Iniciar sesión”).", actions: [accLink("✉️ Abrir Outlook", CONFIG.outlook)] };
  if (has(/intranet|matricula|sistema academico|campus|mis notas/)) return { text: "Este es el Intranet de la UPLA 🎓 (también está el ícono 🏛️ arriba, junto a “Iniciar sesión”).", actions: [accLink("🎓 Abrir Intranet UPLA", CONFIG.intranet)] };

  const ms = q.match(/\bsemana\s*(?:n\s*)?(\d{1,2})\b|\bsem\s*(\d{1,2})\b/);
  if (ms) {
    const n = +(ms[1] || ms[2]);
    if (n < 1 || n > 16) return { text: "Cada curso tiene 16 semanas, de la 1 a la 16. ¿Cuál quieres ver?" };
    let cs = cursosEn(q).map(cursoDe); if (!cs.length) cs = CURSOS;
    return {
      text: cs.map(c => `${c.icono} ${c.nombre}\nSemana ${n} · Unidad ${semDe(c.id, n).unidad}\nTema: ${semDe(c.id, n).tema || "por definir"}\nEvidencias: ${evidTxt(c, n)}`).join("\n\n"),
      actions: cs.map(c => accSemana(c, n))
    };
  }
  const mu = q.match(/\bunidad\s*(\d)\b/);
  if (mu) {
    const c = cursoDe(cursosEn(q)[0] || cursoActual), u = +mu[1];
    if (u < 1 || u > c.unidades) return { text: `${c.nombre} tiene ${c.unidades} unidades.` };
    const sems = rangoSemanas(c, u);
    return { text: `${c.icono} ${c.nombre} · Unidad ${u}\n` + sems.map(n => `• Semana ${n}: ${semDe(c.id, n).tema || "por definir"}`).join("\n"), actions: [accSemana(c, sems[0])] };
  }
  if (has(/cuantas|cuantos|total|cantidad/) && has(/tarea|entrega|evidencia|trabajo|archivo|publicad|subid/)) {
    const t = totalEntregas();
    return { text: `Hay ${t} evidencia${t === 1 ? "" : "s"} publicada${t === 1 ? "" : "s"}.\n` + CURSOS.map(c => `• ${c.nombre}: ${progreso(c).hechas} de ${c.totalSemanas} semanas con tareas`).join("\n") };
  }
  if (has(/pendiente|falta|faltan|sin entregar|sin tareas|no he subido|sin evidencias/)) {
    return { text: "Semanas todavía sin evidencias:\n" + CURSOS.map(c => { const r = semanasSin(c); return `• ${c.nombre}: ` + (r.length ? rangos(r) : "¡ninguna, todo entregado! 🎉"); }).join("\n") };
  }
  if (has(/ampli|agrand|zoom|acerc|imagen|imagenes|captura/)) return { text: "Para ver una imagen grande: abre el curso → pulsa “Ver evidencias” en la semana → botón 👁️ Ver.\nClic en la imagen para acercar y otro clic para volver. También sirven la rueda del mouse, arrastrar, los botones ➖ ➕ y las flechas ‹ › para pasar a la siguiente. En el celular, pellizca con dos dedos." };
  if (has(/descarg|bajar/)) return { text: "Cada archivo tiene un botón 📥 Descargar (zip, Word, PDF, imágenes…). También puedes descargar desde el visor cuando abres una imagen o un PDF." };
  if (has(/descart|borrar|eliminar|me equivoc|quitar|equivoque/)) return { text: admin ? "Pulsa 🗑 Descartar junto al archivo o enlace: se abre GitHub y confirmas con “Commit changes”. Al volver aquí, la lista se actualiza sola." : "Solo Nayeli (administradora) puede descartar archivos, después de iniciar sesión.", actions: admin ? [] : [{ label: "🔐 Iniciar sesión", fn: () => { $("#btnLogin").click(); } }] };
  if (has(/iniciar sesion|login|administrad|subir|subo|cargar|adjuntar|publicar/)) return { text: "Subir tareas es solo para Nayeli: inicia sesión, abre la semana (“Ver evidencias”) y pulsa ➕ Subir archivos. Se abre GitHub: arrastra tus archivos y confirma con “Commit changes”. Quien solo revisa no necesita iniciar sesión: puede ver y descargar todo.", actions: admin ? [] : [{ label: "🔐 Iniciar sesión", fn: () => { $("#btnLogin").click(); } }] };
  if (has(/profesor|docente|revisar|calificar|evaluar|ingeniero/)) return { text: "Si eres profesor/a, no necesitas iniciar sesión: elige un curso, abre “Ver evidencias” en la semana y usa 👁️ Ver o 📥 Descargar.", actions: CURSOS.map(accCurso) };
  if (has(/codigo/)) return { text: `El código de estudiante de Nayeli es ${CONFIG.codigoEstudiante}.` };
  if (has(/universidad|upla|donde estudia|huancayo|carrera|ingenieria/)) return { text: `Nayeli estudia Ingeniería de Sistemas en la ${CONFIG.universidad} (UPLA), en Huancayo, Perú.`, actions: [accLink("🎓 Intranet UPLA", CONFIG.intranet), accLink("✉️ Outlook", CONFIG.outlook)] };
  if (has(/quien|presenta|nayeli|sobre ti|sobre ella|estudiante|portafolio/)) return { text: `Este es el portafolio de ${CONFIG.nombreEstudiante}, estudiante de Ingeniería de Sistemas de la ${CONFIG.universidad}. Reúne sus trabajos semana por semana en dos cursos.` , actions: CURSOS.map(accCurso) };
  if (has(/curso|materia|asignatura|silabo|semanas|unidades|unidad/)) return {
    text: "📚 Mis cursos:\n" + CURSOS.map(c => `• ${c.nombre} (${c.codigo}): ${c.unidades} unidades × ${c.semanasPorUnidad} semanas = ${c.totalSemanas} semanas. Tareas en ${progreso(c).hechas} de ${c.totalSemanas} semanas.`).join("\n"),
    actions: CURSOS.map(accCurso) };
  if (has(/tecnolog|lenguaje|java|programa|herramienta|netbeans|github|html/)) return { text: "Nayeli trabaja con ☕ Java, 🧩 POO, 🗄️ bases de datos, 🌐 HTML · CSS · JS, 🐙 GitHub y 🛠️ NetBeans." };
  if (has(/consejo|frase|motivacion|motivar/)) return { text: "💡 “Desarrollar sistemas no es solo hacer que el código funcione, es diseñar soluciones robustas, escalables y elegantes que transformen ideas complejas en experiencias simples.”" };
  if (has(/ayuda|que puedes|menu|opciones|que sabes|funciones|que haces/)) return { text: "Puedo ayudarte sin internet con:\n• Temas, tareas y cursos del portafolio\n• Algoritmos: búsqueda secuencial y binaria, ordenamiento, complejidad y recursividad\n• Estructuras de datos: arreglos, pilas, colas y listas enlazadas\n• Desarrollo de Aplicaciones: Maven y pom.xml, POO, Swing, CRUD y transacciones\n• Cómo ver, ampliar, subir o descargar archivos\n• Abrir Outlook, el Intranet o el Aula Virtual de la UPLA\n\nMis respuestas son información incorporada; no consulto internet ni noticias en tiempo real." };
  const t = buscarTema(q);
  if (t.length) return { text: "Encontré esto:\n" + t.map(r => `• ${r.c.nombre} · Semana ${r.n}: ${semDe(r.c.id, r.n).tema}`).join("\n"), actions: t.slice(0, 2).map(r => accSemana(r.c, r.n)) };
  return { text: "No tengo una respuesta preparada para eso todavía 🤔. Puedo ayudarte con el portafolio y sus cursos. Escribe “ayuda” para ver ejemplos." };
}

const chatEl = $("#chat"), chatBody = $("#chatBody");
let chatIniciado = false;
function addMsg(text, who, actions) {
  const d = document.createElement("div"); d.className = "msg " + who;
  const sp = document.createElement("span"); sp.textContent = text; d.appendChild(sp);
  if (actions && actions.length) {
    const box = document.createElement("div"); box.className = "macts";
    actions.forEach(a => {
      const el = document.createElement(a.href ? "a" : "button"); el.className = "mact"; el.textContent = a.label;
      if (a.href) { el.href = a.href; el.target = "_blank"; el.rel = "noopener"; } else { el.type = "button"; el.onclick = a.fn; }
      box.appendChild(el);
    });
    d.appendChild(box);
  }
  chatBody.appendChild(d); chatBody.scrollTop = chatBody.scrollHeight; return d;
}
function botDice(r) {
  const t = document.createElement("div"); t.className = "msg bot typing"; t.innerHTML = "<i></i><i></i><i></i>";
  chatBody.appendChild(t); chatBody.scrollTop = chatBody.scrollHeight;
  setTimeout(() => { t.remove(); addMsg(r.text, "bot", r.actions); }, 420);
}
function enviarChat(texto) {
  texto = String(texto).trim().slice(0, 200); if (!texto) return;
  addMsg(texto, "me");
  botDice(responder(texto));
}
function abrirChat() {
  chatEl.classList.add("show"); $("#chatFab").classList.add("off");
  $("#chatStatus").textContent = "Respuestas sin internet";
  if (!chatIniciado) {
    chatIniciado = true;
    botDice({ text: "¡Hola! 👋 Soy ChatBot, el asistente de Nayeli. Puedo ayudarte con los dos cursos y explicar temas como búsqueda binaria, Maven y el archivo pom.xml. Escribe “ayuda” para ver más opciones." });
  }
  if (innerWidth > 600) setTimeout(() => $("#chatIn").focus(), 80);
}
function cerrarChat() { chatEl.classList.remove("show"); $("#chatFab").classList.remove("off"); }
$("#chatFab").onclick = abrirChat;
$("#chatClose").onclick = cerrarChat;
$("#chatForm").addEventListener("submit", e => { e.preventDefault(); const i = $("#chatIn"); enviarChat(i.value); i.value = ""; });
$("#chatChips").innerHTML = ["📚 Mis cursos", "🗓️ Semana 1 de algoritmo", "💻 Semana 1 de Desarrollo de Aplicaciones", "📊 ¿Cuántas tareas hay?", "✉️ Outlook"].map(t => `<button class="cchip" type="button">${t}</button>`).join("");
$("#chatChips").addEventListener("click", e => { const b = e.target.closest(".cchip"); if (b) enviarChat(b.textContent.replace(/^[^\wÁÉÍÓÚáéíóúñ¿]+/, "")); });

/* ================== INICIO ================== */
(async () => {
  $("#heroNombre").textContent = CONFIG.nombreEstudiante;
  $("#heroCodigo").textContent = CONFIG.codigoEstudiante;
  $("#qOutlook").href = CONFIG.outlook; $("#qIntranet").href = CONFIG.intranet;
  applyRole(); renderAll(true);
  const ok = await cargarEntregasPublicadas(datos);
  if (!ok) $("#estado-publicacion").textContent = "No se pudieron leer las entregas desde GitHub. Recarga la página en unos minutos.";
  renderAll();
})();
