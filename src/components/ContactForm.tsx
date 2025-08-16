import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, ValidationError } from '@formspree/react';

interface ContactFormProps {
  isVisible: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ isVisible }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: t('contact.form.subject', 'Consulta desde la web'),
    message: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Usar el hook de Formspree
  const [state, handleSubmit] = useForm("mkgzeqbw");

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
            subject: data.subject ? String(data.subject) : (prev.subject || t('contact.form.subject'))
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
            subject: subjectParam ? subjectParam : (prev.subject || t('contact.form.subject')),
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
  }, [isVisible, t]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.errors.nameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('contact.form.errors.nameMinLength');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.errors.emailRequired');
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('contact.form.errors.emailInvalid');
    }

    // Validar mensaje
    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.errors.messageRequired');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.form.errors.messageMinLength');
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Crear un objeto con los datos del formulario para Formspree
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('email', formData.email);
    formDataObj.append('subject', formData.subject);
    formDataObj.append('message', formData.message);

    // Usar el handleSubmit de Formspree
    await handleSubmit(formDataObj);

    // Si el envío fue exitoso, limpiar el formulario
    if (state.succeeded) {
      setFormData({
        name: '',
        email: '',
        subject: t('contact.form.subject'),
        message: ''
      });
      setErrors({});
    }
  };

  return (
    <div className={`contact-form-container ${isVisible ? 'visible' : ''}`}>
      <form 
        onSubmit={handleFormSubmit} 
        className="contact-form" 
        aria-label="Formulario de contacto" 
        noValidate
      >
        <div className="form-fields">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">{t('contact.form.name')}:</label>
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder={t('contact.form.name')}
                aria-describedby={errors.name ? 'name-error' : undefined}
                aria-invalid={!!errors.name}
              />
              <span className={`error-message ${errors.name ? 'has-error' : ''}`} id="name-error" role="alert">
                {errors.name || '\u00A0'}
              </span>
              <ValidationError 
                prefix={t('contact.form.name')} 
                field="name"
                errors={state.errors}
                className="error-message has-error"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('contact.form.email')}:</label>
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
              <ValidationError 
                prefix={t('contact.form.email')} 
                field="email"
                errors={state.errors}
                className="error-message has-error"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">{t('contact.form.subject')}:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={errors.subject ? 'error' : ''}
              placeholder={t('contact.form.subject')}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              aria-invalid={!!errors.subject}
            />
            <span className={`error-message ${errors.subject ? 'has-error' : ''}`} id="subject-error" role="alert">
              {errors.subject || '\u00A0'}
            </span>
            <ValidationError 
              prefix={t('contact.form.subject')} 
              field="subject"
              errors={state.errors}
              className="error-message has-error"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">{t('contact.form.message')}:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={errors.message ? 'error' : ''}
              placeholder={t('contact.form.message')}
              rows={5}
              aria-describedby={errors.message ? 'message-error' : undefined}
              aria-invalid={!!errors.message}
            />
            <span className={`error-message ${errors.message ? 'has-error' : ''}`} id="message-error" role="alert">
              {errors.message || '\u00A0'}
            </span>
            <ValidationError 
              prefix={t('contact.form.message')} 
              field="message"
              errors={state.errors}
              className="error-message has-error"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`submit-btn ${state.submitting ? 'submitting' : ''}`}
            disabled={state.submitting}
            aria-describedby={state.submitting ? 'submitting-status' : undefined}
          >
            {state.submitting ? t('contact.form.sending') : t('contact.form.send')}
          </button>
          {state.submitting && <span id="submitting-status" className="sr-only">{t('contact.form.sending')}</span>}
          
          {state.succeeded && (
            <div className="form-message success" role="alert" aria-live="polite">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {t('contact.form.success')}
            </div>
          )}

          {state.errors && Array.isArray(state.errors) && state.errors.length > 0 && (
            <div className="form-message error" role="alert" aria-live="polite">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {t('contact.form.error')}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactForm; 