<?php
// Copiar como config.php. Esta carpeta debe quedar FUERA de la raíz pública.
return [
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'USUARIOCPANEL_fisital',
    'db_user' => 'USUARIOCPANEL_fisitaluser',
    'db_password' => 'CAMBIAR_POR_LA_CLAVE_MYSQL',
    // Crear una clave aleatoria privada de al menos 32 caracteres, sin espacios.
    'setup_key' => 'CAMBIAR_POR_CLAVE_ALEATORIA_DE_32_CARACTERES',
    // Mantener true en el hosting; el dominio debe tener HTTPS activo.
    'require_https' => true,
];
