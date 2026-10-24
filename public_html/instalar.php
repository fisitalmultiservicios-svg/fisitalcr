<?php
declare(strict_types=1);
require __DIR__.'/conexion.php';
security_headers();
csrf();
$pdo=db();
$exists=$pdo->query("SHOW TABLES LIKE 'fisital_admin'")->fetchColumn();
if ($exists && $pdo->query('SELECT id FROM fisital_admin WHERE id=1')->fetchColumn()) fail('La instalación ya está completada. Elimina instalar.php y entra a admin.php.',403);
$error='';$done=false;
if ($_SERVER['REQUEST_METHOD']==='POST') {
    try {
        check_csrf();
        $key=config()['setup_key']??'';
        if (strlen($key)<32 || str_contains($key,'CAMBIAR') || !hash_equals($key,(string)($_POST['setup_key']??''))) fail('Clave de instalación incorrecta. Configura una clave privada aleatoria de al menos 32 caracteres.');
        $password=text($_POST['password']??'',200);
        if (strlen($password)<12 || strlen($password)>72 || $password!==($_POST['confirm']??'')) fail('Las contraseñas deben coincidir y tener de 12 a 72 bytes.');
        // Single connection lock avoids two simultaneous first installations.
        $lock=$pdo->prepare('SELECT GET_LOCK(?,10)');$lock->execute(['fisital-install-'.substr(hash('sha256',config()['db_name']),0,32)]);
        if ((int)$lock->fetchColumn()!==1) fail('Hay otra instalación en curso. Intenta nuevamente.',409);
        foreach (explode(';',file_get_contents(FISITAL_PRIVATE_DIR.'/schema.sql')) as $sql) if (trim($sql)!=='') $pdo->exec($sql);
        $pdo->beginTransaction();
        if ($pdo->query('SELECT id FROM fisital_admin WHERE id=1')->fetchColumn()) fail('La instalación ya está completada.',403);
        $seed=json_decode(file_get_contents(FISITAL_PRIVATE_DIR.'/seed.json'),true,512,JSON_THROW_ON_ERROR);
        $seed=document_data($seed);
        $q=$pdo->prepare('INSERT INTO fisital_site (id,content,revision) VALUES (1,?,1)');$q->execute([json_encode($seed,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR)]);
        $q=$pdo->prepare('INSERT INTO fisital_admin (id,password_hash) VALUES (1,?)');$q->execute([password_hash($password,PASSWORD_DEFAULT)]);
        $pdo->commit();$done=true;
    } catch (HttpError $e) { if ($pdo->inTransaction()) $pdo->rollBack();$error=$e->getMessage(); }
}
?>
<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Instalar Fisital</title><style>body{font:16px/1.6 system-ui;background:#060b17;color:#f1f4fa;max-width:560px;margin:8vh auto;padding:24px}form{display:grid;gap:18px}label{display:grid;gap:5px}input,button{padding:12px;border-radius:8px;border:1px solid #34508a;font:inherit}button{background:#4fd1ff;color:#06101f;cursor:pointer}a{color:#4fd1ff}.error{color:#ff8a8a}</style></head><body><h1>Instalar Fisital</h1>
<?php if ($done): ?>
<p>Instalación completada. Elimina <strong>instalar.php</strong> desde cPanel y borra la clave setup_key de config.php. Después entra al panel.</p><a href="admin.php">Abrir panel administrativo</a>
<?php else: ?>
<p>La base de datos debe estar creada y el usuario debe tener permisos. Este formulario crea las tablas y tu contraseña de administrador.</p>
<p class="error" role="alert"><?=htmlspecialchars($error,ENT_QUOTES,'UTF-8')?></p>
<form method="post"><input type="hidden" name="csrf" value="<?=htmlspecialchars(csrf(),ENT_QUOTES,'UTF-8')?>"><label>Clave privada de instalación (setup_key)<input name="setup_key" type="password" required autocomplete="off"></label><label>Nueva contraseña del panel (mínimo 12 caracteres)<input name="password" type="password" minlength="12" maxlength="72" required autocomplete="new-password"></label><label>Repetir contraseña<input name="confirm" type="password" minlength="12" maxlength="72" required autocomplete="new-password"></label><button>Instalar sitio</button></form>
<?php endif ?></body></html>
