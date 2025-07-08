# Configuración de Netlify y Resend para el Formulario de Contacto

## Resend.com API

El formulario de contacto utiliza la API de Resend.com para enviar emails directamente a `damiannardini@gmail.com`.

### Configuración

1. **API Key**: La API key de Resend está configurada en `public/api/send-email.js`
2. **Email de destino**: Todos los mensajes se envían a `damiannardini@gmail.com`
3. **Email de origen**: Los emails se envían desde `noreply@damiannardini.com`

### Funcionamiento

1. El usuario llena el formulario de contacto
2. Los datos se envían a `/api/send-email` (Netlify Function)
3. La función valida los datos y envía el email usando Resend API
4. Se devuelve una respuesta de éxito o error al frontend

### Estructura del Email

Los emails incluyen:
- Nombre del remitente
- Email del remitente
- Mensaje completo
- Configuración de reply-to para responder directamente

### Variables de Entorno (Opcional)

Para mayor seguridad, puedes configurar las variables de entorno en Netlify:

1. Ve a tu dashboard de Netlify
2. Settings > Environment variables
3. Agrega:
   - `RESEND_API_KEY`: `re_Rotvio5b_E7pScwh4xCUgt1zNEj4sg6Wt`
   - `TO_EMAIL`: `damiannardini@gmail.com`

Luego actualiza `public/api/send-email.js` para usar:
```javascript
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;
```

### Monitoreo

- Los logs de la función aparecen en el dashboard de Netlify
- Los emails enviados se pueden ver en el dashboard de Resend
- Los errores se registran en la consola del navegador

### Seguridad

- Validación de campos en frontend y backend
- Validación de formato de email
- Manejo de errores robusto
- Rate limiting automático de Netlify Functions 