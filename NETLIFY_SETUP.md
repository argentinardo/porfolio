# Configuración del Formulario en Netlify

## Pasos para configurar el formulario de contacto:

### 1. Desplegar en Netlify
- Conecta tu repositorio de GitHub a Netlify
- Configura el build command: `npm run build`
- Configura el publish directory: `build`

### 2. Configurar el formulario en Netlify
Una vez desplegado, ve a:
1. **Site settings** > **Forms**
2. Busca el formulario llamado "contact"
3. Haz click en "Edit settings"
4. Configura las notificaciones:
   - **Email notifications**: Agrega tu email
   - **Success page**: `/form-success`

### 3. Configuración de notificaciones (Opcional)
En **Site settings** > **Forms** > **Form notifications**:
- **Email notifications**: Para recibir emails cuando alguien envíe el formulario
- **Slack notifications**: Para recibir notificaciones en Slack
- **Webhooks**: Para integrar con otros servicios

### 4. Campos del formulario
El formulario incluye:
- `name`: Nombre del remitente
- `email`: Email del remitente  
- `message`: Mensaje

### 5. Spam protection
Netlify incluye protección automática contra spam:
- Honeypot fields
- Rate limiting
- Spam filtering

### 6. Personalización
Puedes personalizar:
- **Success page**: La página que se muestra después del envío
- **Email templates**: El formato de los emails de notificación
- **Form submissions**: Ver todos los envíos en el dashboard

## Archivos importantes:
- `src/components/ContactForm.tsx`: Componente del formulario
- `public/form-success.html`: Página de éxito
- `public/_redirects`: Configuración de redirecciones

## Notas:
- El formulario funciona automáticamente una vez desplegado
- No necesitas configuración adicional de backend
- Netlify maneja todo el procesamiento del formulario
- Los envíos se guardan en el dashboard de Netlify 