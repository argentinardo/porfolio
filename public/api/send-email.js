const RESEND_API_KEY = 're_Rotvio5b_E7pScwh4xCUgt1zNEj4sg6Wt';
const TO_EMAIL = 'damiannardini@gmail.com';

exports.handler = async function(event) {
  // Verificar que sea una petición POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' })
    };
  }

  try {
    // Parsear el cuerpo de la petición
    const { name, email, message } = JSON.parse(event.body);

    // Validar campos requeridos
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Todos los campos son requeridos' })
      };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Formato de email inválido' })
      };
    }

    // Preparar el contenido del email
    const emailContent = `
      <h2>Nuevo mensaje de contacto desde tu portfolio</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>Enviado desde tu portfolio web</em></p>
    `;

    // Enviar email usando Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Portfolio <noreply@damiannardini.com>',
        to: [TO_EMAIL],
        subject: `Nuevo mensaje de ${name} desde tu portfolio`,
        html: emailContent,
        reply_to: email
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      throw new Error('Error al enviar el email');
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Email enviado correctamente',
        id: result.id 
      })
    };

  } catch (error) {
    console.error('Error en send-email function:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error interno del servidor',
        error: error.message 
      })
    };
  }
}; 