# FisitalCR — instalación en cPanel con PHP 8.3 y MySQL

Este paquete conserva el diseño de los dos HTML proporcionados y conecta el sitio y su panel a una base de datos compartida. No necesita Node.js, Composer ni comandos de terminal en el hosting.

## Qué incluye

- Sección Nuestros clientes: nombre, logo y URL, administrable desde el panel, con orden y visibilidad.
- Menú móvil desplegable, logo a color, favicon configurable y enlaces HTTPS opcionales en productos.
- Videos externos con reproductores de Facebook, YouTube, Vimeo y Drive; destino de contacto y enlaces wa.me configurables.
- Sitio público responsive: inicio, portafolio con filtros, productos, noticias y showreel.
- Panel con contraseña: textos, logo, colores, proyectos, noticias, productos, showreel, categorías, correo, WhatsApp y contactos.
- Cambios persistentes en MySQL; contactos en una tabla separada para evitar que una edición los borre.
- Imágenes y videos alojados en `uploads`, o enlaces HTTPS a archivos, YouTube y Vimeo.
- Sesión con caducidad de 30 minutos de inactividad, contraseñas con hash, protección CSRF, límites de intentos, validación de datos y control de ediciones simultáneas.
- Exportación de contactos CSV y contenido/contactos JSON. El JSON NO incluye medios ni contraseña; su importación restaura contenido y conserva los contactos ya existentes. Para restaurar contactos usa el respaldo SQL completo.

Las noticias conservan las tarjetas y resúmenes del diseño original; no incluyen páginas de artículos completos. El botón Hola, Fisital se puede dirigir a un sitio o a un enlace wa.me desde Ajustes. Los formularios guardan contactos en el panel: no envían correos ni mensajes automáticos a WhatsApp. Los números, testimonios implícitos, proyectos y noticias iniciales son ejemplos del HTML, no datos verificados de tu empresa. Revísalos antes de anunciar el sitio.

## 1. Respalda y localiza la carpeta del dominio

1. Entra a cPanel y abre **Backup / Copia de seguridad** o **Backup Wizard**. Descarga una copia del sitio existente y de su base de datos si hay una.
2. En **Domains / Dominios**, identifica la **Document Root / Raíz del documento** de tu dominio. Para el dominio principal suele ser `/home/TUUSUARIO/public_html`.
3. Esta guía usa `public_html` como ejemplo. Si hay una web anterior, prueba primero en un subdominio o respáldala antes de reemplazar archivos. No borres carpetas de otros dominios, correo ni `.well-known`.
4. Desde **File Manager / Administrador de archivos → Settings / Configuración**, activa **Show Hidden Files / Mostrar archivos ocultos** para ver `.htaccess` y `.user.ini`.

## 2. Activa PHP 8.3 y HTTPS

1. En **MultiPHP Manager**, asigna **PHP 8.3** al dominio. Algunos proveedores lo muestran en **Select PHP Version**.
2. Verifica las extensiones **PDO**, **pdo_mysql**, **fileinfo**, **session**, **json** y **openssl**. Normalmente ya están disponibles; pide al proveedor que active las faltantes.
3. En **SSL/TLS Status**, ejecuta **AutoSSL** si está disponible y comprueba que el certificado del dominio esté válido. El DNS debe apuntar al hosting. Si el panel no permite emitirlo, solicita al proveedor que lo active.
4. Comprueba que el dominio abre con `https://` y activa **Force HTTPS Redirect** en **Domains**.
5. En **MultiPHP INI Editor**, selecciona el dominio y confirma: `upload_max_filesize=20M`, `post_max_size=24M`, `memory_limit=128M`, `max_execution_time=120`, `display_errors=Off`. También se incluye `.user.ini`; su aplicación puede tardar unos minutos. El servidor puede imponer límites adicionales.

## 3. Crea MySQL

1. Abre **MySQL Database Wizard / Asistente de bases de datos MySQL**, o **Manage My Databases / MySQL Databases**.
2. Crea una base, por ejemplo `fisital`.
3. Crea un usuario, por ejemplo `fisitaluser`, con una contraseña fuerte generada por cPanel. Guárdala en tu gestor de contraseñas.
4. Asocia el usuario a la base y marca **ALL PRIVILEGES / Todos los privilegios**.
5. Anota los nombres COMPLETOS. cPanel suele añadir un prefijo: `tuusuario_fisital` y `tuusuario_fisitaluser`.
6. El host normalmente es `localhost`, puerto `3306`. Si tu proveedor indica otro host o puerto, usa los suyos.

No necesitas importar un SQL en phpMyAdmin: el instalador crea las cuatro tablas. Usa una base nueva para este sitio.

## 4. Sube y extrae los archivos

Estructura del ZIP:

```
fisital-private/
    bootstrap.php
    config.example.php
    schema.sql
    seed.json
    .htaccess
public_html/
    index.php
    admin.php
    api.php
    enlaces.js
    conexion.php
    instalar.php
    .htaccess
    .user.ini
    uploads/.htaccess
LEEME-CPANEL.md
ACTUALIZAR.md
```

