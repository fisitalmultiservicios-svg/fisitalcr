# FisitalCR

**Instalaciones existentes:** [descargar actualización](https://github.com/fisitalmultiservicios-svg/fisitalcr/raw/refs/heads/main/descargas/fisitalcr-cpanel-actualizacion.zip) y seguir [ACTUALIZAR.md](ACTUALIZAR.md). Incluye videos externos (Facebook/Reels, YouTube/Shorts, Vimeo, Drive, MP4/WebM), portadas cuando el proveedor las ofrece y destinos web o wa.me para el contacto, clientes y productos; además de las mejoras anteriores. No requiere reinstalar ni cambiar la base de datos.

[Descargar ZIP para cPanel](https://github.com/fisitalmultiservicios-svg/fisitalcr/raw/refs/heads/main/descargas/fisitalcr-cpanel.zip) · [Guía de instalación en cPanel](LEEME-CPANEL.md)

Sitio y panel basados en los HTML entregados por el usuario. PHP 8.3, PDO MySQL y almacenamiento de medios en filesystem; sin dependencias de aplicación externas.

La guía para el hosting está en [LEEME-CPANEL.md](LEEME-CPANEL.md). El ZIP de entrega debe contener `public_html`, `fisital-private` (sin `config.php`) y esa guía. No incluir `.git`, archivos de pruebas, credenciales locales ni medios de pruebas.

Para desarrollo, usar este checkout aislado; no crear un worktree salvo petición expresa. `tools/Dockerfile` prepara PHP 8.3 con PDO MySQL. Necesita una instancia MySQL/MariaDB y `fisital-private/config.php` privado. En local puede usarse `require_https=false`; producción requiere HTTPS.

Validación: `python3 tests/smoke.py` sobre base LOCAL VACÍA y `node tests/browser.cjs` y `node tests/branding-mobile.cjs` y `node tests/clients.cjs` después. Consultar las cabeceras de ambos archivos para requisitos. Son pruebas destructivas de datos exclusivamente locales; no ejecutarlas contra producción. Las pruebas del navegador requieren Playwright y Chromium. No desplegar herramientas ni pruebas en la raíz pública.

Pruebas de enlaces: `node tests/enlaces.cjs`. Después de las pruebas de navegador anteriores, ejecutar `node tests/videos-contact.cjs`; los proveedores externos se simulan y sus permisos reales deben comprobarse en el hosting.
