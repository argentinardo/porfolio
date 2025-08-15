<?php
// Versión de respaldo usando API externa para envío de emails
// Útil cuando el servidor no tiene configurado mail() de PHP

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

// Configuración
$to = 'damiannardini@gmail.com';
$subjectPrefix = 'Contacto Web';
$finalSubject = ($subject !== '' ? "$subjectPrefix: $subject" : $subjectPrefix);

$bodyText = "Nombre: $name\n" .
            "Email: $email\n\n" .
            "Mensaje:\n$message\n\n" .
            "---\n" .
            "Enviado desde: " . $_SERVER['HTTP_HOST'] . "\n" .
            "Fecha: " . date('Y-m-d H:i:s') . "\n" .
            "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Intentar con mail() primero
$domain = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
$from = 'no-reply@' . $domain;
$headers = [
  'From: ' . $from,
  'Reply-To: ' . $email,
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'X-Mailer: PHP/' . phpversion()
];

$headersStr = implode("\r\n", $headers);
$sent = @mail($to, '=?UTF-8?B?' . base64_encode($finalSubject) . '?=', $bodyText, $headersStr);

if ($sent) {
  echo json_encode(['success' => true, 'message' => '¡Mensaje enviado correctamente!']);
  exit;
}

// Si mail() falla, usar API externa (ejemplo con EmailJS o similar)
// NOTA: Necesitarás configurar una API key real
$apiKey = 'TU_API_KEY_AQUI'; // Cambiar por tu API key real
$apiUrl = 'https://api.emailjs.com/api/v1.0/email/send';

$emailData = [
  'service_id' => 'TU_SERVICE_ID',
  'template_id' => 'TU_TEMPLATE_ID',
  'user_id' => $apiKey,
  'template_params' => [
    'to_email' => $to,
    'from_name' => $name,
    'from_email' => $email,
    'subject' => $finalSubject,
    'message' => $message
  ]
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
  echo json_encode(['success' => true, 'message' => '¡Mensaje enviado correctamente!']);
} else {
  http_response_code(500);
  echo json_encode([
    'success' => false, 
    'message' => 'No se pudo enviar el email. Contacta al administrador.',
    'debug' => [
      'http_code' => $httpCode,
      'response' => $response
    ]
  ]);
}

exit;
?>
