'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  priority: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  general?: string;
}

// تعريف نوع الـ Response
interface SubmitResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: {
    id: number;
    status: string;
  };
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    type: 'general',
    priority: 'normal',
  });
  
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const [errMsg, setErrMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // مسح الخطأ عند التعديل
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrors({});
    setErrMsg('');
    
    try {
      const response = await api.submitContact(form) as SubmitResponse;
      
      if (response && response.success === true) {
        setStatus('success');
        setForm({
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: '',
          type: 'general',
          priority: 'normal',
        });
      } else {
        // عرض أخطاء التحقق من الخادم
        if (response && response.errors) {
          // تحويل أخطاء الخادم إلى صيغة مناسبة
          const formattedErrors: FormErrors = {};
          const errorsData = response.errors; // ✅ تخزين في متغير مؤقت
          
          Object.keys(errorsData).forEach(key => {
            if (key === 'name' || key === 'phone' || key === 'email' || key === 'message') {
              const errorArray = errorsData[key];
              if (errorArray && errorArray.length > 0) {
                formattedErrors[key as keyof FormErrors] = errorArray[0];
              }
            }
          });
          setErrors(formattedErrors);
          setErrMsg(response.message || 'يرجى التحقق من البيانات المدخلة');
        } else {
          setErrMsg(response?.message || 'حدث خطأ، يرجى المحاولة لاحقاً');
        }
        setStatus('error');
      }
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err.message || 'حدث خطأ في الاتصال بالخادم');
    }
  };

  if (status === 'success') {
    return (
      <div style={{
        background: 'white',
        borderRadius: '1.5rem',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          width: '5rem',
          height: '5rem',
          margin: '0 auto 1.5rem',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem'
        }}>
          ✓
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', marginBottom: '0.75rem' }}>
          تم الإرسال بنجاح!
        </h3>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
        </p>
        <button 
          onClick={() => setStatus('idle')} 
          className="btn btn-primary"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'white',
      borderRadius: '1.5rem',
      padding: '2.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
          📨 أرسل رسالتك
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
          املأ النموذج وسنرد عليك في أقرب وقت
        </p>
      </div>

      {/* Name & Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>الاسم الكريم *</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="input-pro"
            placeholder="محمد أحمد"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.name ? '#dc2626' : '#e2e8f0'}`,
              borderRadius: '0.5rem',
              outline: 'none'
            }}
          />
          {errors.name && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</p>}
        </div>
        <div>
          <label style={labelStyle}>رقم الجوال *</label>
          <input
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="input-pro"
            placeholder="+966XXXXXXXXX"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.phone ? '#dc2626' : '#e2e8f0'}`,
              borderRadius: '0.5rem',
              outline: 'none'
            }}
          />
          {errors.phone && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>البريد الإلكتروني *</label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          className="input-pro"
          placeholder="example@email.com"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${errors.email ? '#dc2626' : '#e2e8f0'}`,
            borderRadius: '0.5rem',
            outline: 'none'
          }}
        />
        {errors.email && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>}
      </div>

      {/* Subject */}
      <div>
        <label style={labelStyle}>الموضوع</label>
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="input-pro"
          placeholder="استفسار عن خدمة"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Type & Priority */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>نوع الاستفسار</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="general">عام</option>
            <option value="consultation">استشارة</option>
            <option value="quote">طلب عرض سعر</option>
            <option value="complaint">شكوى</option>
            <option value="suggestion">اقتراح</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>الأولوية</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="normal">عادية</option>
            <option value="high">عالية</option>
            <option value="urgent">عاجلة</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label style={labelStyle}>الرسالة *</label>
        <textarea
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="input-pro"
          style={{
            resize: 'none',
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${errors.message ? '#dc2626' : '#e2e8f0'}`,
            borderRadius: '0.5rem',
            outline: 'none'
          }}
          placeholder="اكتب رسالتك هنا..."
        />
        {errors.message && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.message}</p>}
      </div>

      {/* Error Message */}
      {(status === 'error' || errMsg) && (
        <div style={{
          padding: '1rem',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.75rem',
          color: '#dc2626',
          fontSize: '0.875rem'
        }}>
          ⚠️ {errMsg || 'حدث خطأ، يرجى المحاولة لاحقاً'}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn btn-primary"
        style={{
          padding: '1rem',
          fontSize: '1rem',
          fontWeight: '700',
          background: status === 'loading' ? '#94a3b8' : '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '0.75rem',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: status === 'loading' ? 0.6 : 1
        }}
      >
        {status === 'loading' ? '⏳ جاري الإرسال...' : '🚀 إرسال الرسالة'}
      </button>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#0f172a',
  marginBottom: '0.5rem'
};