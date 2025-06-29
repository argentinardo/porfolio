import React, { useState, useRef, useEffect } from 'react';

interface ContactFormProps {
  isVisible: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ isVisible }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-header">
          <p>Envíame un mensaje</p>
        </div>

        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={6}
              placeholder="Cuéntame sobre tu proyecto..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>

        {submitStatus === 'success' && (
          <div className="form-message success">
            ✓ Mensaje enviado
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="form-message error">
            ✗ Error al enviar
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm; 