Para un dominio cuya raíz sea `/home/TUUSUARIO/public_html`:

1. En **File Manager**, entra a `/home/TUUSUARIO` —el nivel que contiene `public_html`, NO dentro de `public_html`—.
2. Sube `fisitalcr-cpanel.zip` y usa **Extract / Extraer** en `/home/TUUSUARIO`. El ZIP contiene directamente las carpetas indicadas, sin una carpeta adicional exterior.
3. Comprueba que `index.php` está en `/home/TUUSUARIO/public_html/index.php`, y `bootstrap.php` en `/home/TUUSUARIO/fisital-private/bootstrap.php`.
4. Si hay un `index.html` anterior, respáldalo fuera de la raíz pública y retíralo. Conserva las reglas necesarias del `.htaccess` anterior si tu hosting las requiere; el incluido pertenece a este sitio y no contiene un handler PHP específico del proveedor.
5. Borra el ZIP después de extraerlo. El archivo de instrucciones puede quedar fuera de la raíz pública.

**Si el dominio usa otra carpeta:** extrae en una carpeta temporal FUERA de las raíces públicas. Mueve SOLO el contenido de `public_html` a la raíz real del dominio. Mueve `fisital-private` a `/home/TUUSUARIO/fisital-private`, siempre fuera de cualquier raíz pública. Edita el archivo público `conexion.php` para que contenga esta línea, sustituyendo TUUSUARIO:

```php
require '/home/TUUSUARIO/fisital-private/bootstrap.php';
```

No subas `fisital-private` dentro de `public_html`, de una carpeta pública de un dominio adicional ni de la carpeta de un subdominio. No cambies las rutas de los demás archivos PHP.

## 5. Configura la conexión privada

1. En `/home/TUUSUARIO/fisital-private`, copia `config.example.php` con el nombre **config.php**. Conserva el archivo de ejemplo.
2. Usa **Edit / Editar** en `config.php` y reemplaza los valores:

```php
<?php
return [
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'tuusuario_fisital',
    'db_user' => 'tuusuario_fisitaluser',
    'db_password' => 'CONTRASENA_MYSQL_GENERADA_EN_CPANEL',
    'setup_key' => 'CLAVE_ALEATORIA_PRIVADA_DE_AL_MENOS_32_CARACTERES',
    'require_https' => true,
];
```

3. Genera `setup_key` en tu gestor de contraseñas: al menos 32 caracteres aleatorios alfanuméricos. No uses literalmente el texto del ejemplo. Esta clave solo autoriza la instalación inicial y es diferente de las claves MySQL y del panel.
4. Guarda los cambios. Mantén las comillas y las comas de PHP. Si una contraseña MySQL contiene comillas simples o barras invertidas, hay que escaparlas en la cadena PHP (`\'` y `\\`); para facilitar este paso puedes generar una contraseña fuerte que no incluya esos dos caracteres.
5. Permisos recomendados: `config.php` **600**, carpeta privada **700**, carpetas públicas **755**, archivos públicos **644**, `uploads` **755**. No uses 777. En un hosting que ejecute PHP con otro usuario, pide al proveedor los permisos mínimos compatibles.

No pongas credenciales en archivos HTML o JavaScript ni las compartas por chat.

## 6. Ejecuta el instalador una sola vez

1. Abre `https://TU-DOMINIO/instalar.php`.
2. Ingresa la `setup_key` que guardaste en `config.php`.
3. Crea y confirma tu contraseña del panel: mínimo 12 caracteres, máximo 72 bytes. Usa una clave única y guárdala.
4. Pulsa **Instalar sitio**. Debe aparecer **Instalación completada**.
5. Desde File Manager elimina **instalar.php** de la carpeta pública.
6. En `config.php` cambia `setup_key` por una cadena vacía: `'setup_key' => '',`. No cambies los datos de conexión MySQL.

El instalador no se puede ejecutar otra vez una vez creado el administrador, incluso si el archivo no se ha borrado. No viene ninguna contraseña universal predeterminada.

## 7. Entra al panel y personaliza

