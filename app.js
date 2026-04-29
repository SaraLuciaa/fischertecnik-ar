const EXAMPLE_GLB_ASSET_ID = "#ar-example-model";
const DEFAULT_MODEL_SCALE = "0.2 0.2 0.2";

function buildImageTargets(scene) {
  if (scene.dataset.targetsBuilt === "true") return;

  const raw = scene.getAttribute("data-image-target-count");
  const parsed = parseInt(raw, 10);
  const count =
    Number.isFinite(parsed) && parsed > 0 ? parsed : 4;

  for (let i = 0; i < count; i++) {
    const anchor = document.createElement("a-entity");
    anchor.setAttribute("mindar-image-target", { targetIndex: i });

    const model = document.createElement("a-gltf-model");
    model.setAttribute("src", EXAMPLE_GLB_ASSET_ID);
    model.setAttribute("position", "0 0 0");
    model.setAttribute("rotation", "0 0 0");
    model.setAttribute("scale", DEFAULT_MODEL_SCALE);
    model.setAttribute("animation-mixer", "");

    anchor.appendChild(model);
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
      estado.textContent = `Marcador ${index} · modelo cargado`;

      const model = target.querySelector("a-gltf-model");
      if (model) {
        model.setAttribute(
          "animation",
          "property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
        );
      }
    });

    target.addEventListener("targetLost", () => {
      estado.style.display = "none";

      const model = target.querySelector("a-gltf-model");
      if (model) {
        model.removeAttribute("animation");
      }
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
