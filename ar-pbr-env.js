/**
 * MindAR + A-Frame: los GLB con MeshStandardMaterial / metalness alta
 * reflejan "el vacío" y se ven negros sin scene.environment.
 * Genera un PMREM ligero y lo asigna a la escena Three.js.
 */
(function () {
  function buildNeutralEnvMap(sceneEl) {
    const THREE = AFRAME.THREE;
    const renderer = sceneEl.renderer;
    if (!renderer) return null;

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(8, 32, 16),
      new THREE.MeshBasicMaterial({ color: 0xc8d4e8, side: THREE.BackSide })
    );
    envScene.add(dome);
    envScene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const key = new THREE.DirectionalLight(0xffffff, 5);
    key.position.set(3, 6, 4);
    envScene.add(key);
    const fill = new THREE.DirectionalLight(0xeef4ff, 3);
    fill.position.set(-4, 3, -3);
    envScene.add(fill);
    const rim = new THREE.DirectionalLight(0xfff0e8, 2);
    rim.position.set(0, -2, 6);
    envScene.add(rim);

    const { texture } = pmrem.fromScene(envScene, 0.08);
    pmrem.dispose();
    return texture;
  }

  window.addEventListener("DOMContentLoaded", function () {
    const sceneEl = document.querySelector("a-scene");
    if (!sceneEl) return;

    function refreshMaterialsForEnv(object3d) {
      if (!object3d) return;
      object3d.traverse(function (node) {
        if (!node.isMesh || !node.material) return;
        var mats = Array.isArray(node.material) ? node.material : [node.material];
        mats.forEach(function (m) {
          if (m && (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial)) {
            m.needsUpdate = true;
          }
        });
      });
    }

    sceneEl.addEventListener("loaded", function once() {
      sceneEl.removeEventListener("loaded", once);
      const root = sceneEl.object3D;
      if (!root || !sceneEl.renderer) return;

      const envMap = buildNeutralEnvMap(sceneEl);
      if (envMap) {
        root.environment = envMap;
      }

      if (sceneEl.renderer.toneMappingExposure !== undefined) {
        sceneEl.renderer.toneMappingExposure = 1.15;
      }

      sceneEl.querySelectorAll("a-gltf-model").forEach(function (el) {
        el.addEventListener("model-loaded", function () {
          refreshMaterialsForEnv(el.getObject3D("mesh"));
        });
        if (el.components && el.components.gltf_model && el.components.gltf_model.model) {
          refreshMaterialsForEnv(el.getObject3D("mesh"));
        }
      });
    });
  });
})();
