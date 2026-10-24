<?php
declare(strict_types=1);
require __DIR__.'/conexion.php';
security_headers();
$action=$_GET['action']??'';
$method=$_SERVER['REQUEST_METHOD'];
if ($method==='GET' && $action==='session') json_response(authenticated()?admin_state():['csrf'=>csrf()]);
if ($method!=='POST') fail('Método no permitido.',405);
check_csrf();
if ($action==='login') {
    rate_limit('login',8,900); $b=body(); $password=text($b['password']??'',200);
    $admin=db()->query('SELECT password_hash, auth_version FROM fisital_admin WHERE id=1')->fetch();
    if (!$admin || !password_verify($password,$admin['password_hash'])) fail('Contraseña incorrecta.',401);
    session_regenerate_id(true); $_SESSION['admin']=true; $_SESSION['last']=time();
    $_SESSION['auth_version']=(int)$admin['auth_version']; $_SESSION['csrf']=bin2hex(random_bytes(32));
    json_response(admin_state());
}
if ($action==='lead') {
    $b=body(); if (text($b['website']??'',200)!=='') json_response(['ok'=>true]);
    rate_limit('lead',5,600);
    $empresa=text($b['empresa']??'',150); $tel=text($b['tel']??'',40); $src=text($b['src']??'',30);
    if ($empresa==='' || !preg_match('/^[+0-9 ()-]{7,40}$/D',$tel) || strlen(preg_replace('/\D/','',$tel))<7 || !in_array($src,['Productos','Noticias'],true)) fail('Revisa la empresa y el número de teléfono.');
    $q=db()->prepare('INSERT INTO fisital_leads (empresa,tel,src,created_at) VALUES (?,?,?,UTC_TIMESTAMP())');$q->execute([$empresa,$tel,$src]);
    json_response(['ok'=>true],201);
}
require_admin();
if ($action==='logout') {
    $_SESSION=[]; setcookie(session_name(),'', ['expires'=>time()-3600,'path'=>'/','secure'=>(config()['require_https']??true),'httponly'=>true,'samesite'=>'Lax']);session_destroy();json_response(['ok'=>true]);
}
if ($action==='save') {
    $b=body(); $d=document_data($b['data']??null); $password=text($b['data']['cfg']['pass']??'',200);
    if ($password!=='' && (strlen($password)<12 || strlen($password)>72)) fail('Usa una contraseña de 12 a 72 bytes.');
    if (!is_int($b['revision']??null)) fail('Revisión inválida.');
    $pdo=db();$pdo->beginTransaction();
    try {
        $q=$pdo->prepare('UPDATE fisital_site SET content=?,revision=revision+1 WHERE id=1 AND revision=?');
        $q->execute([json_encode($d,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE),$b['revision']]);
        if ($q->rowCount()!==1) fail('Otro panel modificó el contenido. Exporta tus cambios si los necesitas y recarga la página antes de editar.',409);
        if ($password!=='') {
            $q=$pdo->prepare('UPDATE fisital_admin SET password_hash=?,auth_version=auth_version+1 WHERE id=1');$q->execute([password_hash($password,PASSWORD_DEFAULT)]);
        }
        $pdo->commit();
    } catch (Throwable $e) { if ($pdo->inTransaction()) $pdo->rollBack(); throw $e; }
    if ($password!=='') { $_SESSION['auth_version']++;session_regenerate_id(true); }
    json_response(['ok'=>true,'revision'=>$b['revision']+1]);
}
if ($action==='delete_lead') {
    $b=body();if (!is_int($b['id']??null)||$b['id']<1) fail('Contacto inválido.');
    db()->prepare('DELETE FROM fisital_leads WHERE id=?')->execute([$b['id']]);json_response(['ok'=>true]);
}
if ($action==='upload') {
    $f=$_FILES['file']??null;
    if (!$f || $f['error']!==UPLOAD_ERR_OK) fail('No se recibió el archivo. Revisa upload_max_filesize y post_max_size en cPanel.',413);
    if ($f['size']>20*1024*1024 || $f['size']<1) fail('El archivo debe pesar entre 1 byte y 20 MB.',413);
    $types=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif','video/mp4'=>'mp4','video/webm'=>'webm'];
    $mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
    if (!isset($types[$mime])) fail('Solo se permiten JPG, PNG, WebP, GIF, MP4 o WebM. SVG y archivos ejecutables no están permitidos.');
    if (str_starts_with($mime,'image/')) {
        $size=@getimagesize($f['tmp_name']);
        if (!$size || $size[0]>12000 || $size[1]>12000) fail('Imagen inválida o de dimensiones excesivas.');
    }
    $name=bin2hex(random_bytes(20)).'.'.$types[$mime];
    if (!move_uploaded_file($f['tmp_name'],__DIR__.'/uploads/'.$name)) fail('No se pudo guardar. Revisa los permisos de uploads (755).',503);
    chmod(__DIR__.'/uploads/'.$name,0644);json_response(['url'=>'uploads/'.$name],201);
}
fail('Acción desconocida.',404);
