/**
 * Script opcional: si lo incluyes en la página, genera anclas MindAR con planos PNG
 * (misma lista y orden que index.html). Requiere ar-natural-aspect.js después de A-Frame.
 * No uses app.js y marcadores declarativos a la vez.
 */
const OVERLAY_IMAGE_SRC = [
  "./assets/Almacén con techo alto automatizadode estantería elevada.png",
  "./assets/Cinta de clasificación con detección de colorde multiprocesamiento con horno.png",
  "./assets/Estación ambiental con cámara de control (SSC).png",
  "./assets/Estación de ingreso_salida con reconocimiento de color y lector NFC.png",
  "./assets/Estación de multiprocesamiento con horno.png",
  "./assets/Manipulador de aspiración al vacíode aspiración al vacío.png",
];

const WRAPPER_POS = "0 0.5 0.12";
const WRAPPER_SCALE = "2 2 2";

function buildImageTargets(scene) {
  if (scene.dataset.targetsBuilt === "true") return;

  const raw = scene.getAttribute("data-image-target-count");
  const parsed = parseInt(raw, 10);
  const count =
    Number.isFinite(parsed) && parsed > 0 ? parsed : OVERLAY_IMAGE_SRC.length;

  for (let i = 0; i < count; i++) {
    const anchor = document.createElement("a-entity");
    anchor.setAttribute("mindar-image-target", { targetIndex: i });

    const wrapper = document.createElement("a-entity");
    wrapper.setAttribute("position", WRAPPER_POS);
    wrapper.setAttribute("scale", WRAPPER_SCALE);

    const plane = document.createElement("a-image");
    const src = OVERLAY_IMAGE_SRC[i];
    if (src) {
      plane.setAttribute("src", src);
      plane.setAttribute("width", "1");
      plane.setAttribute("position", "0 0 0");
      plane.setAttribute("rotation", "0 180 0");
      plane.setAttribute("scale", "-1 1 1");
      plane.setAttribute("material", "side: double");
      plane.setAttribute("ar-natural-aspect", { baseWidth: 1 });
    }

    wrapper.appendChild(plane);
    anchor.appendChild(wrapper);
    scene.appendChild(anchor);
  }

  scene.dataset.targetsBuilt = "true";
}

function bindTargetEvents(scene) {
  const estado = document.createElement("div");
  estado.classList.add("estado-modelo");
  document.body.appendChild(estado);

  const targets = scene.querySelectorAll("[mindar-image-target]");

  targets.forEach((target) => {
    const index = target.getAttribute("mindar-image-target").targetIndex;

    target.addEventListener("targetFound", () => {
      estado.style.display = "block";
      estado.textContent = `Marcador ${index} · seguimiento activo`;
    });

    target.addEventListener("targetLost", () => {
      estado.style.display = "none";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  if (!scene) return;

  buildImageTargets(scene);
  bindTargetEvents(scene);

  scene.addEventListener("loaded", () => {
    console.log("Escena A-Frame lista");
  });

  scene.addEventListener("arReady", () => {
    console.log("MindAR listo");
  });

  scene.addEventListener("arError", () => {
    alert("Error al acceder a la cámara. Verifica permisos o HTTPS.");
  });
});
