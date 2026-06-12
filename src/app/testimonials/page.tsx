'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { buildBreadcrumb } from '@/lib/seo';

export default function AddTestimonialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_position: '',
    client_company: '',
    rating: 5,
    content: '',
    agree_terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // مسح الخطأ الخاص بالحقل عند التعديل
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      const response = await api.submitTestimonial(formData);
      
      // ✅ التحقق من نجاح العملية
      if (response && response.success === true) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/testimonials');
        }, 3000);
      } else {
        // ✅ عرض رسائل الخطأ من الخادم
        if (response && response.errors) {
          setErrors(response.errors);
        } else {
          setErrors({ form: [response?.message || 'حدث خطأ في إرسال التقييم'] });
        }
      }
    } catch (err: any) {
      console.error('Error:', err);
      setErrors({ form: [err.message || 'حدث خطأ في الاتصال بالخادم'] });
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = buildBreadcrumb({ 
    name: 'إضافة رأي', 
    url: '/testimonials/add' 
  });

  if (success) {
    return (
      <div className="container-custom" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '1rem' }}>
            تم إرسال تقييمك بنجاح!
          </h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            شكراً لك على مشاركتنا رأيك. سيتم مراجعة التقييم ونشره قريباً.
          </p>
          <Link href="/testimonials" style={{ color: '#f59e0b', textDecoration: 'none' }}>
            العودة إلى آراء العملاء →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
        color: 'white',
        padding: '3rem 0',
        position: 'relative'
      }}>
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <Breadcrumb items={breadcrumbs} variant="dark" />
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '900', marginBottom: '0.5rem' }}>
            أضف رأيك
          </h1>
          <p style={{ color: '#cbd5e0' }}>شاركنا تجربتك معنا لنساعد الآخرين في اختيار الأفضل</p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding" style={{ background: '#f8faff' }}>
        <div className="container-custom">
          <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            
            {errors.form && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                {errors.form.join(', ')}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                  الاسم *
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.client_name ? '#dc2626' : '#e2e8f0'}`,
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                />
                {errors.client_name && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.client_name[0]}</p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.client_email ? '#dc2626' : '#e2e8f0'}`,
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                />
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>لن يتم نشر بريدك الإلكتروني، يستخدم للتحقق فقط</p>
                {errors.client_email && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.client_email[0]}</p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                  تقييمك *
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                >
                  <option value={5}>★★★★★ - ممتاز</option>
                  <option value={4}>★★★★☆ - جيد جداً</option>
                  <option value={3}>★★★☆☆ - جيد</option>
                  <option value={2}>★★☆☆☆ - مقبول</option>
                  <option value={1}>★☆☆☆☆ - ضعيف</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                  المنصب/الوظيفة
                </label>
                <input
                  type="text"
                  name="client_position"
                  value={formData.client_position}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                  اسم الشركة
                </label>
                <input
                  type="text"
                  name="client_company"
                  value={formData.client_company}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                  رأيك *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="اكتب تجربتك معنا..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.content ? '#dc2626' : '#e2e8f0'}`,
                    borderRadius: '0.5rem',
                    outline: 'none',
                    fontSize: '0.9375rem',
                    resize: 'vertical'
                  }}
                />
                {errors.content && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.content[0]}</p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="agree_terms"
                    checked={formData.agree_terms}
                    onChange={handleChange}
                    required
                  />
                  <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                    أوافق على <Link href="/privacy" style={{ color: '#f59e0b' }}>سياسة الخصوصية</Link> والشروط
                  </span>
                </label>
                {errors.agree_terms && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.agree_terms[0]}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: loading ? '#94a3b8' : '#f59e0b',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}