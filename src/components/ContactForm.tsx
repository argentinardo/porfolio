import React, { useState, useRef, useEffect } from 'react';

interface ContactFormProps {
  isVisible: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ isVisible }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Datos del formulario:', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setErrors({});
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`contact-form-container ${isVisible ? 'visible' : ''}`}>
      <form onSubmit={handleSubmit} className="contact-form" aria-label="Formulario de contacto">
        <div className="form-header">
          <p>Envíame un mensaje</p>
        </div>

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
                required
              />
              {errors.name && <span className="error-message" id="name-error" role="alert">{errors.name}</span>}
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
                required
              />
              {errors.email && <span className="error-message" id="email-error" role="alert">{errors.email}</span>}
            </div>
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
              required
            />
            {errors.message && <span className="error-message" id="message-error" role="alert">{errors.message}</span>}
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
        </div>

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
      </form>
    </div>
  );
};

export default ContactForm; 