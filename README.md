# fischertecnik_ar

Aplicación web de **realidad aumentada (RA)** que superpone ilustraciones PNG sobre **marcadores de imagen** colocados junto a la maqueta. Sirve como apoyo visual para relacionar cada **estación de la Fábrica fischertechnik 4.0** con su interpretación en un entorno industrial tipo **Global Bike** (SAP): la cámara reconoce la imagen del marcador y muestra encima el panel ilustrado correspondiente.

**Tecnologías:** [A-Frame](https://aframe.io/) 1.6 + [MindAR](https://github.com/hiukim/mind-ar-js) (seguimiento por imagen) + scripts locales para proporción de textura y entorno PBR.

---

## Contexto

La **Fábrica fischertechnik 4.0** es una maqueta de una fábrica inteligente que permite simular procesos de producción industrial digitalizados. Incluye estaciones automatizadas, sensores, robots, almacenamiento, clasificación, conexión a la nube, trazabilidad por NFC y monitoreo en tiempo real mediante un panel de control. Su objetivo es representar, a escala reducida, cómo funciona una fábrica conectada bajo el modelo de **Industria 4.0**.

**Global Bike Inc.** es una empresa modelo utilizada en entornos SAP para representar una compañía manufacturera multinacional dedicada a la producción y distribución de bicicletas. Fabrica bicicletas de montaña y de turismo y trabaja con plantas de producción, almacenes, proveedores, distribuidores, compras, manufactura, inventario, ventas, mantenimiento y transformación digital.

En el marco del trabajo académico asociado, se establece una **equivalencia** entre los componentes de la Fábrica fischertechnik 4.0 y las áreas o procesos de Global Bike. La idea no es limitarse a describir qué hace cada pieza de la maqueta, sino **interpretar qué representaría ese componente** dentro de una fábrica real de bicicletas como Global Bike. Esta aplicación de RA refuerza esa lectura al mostrar, por estación, material gráfico alineado con cada vínculo.

---

## Cómo usarlo (versión publicada)

La demo está desplegada en **GitHub Pages**. Para usarla:

1. Abre en el navegador (móvil o escritorio): **[https://saraluciaa.github.io/fischertecnik-ar/](https://saraluciaa.github.io/fischertecnik-ar/)**
2. Cuando el sitio lo solicite, **acepta el acceso a la cámara** (en móvil suele pedirse cámara trasera; en escritorio, la webcam).
3. **Enfoca con la cámara cada marcador** impreso (o la tarjeta con la imagen objetivo) que corresponda a una estación de la maqueta. Puedes ir pasando de un marcador a otro: al detectarse cada imagen, MindAR ancla el contenido y verás el **PNG asociado** flotando sobre ese marcador.
4. Mantén el marcador **bien iluminado**, evita reflejos fuertes y, si hace falta, acerca o aleja lentamente hasta que el indicador de escaneo desaparezca y el overlay se mantenga estable.

No hace falta instalar nada: el sitio ya se sirve por **HTTPS**, requisito habitual para usar la cámara en el navegador.

---

## Uso en local (desarrollo)

Si trabajas con el código en tu máquina:

1. **Clona o descarga** el repositorio.
2. **Sirve la carpeta raíz** por HTTP/S (no abras `index.html` con `file://`).
   - Ejemplo: `python -m http.server 8080` → `http://localhost:8080`
   - O: `npx --yes serve -l 8080`
3. Abre **`/index.html`** en el navegador, concede cámara y prueba los mismos marcadores que en producción.

---

## Requisitos

- Navegador actualizado (Chrome, Edge, Firefox; Safari en iOS con permisos de cámara).
- Para desarrollo local fuera de `localhost`, en muchos móviles hará falta **HTTPS** (p. ej. túnel con ngrok o Cloudflare Tunnel).
- Marcadores que coincidan visualmente con las imágenes usadas al generar `targets/targets.mind` (véase `markers_sources/`).

---

## Estructura del repositorio

| Ruta | Uso |
|------|-----|
| `index.html` | Entrada principal: escena RA, hasta 6 `targetIndex` y overlays PNG. |
| `targets/targets.mind` | Paquete de **imágenes objetivo** compilado para MindAR (lo que la cámara debe reconocer). |
| `markers_sources/*.jpg` | Imágenes fuente típicas para **compilar** el `.mind` (deben coincidir con lo impreso). |
| `assets/*.png` | Texturas que se **muestran flotando** sobre cada marcador cuando se detecta. |
| `ar-natural-aspect.js` | Ajusta ancho/alto del plano para **respetar el aspect ratio** del PNG. |
| `ar-pbr-env.js` | Entorno de reflexión ligero en la escena (útil si más adelante usas modelos 3D PBR). |
| `app.js` | **Opcional:** crea anclas y planos por JavaScript. No lo cargues junto con los marcadores ya declarados en `index.html` o duplicarás contenido. |

El orden de los `targetIndex` (0 … 5) en `index.html` sigue el **orden alfabético** de los nombres en `markers_sources/`, igual que suele ordenarse al compilar varias imágenes en un solo `.mind`. Si recompilas con otro orden, tendrás que reordenar los `targetIndex` o las texturas en el HTML.

