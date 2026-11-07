# Órbita — diseño oficial de Fisital y personalización visual

Esta actualización aplica el estilo 05 elegido al sitio público y al panel administrativo. Conserva el contenido de MySQL, usuarios, contraseñas, contactos, productos, noticias, proyectos y archivos subidos. No necesita reinstalar ni modificar tablas.

## 1. Antes de actualizar

1. Desde cPanel respalda la base de datos y los archivos del sitio.
2. Guarda una copia de `public_html/index.php`, `admin.php`, `api.php`, `enlaces.js` y `fisital-private/bootstrap.php`.
3. Cierra las pestañas del panel para no guardar desde una versión anterior durante la actualización.
4. Descarga `fisitalcr-orbita-oficial.zip` o su alternativa TAR.GZ. Solo necesitas uno.

## 2. Subir y extraer

1. En el Administrador de archivos entra a la carpeta principal de tu cuenta: **la que contiene public_html y fisital-private una junto a la otra**.
2. Sube allí el paquete y pulsa **Extraer** en esa misma carpeta. **No lo extraigas dentro de public_html**.
3. Acepta reemplazar los archivos incluidos. Conserva las carpetas existentes; no las borres para reemplazarlas.
4. Deben quedar estas rutas:

```text
/home/TUUSUARIO/
├── fisital-private/
│   ├── bootstrap.php        ← actualizado
│   └── config.php           ← tu archivo actual, NO se reemplaza
├── public_html/
│   ├── index.php            ← actualizado
│   ├── admin.php            ← actualizado
│   ├── api.php              ← actualizado
│   ├── enlaces.js           ← actualizado
│   ├── conexion.php         ← tu archivo actual, NO se reemplaza
│   ├── uploads/             ← tus archivos actuales, NO se reemplazan
│   └── orbita/              ← carpeta nueva; debe subirse completa
│       ├── sitio.css
│       ├── admin.css
│       ├── tema.js
│       ├── editor.js
│       ├── estudio-referencia.png
│       └── logo.png
├── ACTUALIZAR.md
└── ORBITA-CPANEL.md
```

5. Comprueba que los archivos públicos y `orbita` tienen permisos de lectura habituales: archivos 644 y carpetas 755. Conserva la carpeta privada protegida con sus permisos actuales.
6. Elimina el paquete del hosting después de extraerlo.
7. Abre `https://fisitalcr.com/admin.php` y pulsa **Ctrl + F5**. Inicia sesión con tu contraseña habitual.
8. Abre la web y comprueba el nuevo diseño. Si hay caché en el hosting o CDN, purga esa caché y excluye el panel y API de ella.

Si usas otra raíz pública, mueve los archivos públicos y la carpeta orbita a esa raíz. Bootstrap va en tu carpeta privada original. No cambies conexion.php ni config.php.

**No ejecutes instalar.php, no importes SQL y no reemplaces uploads.**

## 3. Colores generales del sitio

1. En el panel abre **Apariencia**.
2. En **Personalizar**, selecciona **Sitio web**.
3. En **Área**, selecciona **Paleta general**.
4. Cambia colores con el selector o escribiendo el valor hexadecimal, por ejemplo `#657ee2`.
5. Puedes configurar fondo general, degradado, imagen de fondo, tarjetas, texto, bordes, acentos, botones, menú y presentación del logo.
6. La opacidad de las tarjetas controla la transparencia del vidrio. También puedes ajustar el redondeado y activar/desactivar las luces ambientales.
7. Revisa la vista previa de escritorio o pulsa **Vista móvil**.
8. Pulsa **Guardar apariencia**. Debe aparecer **Apariencia guardada. Ya está publicada.**

La vista previa no publica cambios por sí sola. La imagen del fondo tiene prioridad sobre el degradado. Si quieres volver al color/degradado, quita la imagen y guarda.

## 4. Fondos y colores por sección

