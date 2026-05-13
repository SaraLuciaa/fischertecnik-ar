/**
 * Ajusta width/height del plano a-image para respetar el aspect ratio de la textura
 * (evita estirar PNG/JPEG no cuadrados).
 */
(function () {
  if (typeof AFRAME === "undefined") return;

  AFRAME.registerComponent("ar-natural-aspect", {
    schema: {
      baseWidth: { type: "number", default: 1 },
    },

    init() {
      this.onTex = this.apply.bind(this);
      this.el.addEventListener("materialtextureloaded", this.onTex);
      this.el.addEventListener("loaded", this.onTex);
    },

    remove() {
      this.el.removeEventListener("materialtextureloaded", this.onTex);
      this.el.removeEventListener("loaded", this.onTex);
      if (this._imgLoadHandler && this._imgEl) {
        this._imgEl.removeEventListener("load", this._imgLoadHandler);
      }
    },

    update() {
      this.apply();
    },

    apply() {
      const mesh = this.el.getObject3D("mesh");
      if (!mesh || !mesh.material) return;
      const map = mesh.material.map;
      const img = map && map.image;
      if (!img) return;

      if (!img.complete || img.naturalWidth <= 0) {
        if (img.addEventListener && !this._imgLoadHandler) {
          this._imgEl = img;
          this._imgLoadHandler = () => this.apply();
          img.addEventListener("load", this._imgLoadHandler);
        }
        return;
      }

      const w = this.data.baseWidth;
      const h = w * (img.naturalHeight / img.naturalWidth);
      this.el.setAttribute("width", w);
      this.el.setAttribute("height", h);
    },
  });
})();
