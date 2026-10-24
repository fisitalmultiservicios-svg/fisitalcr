# Actualización: clientes, logo, favicon, enlaces de productos y menú móvil

Este paquete actualiza una instalación existente. No ejecutes otra vez instalar.php y no importes SQL. No requiere cambiar las tablas de la base de datos.

La versión actual añade **Nuestros clientes** al landing y **Clientes** al panel, y conserva las mejoras anteriores. No reemplaza contactos, imágenes, contraseñas ni configuración.

## Descargar

[Descargar ZIP de actualización](https://github.com/fisitalmultiservicios-svg/fisitalcr/raw/refs/heads/main/descargas/fisitalcr-actualizacion-clientes.zip)

## Instalar desde cPanel

1. Guarda los cambios pendientes y cierra el panel administrativo.
2. Respalda la base de datos desde cPanel. Descarga también una copia de estos tres archivos actuales como respaldo, fuera de las carpetas públicas:
   - `public_html/index.php`
   - `public_html/admin.php`
   - `fisital-private/bootstrap.php`
3. En **Administrador de archivos**, entra a la carpeta principal de tu cuenta, donde están `public_html` y `fisital-private`, una junto a la otra.
4. Sube `fisitalcr-actualizacion-clientes.zip` a esa carpeta principal. NO lo extraigas dentro de public_html.
5. Selecciona el ZIP y pulsa **Extraer** en la misma carpeta. Acepta reemplazar los tres archivos. No elimines las carpetas actuales: se deben combinar sus contenidos.
6. Verifica que los archivos nuevos quedaron en las tres rutas indicadas. El ZIP no incluye `config.php`, `conexion.php`, `uploads`, el instalador ni archivos SQL. Mantén intactos tu configuración privada, medios y base de datos.
7. Elimina el ZIP del hosting. La guía ACTUALIZAR.md queda fuera de public_html.
8. Abre de nuevo `https://fisitalcr.com/admin.php` y pulsa **Ctrl + F5** para recargar sin caché. Inicia sesión con tu contraseña habitual.

Si tu dominio tiene una raíz pública distinta de public_html, mueve manualmente los dos PHP públicos a esa raíz, y bootstrap.php a la carpeta privada existente. No modifiques conexion.php.

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
