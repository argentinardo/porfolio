<?php
// Versión usando Formspree - servicio gratuito y confiable para envío de emails
// No requiere configuración de servidor de email

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Método no permitido']);
  exit;
}

// Obtener datos
$contentType = isset($_SERVER['CONTENT_TYPE']) ? strtolower($_SERVER['CONTENT_TYPE']) : '';

if (strpos($contentType, 'application/json') !== false) {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  if (!is_array($data)) { $data = []; }
  $name = isset($data['name']) ? $data['name'] : '';
  $email = isset($data['email']) ? $data['email'] : '';
  $subject = isset($data['subject']) ? $data['subject'] : '';
  $message = isset($data['message']) ? $data['message'] : '';
} else {
  $name = isset($_POST['name']) ? $_POST['name'] : '';
  $email = isset($_POST['email']) ? $_POST['email'] : '';
  $subject = isset($_POST['subject']) ? $_POST['subject'] : '';
  $message = isset($_POST['message']) ? $_POST['message'] : '';
}

// Sanitizar
$name = trim(filter_var($name, FILTER_SANITIZE_STRING));
$email = trim(filter_var($email, FILTER_SANITIZE_EMAIL));
$subject = trim($subject);
$message = trim($message);

// Validar
$errors = [];
if ($name === '' || mb_strlen($name) < 2) { $errors['name'] = 'Nombre inválido'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors['email'] = 'Email inválido'; }
if ($message === '' || mb_strlen($message) < 10) { $errors['message'] = 'Mensaje demasiado corto'; }

if (!empty($errors)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Datos inválidos', 'errors' => $errors]);
  exit;
}

// Configuración Formspree
// IMPORTANTE: Cambiar por tu endpoint de Formspree
$formspreeEndpoint = 'https://formspree.io/f/xayzqkpn'; // Cambiar por tu endpoint real

$emailData = [
  'name' => $name,
  'email' => $email,
  'subject' => $subject ?: 'Consulta desde la web',
  'message' => $message,
  '_replyto' => $email,
  '_subject' => 'Nuevo mensaje de contacto - ' . $name
];

// Enviar a Formspree
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $formspreeEndpoint);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($emailData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/x-www-form-urlencoded',
  'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Log para debug
$logFile = __DIR__ . '/formspree_log.txt';
$logEntry = date('Y-m-d H:i:s') . " - HTTP Code: $httpCode, Response: $response, Error: $error\n";
file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);

if ($httpCode === 200 || $httpCode === 302) {
  echo json_encode(['success' => true, 'message' => '¡Mensaje enviado correctamente!']);
} else {
  http_response_code(500);
  echo json_encode([
    'success' => false, 
    'message' => 'No se pudo enviar el email. Intenta más tarde.',
    'debug' => [
      'http_code' => $httpCode,
      'response' => $response,
      'error' => $error
    ]
  ]);
}

exit;
?>
