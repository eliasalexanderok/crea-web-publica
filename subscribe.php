<?php
/* ════════════════════════════════════════════════════════════
   CREA · MailerLite proxy  (server-side)
   Recibe el alta del formulario y la reenvía a MailerLite con la
   clave guardada en config.php (nunca en el navegador, nunca en Git).
   Subir este archivo a la MISMA carpeta que index.html en Hostinger.
   Requiere PHP + cURL (vienen por defecto en Hostinger).
════════════════════════════════════════════════════════════ */

header('Content-Type: application/json; charset=utf-8');

/* ── CONFIG ─────────────────────────────────────────────────
   La API key NO se guarda en este archivo (este SÍ va a GitHub).
   Vive en `config.php`, que queda solo en el servidor y está
   excluido de Git. En Hostinger: copiá `config.example.php`
   como `config.php` y pegá adentro tu API key nueva. */
$API_KEY  = '';
$GROUP_ID = '';

if (is_readable(__DIR__ . '/config.php')) {
  require __DIR__ . '/config.php';
}

/* Si no hay clave configurada, cortamos acá. */
if ($API_KEY === '') {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'missing_config']);
  exit;
}
/* ──────────────────────────────────────────────────────────── */

/* Sólo aceptamos POST */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
  exit;
}

/* Leer el cuerpo JSON enviado por el formulario */
$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);
$email = isset($input['email'])  ? trim($input['email'])  : '';
$name  = isset($input['nombre']) ? trim($input['nombre']) : '';

/* Validar email */
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'invalid_email']);
  exit;
}

/* Armar payload para MailerLite */
$payload = ['email' => $email];
if ($name !== '')     $payload['fields'] = ['name' => $name];
if ($GROUP_ID !== '') $payload['groups'] = [$GROUP_ID];

/* Llamar a la API de MailerLite desde el servidor */
$ch = curl_init('https://connect.mailerlite.com/api/subscribers');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST           => true,
  CURLOPT_HTTPHEADER     => [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $API_KEY,
  ],
  CURLOPT_POSTFIELDS     => json_encode($payload),
  CURLOPT_TIMEOUT        => 15,
]);
$response = curl_exec($ch);
$code     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err      = curl_error($ch);
curl_close($ch);

/* Responder al navegador (sin filtrar datos sensibles) */
$ok = ($code === 200 || $code === 201);
http_response_code($ok ? 200 : 502);
echo json_encode([
  'ok'     => $ok,
  'status' => $code,
  'error'  => $ok ? null : ($err ?: 'mailerlite_error'),
]);
