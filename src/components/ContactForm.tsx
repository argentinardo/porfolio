import React, { useState, useRef, useEffect } from 'react';

interface ContactFormProps {
  isVisible: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ isVisible }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Consulta desde la web',
    message: ''
  });
  // Eliminado breadcrumb/origen para evitar redundancia
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible) {
      // Prefill desde localStorage si existe
      try {
        const raw = localStorage.getItem('contactPrefill');
        if (raw) {
          const data = JSON.parse(raw) as Partial<typeof formData>;
          setFormData(prev => ({
            ...prev,
            message: '',
            subject: data.subject ? String(data.subject) : (prev.subject || 'Consulta desde la web')
          }));
          // Limpiar el prefill para no volver a aplicarlo
          localStorage.removeItem('contactPrefill');
        }
      } catch {}

      // Prefill desde parámetros de URL (?subject=...&message=...)
      try {
        const params = new URLSearchParams(window.location.search);
        const subjectParam = params.get('subject');
        const messageParam = params.get('message');
        if (subjectParam || messageParam) {
          setFormData(prev => ({
            ...prev,
            subject: subjectParam ? subjectParam : (prev.subject || 'Consulta desde la web'),
            message: ''
          }));
          // Limpiar los parámetros de la URL para no dejarlos visibles
          try {
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, '', cleanUrl);
          } catch {}
        }
      } catch {}

      if (nameInputRef.current) {
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 100);
      }
    }
  }, [isVisible]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    // Validar mensaje
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Enviar directamente a Formspree (sin PHP)
      const response = await fetch('https://formspree.io/f/mkgzeqbw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Consulta desde la web',
          message: formData.message,
          _replyto: formData.email,
          _subject: 'Nuevo mensaje de contacto - ' + formData.name
        }).toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: 'Consulta desde la web',
          message: ''
        });
        setErrors({});
      } else {
        setSubmitStatus('error');
      }
      
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`contact-form-container ${isVisible ? 'visible' : ''}`}>
      <form 
        onSubmit={handleSubmit} 
        className="contact-form" 
        aria-label="Formulario de contacto" 
        noValidate
      >


        <div className="form-fields">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Tu nombre"
                aria-describedby={errors.name ? 'name-error' : undefined}
                aria-invalid={!!errors.name}
              />
              <span className={`error-message ${errors.name ? 'has-error' : ''}`} id="name-error" role="alert">
                {errors.name || '\u00A0'}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                placeholder="tu@email.com"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
              />
              <span className={`error-message ${errors.email ? 'has-error' : ''}`} id="email-error" role="alert">
                {errors.email || '\u00A0'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Asunto:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={errors.subject ? 'error' : ''}
              placeholder="Consulta desde la web"
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              aria-invalid={!!errors.subject}
            />
            <span className={`error-message ${errors.subject ? 'has-error' : ''}`} id="subject-error" role="alert">
              {errors.subject || '\u00A0'}
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={errors.message ? 'error' : ''}
              rows={4}
              placeholder="Cuéntame sobre tu proyecto..."
              aria-describedby={errors.message ? 'message-error' : undefined}
              aria-invalid={!!errors.message}
            />
            <span className={`error-message ${errors.message ? 'has-error' : ''}`} id="message-error" role="alert">
              {errors.message || '\u00A0'}
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
            aria-describedby={isSubmitting ? 'submitting-status' : undefined}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
          {isSubmitting && <span id="submitting-status" className="sr-only">Enviando formulario...</span>}
          
          {submitStatus === 'success' && (
            <div className="form-message success" role="alert" aria-live="polite">
              ✓ Mensaje enviado
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="form-message error" role="alert" aria-live="polite">
              ✗ Error al enviar
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactForm; 