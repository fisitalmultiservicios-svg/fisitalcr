<?php
declare(strict_types=1);
define('FISITAL_PRIVATE_DIR', __DIR__);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
function fail(string $message, int $status = 400): never { throw new HttpError($message, $status); }
class HttpError extends RuntimeException {}
function json_script(mixed $value): string { return json_encode($value, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR); }
function json_response(mixed $value, int $status = 200): never {
    http_response_code($status); header('Content-Type: application/json; charset=utf-8');
    echo json_encode($value, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR); exit;
}
set_exception_handler(function(Throwable $e): void {
    $status = $e instanceof HttpError ? (int)$e->getCode() : 503;
    $message = $e instanceof HttpError ? $e->getMessage() : 'Servicio no disponible. Revisa la configuración privada y el registro de errores de PHP en cPanel.';
    if (!($e instanceof HttpError)) error_log('Fisital: '.get_class($e).' '.$e->getMessage());
    http_response_code($status);
    header('Cache-Control: no-store');
    if (basename($_SERVER['SCRIPT_NAME'] ?? '') === 'api.php') json_response(['error'=>$message], $status);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="es"><meta charset="utf-8"><title>Fisital</title><p>'.htmlspecialchars($message, ENT_QUOTES, 'UTF-8').'</p></html>';
});
function config(): array {
    static $c;
    if ($c === null) {
        $path = __DIR__.'/config.php';
        if (!is_file($path)) fail('Falta fisital-private/config.php. Sigue la guía de instalación.', 503);
        $c = require $path;
        if (!is_array($c)) fail('Configuración privada inválida.', 503);
    }
    return $c;
}
function security_headers(): void {
    $https = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    if ((config()['require_https'] ?? true) && !$https) fail('Abre este sitio con HTTPS. Activa SSL y Force HTTPS Redirect en cPanel.', 400);
    header('X-Content-Type-Options: nosniff'); header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https: blob:; frame-src https://www.youtube.com https://player.vimeo.com; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'");
    header('Cache-Control: no-store, private');
    if ($https) header('Strict-Transport-Security: max-age=31536000');
}
function session_start_safe(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    ini_set('session.use_strict_mode','1'); ini_set('session.use_only_cookies','1');
    session_name('fisital_session');
    session_set_cookie_params(['httponly'=>true,'secure'=>(config()['require_https'] ?? true),'samesite'=>'Lax','path'=>'/']);
    session_start();
    if (!isset($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
}
function csrf(): string { session_start_safe(); return $_SESSION['csrf']; }
function check_csrf(): void {
    if (!hash_equals(csrf(), $_SERVER['HTTP_X_CSRF_TOKEN'] ?? $_POST['csrf'] ?? '')) fail('La sesión venció. Recarga la página.',403);
}
function db(): PDO {
    static $pdo;
    if (!$pdo) {
        $c=config();
        $pdo=new PDO('mysql:host='.$c['db_host'].';port='.(int)($c['db_port']??3306).';dbname='.$c['db_name'].';charset=utf8mb4', $c['db_user'], $c['db_password'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false]);
    }
    return $pdo;
}
function row(): array {
    $r=db()->query('SELECT content, revision FROM fisital_site WHERE id=1')->fetch();
    if (!$r) fail('Primero completa la instalación en instalar.php.',503);
    return $r;
}
function public_data(): array { $d=json_decode(row()['content'],true,512,JSON_THROW_ON_ERROR); unset($d['cfg']['pass'],$d['leads']); return $d; }
function authenticated(): bool {
    session_start_safe();
    if (!isset($_SESSION['admin']) || time()-($_SESSION['last']??0)>1800) { unset($_SESSION['admin']); return false; }
    $version=(int)db()->query('SELECT auth_version FROM fisital_admin WHERE id=1')->fetchColumn();
    if ($version !== ($_SESSION['auth_version']??0)) { unset($_SESSION['admin']); return false; }
    $_SESSION['last']=time(); return true;
}
function require_admin(): void { if (!authenticated()) fail('Inicia sesión para continuar.',401); }
function admin_state(): array {
    $r=row(); $d=json_decode($r['content'],true,512,JSON_THROW_ON_ERROR);
    $d['leads']=db()->query('SELECT id, empresa, tel, src, created_at AS date FROM fisital_leads ORDER BY id')->fetchAll();
    foreach ($d['leads'] as &$lead) { $lead['id']=(int)$lead['id']; $lead['date']=str_replace(' ','T',$lead['date']).'Z'; }
    return ['data'=>$d,'revision'=>(int)$r['revision'],'csrf'=>csrf()];
}
function body(): array {
    if ((int)($_SERVER['CONTENT_LENGTH']??0)>1500000) fail('La solicitud supera el límite permitido.',413);
    try { $v=json_decode(file_get_contents('php://input'),true,64,JSON_THROW_ON_ERROR); } catch (JsonException) { fail('JSON inválido.'); }
    if (!is_array($v)) fail('Solicitud inválida.'); return $v;
}
function text(mixed $v, int $max=5000): string {
    if (!is_string($v) || strlen($v)>$max || str_contains($v,"\0")) fail('Texto inválido o demasiado largo.'); return trim($v);
}
function media(mixed $v): string {
    $s=text($v,2048); if ($s==='') return '';
    if (preg_match('~^uploads/[a-f0-9]{40}\.(?:jpg|png|webp|gif|mp4|webm)$~D',$s)) return $s;
    if (!filter_var($s,FILTER_VALIDATE_URL) || strtolower(parse_url($s,PHP_URL_SCHEME)??'')!=='https' || parse_url($s,PHP_URL_USER)!==null || preg_match('/[\s\x00-\x1f"<>\\\\]/',$s)) fail('Usa un archivo subido o un enlace HTTPS válido.');
    return $s;
}
function color(mixed $v): string { $s=text($v,7); if (!preg_match('/^#[0-9a-f]{6}$/iD',$s)) fail('Color inválido.'); return $s; }
function document_data(mixed $input): array {
    if (!is_array($input)) fail('Contenido inválido.');
    $schemas=[
        'portfolio'=>['title','cat','year','client','emoji','a','b','vis','img','video'],
        'news'=>['title','cat','date','read','summary','a','b','feat','img'],
        'products'=>['name','icon','status','desc','img'],
    ]; $d=[];
    foreach ($schemas as $key=>$fields) {
        if (!isset($input[$key]) || !is_array($input[$key]) || !array_is_list($input[$key]) || count($input[$key])>500) fail('Lista inválida: '.$key);
        $d[$key]=[]; $ids=[];
        foreach ($input[$key] as $item) {
            if (!is_array($item) || !is_int($item['id']??null) || $item['id']<1 || $item['id']>9007199254740991 || isset($ids[$item['id']])) fail('Identificador inválido o duplicado.');
            $r=['id'=>$item['id']]; $ids[$item['id']]=true;
            foreach ($fields as $field) {
                if (in_array($field,['vis','feat'],true)) { if (!is_bool($item[$field]??null)) fail('Indicador inválido.'); $r[$field]=$item[$field]; }
                elseif (in_array($field,['img','video'],true)) $r[$field]=media($item[$field]??'');
                elseif (in_array($field,['a','b'],true)) $r[$field]=color($item[$field]??'');
                else $r[$field]=text($item[$field]??'',5000);
            }
            $d[$key][]=$r;
        }
    }
    $cfg=$input['cfg']??[]; if (!is_array($cfg)) fail('Ajustes inválidos.');
    $email=text($cfg['email']??'',254); if (!filter_var($email,FILTER_VALIDATE_EMAIL)) fail('Correo inválido.');
    $whatsapp=text($cfg['whatsapp']??'',16); if ($whatsapp!==''&&!preg_match('/^\d{8,15}$/D',$whatsapp)) fail('WhatsApp debe incluir código de país y solo números.');
    $d['cfg']=['email'=>$email,'whatsapp'=>$whatsapp,'waMsg'=>text($cfg['waMsg']??'',1000)];
    foreach (['cats','ncats'] as $key) {
        if (!isset($cfg[$key]) || !is_array($cfg[$key]) || !array_is_list($cfg[$key]) || count($cfg[$key])>50) fail('Categorías inválidas.');
        $d['cfg'][$key]=array_map(fn($v)=>text($v,100),$cfg[$key]);
    }
    $homeKeys=['logo','col1','col2','nav1','nav2','nav3','nav4','nav5','pill','h1a','h1b','sub','b1','b2','av1','av2','av3','avtags','ti1','term','s1n','s1t','s2n','s2t','s3n','s3t','pt1','pt2','pt3','st1','st2','st3','c1','c2','cb','pr1','pr2','pr3','pr4','pf1','pf2','pg1','pg2','pg3','pg4','ng1','ng2','ng3','ng4','foot'];
    $d['home']=[]; if (!is_array($input['home']??[])) fail('Inicio inválido.');
    foreach ($input['home']??[] as $key=>$value) {
        if (!in_array($key,$homeKeys,true)) fail('Campo de inicio desconocido.');
        $d['home'][$key]=$key==='logo'?media($value):(in_array($key,['col1','col2'],true)?color($value):text($value));
    }
    $reel=$input['reel']??[]; if (!is_array($reel)) fail('Showreel inválido.');
    $d['reel']=['title'=>text($reel['title']??'Historias con calidad de cine'),'text'=>text($reel['text']??'Mira nuestro trabajo en acción.'),'poster'=>media($reel['poster']??''),'video'=>media($reel['video']??'')];
    return $d;
}
function rate_limit(string $kind, int $max, int $window): void {
    $key=hash('sha256',$kind.'|'.($_SERVER['REMOTE_ADDR']??'unknown').'|'.(int)(time()/$window));
    $q=db()->prepare('INSERT INTO fisital_limits (bucket,hits,expires_at) VALUES (?,1,?) ON DUPLICATE KEY UPDATE hits=hits+1');$q->execute([$key,time()+$window]);
    $q=db()->prepare('SELECT hits FROM fisital_limits WHERE bucket=?');$q->execute([$key]);
    db()->prepare('DELETE FROM fisital_limits WHERE expires_at<?')->execute([time()-3600]);
    if ((int)$q->fetchColumn()>$max) fail('Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',429);
}
