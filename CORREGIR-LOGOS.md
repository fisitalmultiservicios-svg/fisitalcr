# Corregir el tamaño de los logos de clientes

Esta corrección está destinada al sitio que ya tiene instalada la actualización de Órbita. Limita el tamaño de los logos en la franja en movimiento y en las tarjetas de Clientes, además de las vistas previas de imágenes del panel. Conserva la proporción de las imágenes. Los límites esenciales viajan dentro del HTML para que la caché de una hoja de estilos anterior no deje las imágenes a tamaño original.

No modifica el logo de Fisital, las fuentes, colores, fondos, imágenes subidas ni datos de MySQL.

1. Haz una copia de `public_html/index.php` y `public_html/admin.php` desde cPanel.
2. Descarga `fisitalcr-correccion-logos-clientes.zip` desde GitHub.
3. Sube el ZIP a la raíz que contiene `public_html` y `fisital-private` y extráelo allí, aceptando reemplazar archivos. El ZIP contiene `public_html/index.php`, `public_html/admin.php` y esta guía. Si estás dentro de `public_html`, vuelve un nivel antes de extraerlo.
4. Abre la web y el panel y pulsa Ctrl + F5.

No borres ni muevas `uploads`. No reinstales ni importes SQL. Si usas un caché adicional del hosting/CDN, purga la caché de las páginas index.php y admin.php.

También puedes subir manualmente solo los dos archivos PHP de la carpeta `public_html` del ZIP a la carpeta `public_html` de cPanel y reemplazar los existentes.
