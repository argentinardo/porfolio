<?php
// Enviar correo desde formulario de contacto usando PHP (hosting Apache/Linux)
// Responde JSON sin recargar la página

header('Content-Type: application/json; charset=UTF-8');

// Permitir solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Método no permitido']);
  exit;
}

// Obtener datos tanto de JSON como de application/x-www-form-urlencoded
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

// Validar campos mínimos
$errors = [];
if ($name === '' || mb_strlen($name) < 2) { $errors['name'] = 'Nombre inválido'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors['email'] = 'Email inválido'; }
if ($message === '' || mb_strlen($message) < 10) { $errors['message'] = 'Mensaje demasiado corto'; }

if (!empty($errors)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Datos inválidos', 'errors' => $errors]);
  exit;
}

// Configuración de destino
$to = 'damiannardini@gmail.com'; // Cambiar si es necesario

// Construir asunto y cuerpo
$subjectPrefix = 'Contacto Web';
$finalSubject = ($subject !== '' ? "$subjectPrefix: $subject" : $subjectPrefix);

$bodyText = "Nombre: $name\n" .
            "Email: $email\n\n" .
            "Mensaje:\n$message\n";

// Cabeceras
$domain = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
$from = 'no-reply@' . $domain;
$headers = [];
$headers[] = 'From: ' . $from;
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$headersStr = implode("\r\n", $headers);

// Enviar
$sent = @mail($to, '=?UTF-8?B?' . base64_encode($finalSubject) . '?=', $bodyText, $headersStr);

if ($sent) {
  echo json_encode(['success' => true, 'message' => '¡Mensaje enviado correctamente!']);
} else {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'No se pudo enviar el email. Intenta más tarde.']);
}

exit;
?>



