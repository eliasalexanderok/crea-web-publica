<?php
/* ════════════════════════════════════════════════════════════
   CREA · MailerLite proxy  (server-side)
   Recibe el alta del formulario y la reenvía a MailerLite con la
   clave guardada acá (nunca en el navegador).
   Subir este archivo a la MISMA carpeta que index.html en Hostinger.
   Requiere PHP + cURL (vienen por defecto en Hostinger).
════════════════════════════════════════════════════════════ */

header('Content-Type: application/json; charset=utf-8');

/* ── CONFIG ─────────────────────────────────────────────────
   Pegá acá tu API key (la secreta). Esta clave NO se ve desde
   el navegador, sólo vive en el servidor. */
$API_KEY  = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMWM5YTlmZjJlZGZlN2Y3MGIxY2FhZTE0ZTA0ODBjZDVkNmM4ZTBiZDlkNTg5MzdmNDU5YjYwNTgwYjU2NzhkNWE5NDQ0MTFkYTEwODVlZTMiLCJpYXQiOjE3ODIwMjE4NzMuMzU3Njk1LCJuYmYiOjE3ODIwMjE4NzMuMzU3NywiZXhwIjo0OTM3Njk1NDczLjM1MDU4OCwic3ViIjoiMjQ3NzEzOSIsInNjb3BlcyI6W119.ozxBzUoo6Fg24lIFIDQj0meDPErQoiJGbn0sjakICo_lYr5kK7zhJoFcmN-R0ToSS42CUocp0SVPAb2wG_RD_e3X_VrZwRy9qoxd_936vlLGuwVBiT-leuZrKWK6d8WOBfLmQ-3LQ6SUnfF3FqPm7oAfY5Uqpzb76jYbRHwe6573EaeVVwQ-7aotskN8qjviHdCT0lq2gn-f1hIG242OTr-PVJyNojXeKbPcX1NQ9TCuwFF8kXHigzJ3OiwpM22rnuAdb9EjUsl0M0ZDU9lCBcWaQRQORNfUYYvrInoZO3-XLPMutaSM-VUlspJ38HQtNYyzwTHSSAR-64OuAng-b1lktaOxSuaMtCU_C4rm5_10Zfoc-tqR2SL-H1AkP1gzcg_sJOBH36hrmovNrCjWOXxdnsA9IKEpH_eyqSM7rMtXFxVtuL6Ax1pdE1iWZ5G8YdVv9YRpxxMxvJvKsGYhDAJ6O9hTdDrnXef2RiKnN4yN76lf2FMWY3aHabJw4HJc0MOH_Lb4ErAeTqK9GXgAbtbz58R5MJ5SHTCeAKHF_q9rpPoaIrLZfrQzn5q25MDyrFXthzTupPgTEWJf0RnGO16idHd9A8aLsNfdF30Tipoy2A_yi0-taGxLK1rx1hBt_7HHqevKMCFfJD7OWJQ3phxM9KjdmpQl9i12ADEGdbE';

/* (Opcional) ID del grupo "Newsletter CREA". Si lo dejás vacío,
   el contacto entra a la lista general. Para obtenerlo: en
   MailerLite → Subscribers → Groups → abrí el grupo y copiá el
   número que aparece en la URL. */
$GROUP_ID = '';
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