1. Mantén **Sitio web** y elige un área: portada, servicios y cifras, productos, clientes, portafolio, noticias, contacto o pie de página.
2. Activa **Personalizar esta sección**.
3. Elige su color de fondo o degradado; puedes subir una imagen o pegar un enlace HTTPS.
4. Si usas imagen, ajusta el color y opacidad de su capa para que el texto siga siendo legible.
5. También puedes cambiar texto, texto secundario, tarjetas, acentos, bordes y colores de botones de esa sección.
6. Guarda la apariencia.

Para que una sección vuelva a heredar la paleta general, desactiva **Personalizar esta sección** y guarda. Para restaurar solo sus valores iniciales, usa **Restaurar área** y guarda.

Los colores de portada de cada proyecto/noticia siguen disponibles en sus editores. La imagen de un contenido se cambia en el editor de ese contenido; el fondo de su sección se cambia en Apariencia.

## 5. Personalizar el panel

1. En Apariencia cambia **Personalizar → Panel administrativo**.
2. Usa **Paleta general** para el fondo, tarjetas, texto, botones y menú del panel.
3. También puedes elegir acceso, menú lateral, resumen o cada pantalla del editor y activar su personalización propia.
4. La vista previa del panel es de solo lectura: no modifica contenidos ni permite operar formularios del panel incrustado.
5. Guarda la apariencia y revisa las pantallas que hayas personalizado.

Los colores del panel y de la web son independientes. No necesitas compartir la misma paleta en ambos.

## 6. Logo e imágenes

- En **Inicio (landing) → Marca y navegación** puedes cambiar el logo, favicon y textos del menú.
- En **Apariencia → Paleta general → Presentación del logo**, usa **Original** para conservar sus colores, **Oscuro** para un logo monocromo sobre fondos claros o **Claro** para fondos oscuros. Web y panel tienen su ajuste independiente.
- Productos, clientes, proyectos y noticias conservan sus imágenes actuales y sus controles de subida.
- En **Showreel** puedes cambiar el video y su imagen de fondo. Se proporciona una fotografía tecnológica de referencia cuando no hay una portada válida asignada; no se presenta como trabajo real de un cliente.
- Las referencias visuales no reemplazan tus archivos subidos. Las imágenes de fondo personalizadas se guardan en uploads igual que las demás imágenes.
- Espera **Listo** antes de guardar una imagen. Subirla y ver la miniatura no basta para publicarla.

## 7. Restaurar el estilo original

En Apariencia pulsa **Restaurar Órbita** y después **Guardar apariencia**. Esto restablece colores, fondos y efectos del sitio y panel; no borra logos, textos, clientes, contactos, imágenes de contenido ni proyectos. No elimina archivos de uploads.

El panel pide confirmación si intentas salir con cambios de apariencia sin guardar.

## 8. Qué sigue funcionando

- Menú móvil y navegación independiente de los reproductores.
- Formularios reales y contactos privados; la vista previa no envía formularios.
- Videos verticales/horizontales, imágenes ampliadas y formatos configurables.
- URLs de clientes/productos, enlaces wa.me y destino de Hola, Fisital en Ajustes.
- Exportación/importación de contenido. Las exportaciones nuevas incluyen apariencia; al importar un respaldo antiguo que no tiene tema, se conserva la apariencia actual.
- Las ediciones simultáneas siguen detectándose para evitar sobrescribir otro panel.

## Validación realizada

Probado localmente con PHP 8.3, MariaDB y Chromium: instalación y autenticación, contenido legado sin clave theme, guardado de paletas independientes, fondos y subida de imágenes, degradados, personalización por sección, persistencia, restauración, validación de colores/URLs/rangos, formularios reales y bloqueo de envíos en vista previa. También se verificaron videos, navegación y vistas móviles de 320 a 1480 píxeles. Las respuestas de reproductores externos se simularon en las pruebas; sus permisos siguen dependiendo de cada proveedor.

Los ajustes visuales se guardan como parte del documento JSON existente en MySQL. La actualización no trae credenciales, datos de contacto recibidos ni una copia de tu base de datos. Su publicación en GitHub no instala archivos automáticamente en tu cPanel.
