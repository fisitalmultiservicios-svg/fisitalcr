# Seis propuestas HTML para Fisital

Galería independiente para elegir una dirección visual. No cambia el sitio instalado, la base de datos ni el panel administrativo.

## Cómo abrirlas en tu computadora

1. Descarga y extrae el ZIP en una carpeta local.
2. Entra en la carpeta `propuestas-fisital`.
3. Abre **index.html** con Chrome o Edge.
4. Selecciona un estilo. La barra inferior permite cambiar entre las seis propuestas.
5. Recorre todas las secciones y prueba el tamaño de la ventana o el menú del teléfono.

No abras los HTML desde dentro del ZIP: primero extrae toda la carpeta. Debe mantenerse `assets` junto a los HTML.

## Para verlas en el hosting sin reemplazar tu web

Este paquete es una galería, no una actualización de los archivos principales.

1. En cPanel entra DENTRO de `public_html`.
2. Sube el paquete de propuestas y extráelo allí.
3. Debe crearse `public_html/propuestas-fisital/index.html`.
4. Abre `https://fisitalcr.com/propuestas-fisital/`.
5. Conserva intacto `public_html/index.php` y todos los archivos de tu sitio actual. Puedes borrar el ZIP de cPanel después de extraerlo.

También se proporciona TAR.GZ con el mismo contenido. Usa solo uno de los paquetes.

## Las seis propuestas

| Número | Estilo | Dirección |
|---|---|---|
| 01 | Aura | Portada centrada, violeta y grandes espacios blancos; la más cercana a la referencia recibida. |
| 02 | Forma | Producto primero, blanco y negro con azul; la más próxima al lenguaje visual de Apple. |
| 03 | Cinema | Negro, cobre y fotografía protagonista; mayor peso al audiovisual y portafolio. |
| 04 | Sistema | Verde mineral y retícula técnica; claridad y confianza para servicios empresariales. |
| 05 | Órbita | Vidrio, azules suaves e interfaces flotantes; ecosistema tecnológico. |
| 06 | Estudio | Crema, naranja y tipografía editorial; carácter de estudio creativo. |

Todas incluyen el contenido público del respaldo: los cuatro productos, seis proyectos, ocho clientes, cinco noticias, servicios, soporte mensual, cifras, contacto y presentación. Se reorganizaron algunos titulares para dar jerarquía visual, conservando la información comercial.

## Qué está funcionando y qué es demostrativo

- Menú y navegación por secciones en computadora y móvil.
- Filtros de portafolio, ventanas de detalle, cierre con Escape y botones de productos/clientes con sus enlaces reales.
- Los enlaces de contacto apuntan al destino configurado en el respaldo.
- Las imágenes del portafolio abren una vista de referencia; se conserva también el enlace al archivo original de tu web.
- La fotografía de estudio es generada como referencia. Las interfaces de productos y los logotipos tipográficos de clientes son composiciones visuales de referencia, no capturas reales de software ni logos oficiales nuevos.
- El showreel del respaldo no tiene un video asignado; se muestra su título y texto con una imagen de referencia.
- El formulario es una demostración: NO envía ni guarda información.
- Estas propuestas todavía NO leen cambios del panel administrativo. Después de elegir un estilo se debe integrar su presentación con el PHP y el panel existentes. Allí se podrán sustituir las imágenes por las definitivas.

El paquete excluye contactos recibidos, contraseñas, archivos de configuración y código PHP del respaldo. No contiene la carpeta uploads recibida, que se decidió no utilizar.

## Vistas previas

- `comparativa.html`: las seis portadas en una sola página con enlaces.
- `vistas-previas/comparativa.jpg`: imagen comparativa.
- `vistas-previas/*-movil.jpg`: portada de cada estilo en teléfono.

Elige un número o indica qué elementos quieres combinar, por ejemplo: «la portada 01 con los productos 02 y el portafolio 03».