1. Abre `https://TU-DOMINIO/admin.php` e ingresa la contraseña creada.
2. En **Ajustes**, pon tu correo real y WhatsApp con código de país, por ejemplo `50688880000`. Si no se configura WhatsApp, los botones usan el correo de contacto.
3. En **Inicio (landing)**, revisa títulos, textos, cifras, logo, icono de pestaña y colores. Después de subir cada imagen, espera a que termine la carga y pulsa Guardar cambios para publicarla.
4. En **Portafolio**, reemplaza los proyectos de ejemplo por casos reales o desactiva su visibilidad.
5. En **Noticias**, reemplaza o elimina las tarjetas de ejemplo. Puedes marcar una como destacada.
6. En **Clientes**, agrega los nombres, logos y URLs reales. La sección aparece en el inicio cuando hay clientes visibles; puedes ordenar u ocultar las tarjetas.
7. En **Productos**, puedes indicar una URL HTTPS opcional: se mostrará un botón Visitar sitio que abre otra pestaña. En **Productos** y **Showreel**, configura el contenido real. La carga admite JPG, PNG, WebP, GIF, MP4 y WebM, hasta 20 MB por archivo. Las imágenes subidas desde el panel se reducen a 1600 píxeles por su lado mayor. Para videos grandes utiliza enlaces HTTPS, YouTube o Vimeo.
8. Espera el mensaje de confirmación del guardado. Si aparece un error, el cambio no está confirmado. Si se detecta otra edición simultánea, exporta tus cambios si los necesitas y recarga antes de continuar.
9. Abre el sitio en otro navegador o en incógnito para comprobar que el cambio es público.

Los archivos ya subidos no se borran al quitar su referencia de una tarjeta, para no romper otros usos. Puedes eliminar manualmente archivos sin uso en File Manager después de respaldarlos. El panel debe recargarse para mostrar contactos recibidos desde que lo abriste.

## 8. Lista de comprobación antes de anunciarlo

- El sitio abre por HTTPS, sin errores, en computadora y teléfono.
- Los cambios del panel se ven en un navegador diferente.
- Un formulario de Productos o Noticias muestra confirmación y el contacto aparece en el panel después de recargar.
- Un visitante sin sesión no recibe contactos al abrir `api.php?action=session`.
- Una foto subida se ve desde otro navegador.
- Los botones de WhatsApp abren tu número correcto.
- `instalar.php` ya no existe y la carpeta privada no está dentro de ninguna raíz pública.
- No quedan proyectos, cifras o noticias de ejemplo que puedan confundirse con trabajo real.

## Mantenimiento y respaldo

Usa **Backup Wizard** de cPanel para respaldar la base y los archivos. Como mínimo guarda una exportación SQL de la base, `uploads` y una copia segura de `fisital-private/config.php`. La exportación JSON del panel NO sustituye ese respaldo. Los contactos solo se restauran mediante el respaldo de la base, no mediante la importación de contenido JSON. Conserva los respaldos fuera de las carpetas públicas. Configura el aviso de privacidad aplicable a la recopilación de datos de tus visitantes.

La contraseña del panel se cambia en **Ajustes**. No hay recuperación por correo ni cuentas adicionales en esta versión. Si la pierdes, solicita al administrador del hosting o a un desarrollador restablecer el hash de `fisital_admin.password_hash` con `password_hash()` de PHP e incrementar `auth_version`; no almacenes una contraseña de texto plano ni uses MD5.

## Problemas frecuentes

| Síntoma | Qué revisar |
|---|---|
| Falta config.php | Copia el ejemplo y verifica la ruta privada en conexion.php. |
| Servicio no disponible / error 503 | Abre **Metrics → Errors** o el registro PHP de cPanel. Verifica nombres completos, clave MySQL, host, extensiones y permisos. No actives errores públicos. |
| Access denied / error MySQL 1045 | Clave incorrecta o usuario no asociado con todos los privilegios. |
| Unknown database / error 1049 | Falta el prefijo de cPanel o la base no está creada. |
| could not find driver | Falta `pdo_mysql` en PHP 8.3. |
| Error 500 al subir | Revisa el log y compatibilidad de directivas `.htaccess` con tu proveedor. No borres las reglas de protección sin reemplazarlas por una configuración equivalente. |
| El formulario pide recargar | Sesión o token vencido; recarga por HTTPS y permite cookies. |
| Demasiados intentos | Espera: login hasta la siguiente ventana de 15 minutos; formularios hasta la siguiente ventana de 10 minutos. |
| No sube una imagen/video | Menos de 20 MB, tipo admitido, límites PHP correctos y permisos 755 en uploads. Para videos grandes usa enlace. |
| Se ve una web anterior | Revisa Document Root, index.html antiguo, caché del navegador/CDN y DNS. Excluye admin.php y api.php de cualquier caché del hosting/CDN. |
| El hosting usa proxy SSL y PHP no detecta HTTPS | Pide al proveedor configurar correctamente HTTPS en PHP. Mantén require_https=true en producción. |

## Validación realizada antes de entregar

Probado localmente con Apache, PHP 8.3 y MariaDB 11.4 (protocolo MySQL): instalación, bloqueo de reinstalación, autenticación, cambio de clave, cierre de sesión, guardado, conflictos de revisión, contactos privados, subida de imágenes, rechazo de ejecutables, validación de URLs y CSRF. Se comprobó que Apache bloquea los listados de uploads, el acceso a .user.ini y la ejecución de PHP en uploads. También se recorrió el panel y el sitio con Chromium en tamaño de escritorio y móvil. La base usa SQL compatible con MySQL 5.7+/8 y MariaDB 10.4+, pero no se ha ejecutado en tu hosting ni en un servidor Oracle MySQL durante esta entrega.
