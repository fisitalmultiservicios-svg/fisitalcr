# Actualización: videos verticales y horizontales e imágenes ampliadas

Este paquete actualiza una instalación existente. No ejecutes otra vez instalar.php y no importes SQL. No requiere cambiar las tablas de la base de datos. El ZIP contiene cinco archivos de código y esta guía.

La versión actual añade reproductores de videos externos y un destino configurable para el botón Hola, Fisital, y acepta enlaces wa.me en clientes y productos. Conserva la sección de clientes, el logo, favicon y menú móvil. No reemplaza contactos, imágenes, contraseñas ni configuración.

## Descargar

[Descargar ZIP de actualización](https://github.com/fisitalmultiservicios-svg/fisitalcr/raw/refs/heads/main/descargas/fisitalcr-actualizacion-multimedia.zip)

[Alternativa TAR.GZ](https://github.com/fisitalmultiservicios-svg/fisitalcr/raw/refs/heads/main/descargas/fisitalcr-actualizacion-multimedia.tar.gz). Ambos paquetes contienen los mismos archivos; usa solo uno.

## Instalar desde cPanel

1. Guarda los cambios pendientes y cierra el panel administrativo.
2. Respalda la base de datos desde cPanel. Descarga también una copia de estos archivos actuales como respaldo, fuera de las carpetas públicas:
   - `public_html/index.php`
   - `public_html/admin.php`
   - `public_html/api.php`
   - `fisital-private/bootstrap.php`
3. En **Administrador de archivos**, entra a la carpeta principal de tu cuenta, donde están `public_html` y `fisital-private`, una junto a la otra.
4. Sube `fisitalcr-actualizacion-multimedia.zip` a esa carpeta principal. NO lo extraigas dentro de public_html.
5. Selecciona el ZIP y pulsa **Extraer** en la misma carpeta. Acepta reemplazar index.php, admin.php, api.php y bootstrap.php. También se añade public_html/enlaces.js. No elimines las carpetas actuales: se deben combinar sus contenidos.
6. Verifica que los archivos nuevos quedaron en las rutas indicadas y que exista public_html/enlaces.js. El ZIP no incluye `config.php`, `conexion.php`, `uploads`, el instalador ni archivos SQL. No omitas enlaces.js o api.php: son necesarios para las nuevas funciones. Mantén intactos tu configuración privada, medios y base de datos.
7. Elimina el ZIP del hosting. La guía ACTUALIZAR.md queda fuera de public_html.
8. Abre de nuevo `https://fisitalcr.com/admin.php` y pulsa **Ctrl + F5** para recargar sin caché. Inicia sesión con tu contraseña habitual.

Si tu dominio tiene una raíz pública distinta de public_html, mueve manualmente los dos PHP públicos a esa raíz, y bootstrap.php a la carpeta privada existente. No modifiques conexion.php.

## Videos verticales y horizontales

- El reproductor se ajusta al ancho y alto de la pantalla sin estirar ni recortar el video. El tamaño se recalcula al girar el teléfono o redimensionar la ventana.
- En **Automático**, se usan las dimensiones reales de MP4/WebM al abrirlos; los enlaces de Reels y Shorts se identifican como verticales. Para Vimeo se usan las dimensiones que devuelve el proveedor.
- Un iframe externo no permite inspeccionar directamente el video por las restricciones entre dominios. Un enlace normal de YouTube, Facebook, Drive o Vimeo sin dimensiones disponibles usa inicialmente formato horizontal.
- Si el video externo se muestra en un formato incorrecto, abre **Portafolio → Editar → Formato del video**, elige **Vertical** u **Horizontal** y guarda. La misma opción está disponible en **Showreel**.
- Estas opciones cambian el tamaño del reproductor, no los permisos de inserción del proveedor. El mensaje de bloqueo de Facebook continúa dependiendo de Facebook.

## Ampliar imágenes

- Pulsa una imagen del portafolio, noticias o productos para verla completa en una ventana superpuesta, ajustada a la pantalla.
- Cierra con **Cerrar ×**, la tecla **Escape** o pulsando fuera de la imagen.
- En un proyecto con imagen de portada y video, la imagen se amplía y el botón **Ver video** abre el reproductor.
- Las miniaturas automáticas de videos siguen abriendo el video; los logos de clientes conservan su enlace al cliente.

## Videos del portafolio y portada automática

1. En **Portafolio → Editar**, pega la dirección en el campo de video. Espera a que termine cualquier subida pendiente y pulsa **Guardar**.
2. Se reconocen Facebook/Reels, YouTube (incluidos Shorts y Live), Vimeo, Google Drive público y enlaces directos a MP4/WebM. Los archivos permanecen en sus proveedores; no se copian al hosting.
3. Deja **Portada opcional** vacía para usar la portada automática cuando esté disponible. Si ya hay una imagen, esa imagen tiene prioridad; pulsa Quitar para usar la automática.
4. YouTube usa su miniatura pública. Vimeo consulta su servicio oficial de metadatos y guarda solo la URL de la portada en una caché privada. Google Drive usa su miniatura si el archivo permite acceso público.
5. Facebook muestra su reproductor oficial como vista previa, con la portada que el proveedor ofrezca. La vista previa se carga de forma diferida y sin reproducción automática. **Ver video** abre un reproductor más grande con el enlace original disponible.
6. La reproducción y portada dependen de que el video sea público, el propietario permita inserción y el navegador permita al proveedor cargar su contenido. Algunos reels pueden exigir iniciar sesión o estar restringidos por región/edad. La web no puede quitar esas restricciones.
7. Los archivos MP4/WebM no siempre incluyen una portada accesible como imagen. En ese caso añade un enlace HTTPS de imagen o una portada manual; no se descarga el video completo para generar una imagen.
8. Para proveedores no reconocidos se ofrece **Abrir video original**, en lugar de tratar una página web como si fuera un archivo de video. Para un resultado más predecible y ligero, usa YouTube o Vimeo público.

No se garantiza la reproducción de cualquier enlace de Facebook. El enlace de prueba `https://www.facebook.com/reel/2828086157523112` se reconoce como reel y se entrega al reproductor oficial. La red de desarrollo bloqueó la comprobación pública de Facebook; el video real debe comprobarse en el navegador del usuario.

## Destino de Hola, Fisital y WhatsApp

1. En el panel abre **Ajustes**.
2. En **Destino del botón Hola, Fisital**, puedes introducir `https://otro-sitio.com/contacto`, `https://wa.me/50688880000` o simplemente `wa.me/50688880000?text=Hola`.
3. Pulsa **Guardar ajustes**. Ese enlace tiene prioridad y abre en otra pestaña.
4. Si dejas el campo vacío, se usa el número de WhatsApp con código de país y el mensaje configurados. Si tampoco hay número, se usa el correo de contacto (requiere una aplicación de correo en el dispositivo).
5. En **Clientes** y **Productos**, el campo de enlace también acepta `wa.me/...`, `https://wa.me/...`, enlaces de WhatsApp Business `wa.me/message/...` y cualquier sitio HTTPS válido. Los enlaces wa.me se guardan con https:// automáticamente. No se admiten javascript:, enlaces inseguros a otros sitios ni archivos ejecutables.

## Nuestros clientes

1. En el panel abre **Clientes**, en el menú lateral.
2. Pulsa **+ Agregar** y escribe el nombre del cliente.
3. Sube su logo y espera el mensaje **Listo**. El logo conserva sus colores; se muestra completo, sin recortes.
4. Introduce la URL del cliente con `https://`, por ejemplo `https://cliente.com`. Si dejas el campo vacío, su tarjeta se muestra sin enlace.
5. Mantén marcada **Visible en el sitio** y pulsa **Guardar**.
6. En el inicio aparecerá **Nuestros clientes**, antes de Productos. Tocar el logo o el nombre abre el sitio del cliente en otra pestaña.
7. Puedes editar, ordenar con las flechas, ocultar o eliminar clientes desde el panel. El título y la descripción se cambian en **Inicio (landing) → Sección Nuestros clientes**.

La sección y su opción de menú se ocultan si no hay clientes visibles. Los clientes empiezan vacíos: no se publican empresas ficticias. Los datos existentes son compatibles sin cambios de tablas ni reinstalación.

## Logo e icono de pestaña

1. En el panel abre **Inicio (landing) → Marca y colores**.
2. El logo personalizado conserva sus colores; ya no se le aplica el filtro blanco del diseño original. Si ya estaba guardado, debe aparecer al recargar la web.
3. Para cambiarlo, sube una imagen y espera el mensaje **Listo**. Luego pulsa **Guardar cambios** en la parte superior y espera **Landing guardada**. La vista previa por sí sola no publica el cambio.
4. En el campo **Icono de pestaña (favicon)**, sube un PNG cuadrado; se recomienda 512 × 512 píxeles. Espera la subida y pulsa **Guardar cambios**.
5. Recarga la web. El favicon también se usa como icono para dispositivos Apple. Si la pestaña conserva el anterior, cierra esa pestaña y abre una nueva; los navegadores pueden mantener los iconos en caché.

## Enlaces de productos

1. Abre **Productos** y pulsa **Editar** en un producto.
2. Completa **URL del producto**, por ejemplo `https://sitio-del-producto.com`.
3. Guarda el producto.
4. En la tarjeta pública aparecerá **Visitar sitio ↗**, que abre el destino en otra pestaña. Si dejas la URL vacía, no aparece ese botón. Solo se admiten enlaces HTTPS.

## Menú en teléfonos y tabletas

En pantallas de hasta 860 píxeles aparece el botón **Menú**, junto al logo. Permite acceder a Servicios, Portafolio, Productos, Noticias y Hablemos. Se cierra al elegir una sección, al pulsar de nuevo el botón, al tocar fuera o con Escape. En escritorio se muestran los enlaces completos.

## Advertencia de conexión no segura

Esta actualización no cambia certificados, DNS ni la configuración SSL del servidor. El archivo hosts de Windows solo dirige tu computadora al servidor nuevo; no instala un certificado.

Solicita al proveedor del hosting nuevo:

> Instalen un certificado SSL válido para fisitalcr.com y www.fisitalcr.com en el servidor 198.38.90.19, con su cadena completa. El dominio todavía apunta al hosting anterior y lo estoy probando con hosts de Windows. Necesito conservar los DNS actuales hasta terminar la nueva web. Indiquen cómo validar o instalar el certificado en este escenario.

No desactives require_https ni uses HTTP como solución. La captura muestra que el navegador tiene una excepción de certificado. Cuando el proveedor confirme la corrección, pulsa **Activar advertencias** en el navegador y comprueba que el dominio abre sin advertencias antes de volver a ingresar contraseñas. No compartas credenciales mientras continúe el error.

## Comprobación de la actualización

- Se conserva la contraseña y el contenido de tu instalación.
- Logo e icono se mantienen después de recargar el panel.
- El logo público conserva sus colores.
- El botón del producto abre la dirección configurada en otra pestaña.
- En una pantalla móvil aparece Menú y todas las opciones se pueden abrir.

Validación realizada localmente con PHP 8.3, MariaDB y Chromium. Se probaron guardado, carga real de imágenes, logo y favicon en HTML servido por PHP, validación de URLs, pestaña nueva y navegación en anchos de 320, 390, 768 y 860 píxeles, además de escritorio. No se dispone de acceso al cPanel del usuario para instalar la actualización o corregir el certificado.
