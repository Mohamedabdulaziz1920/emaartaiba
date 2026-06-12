import { api } from '@/lib/api';
import type { Metadata } from 'next';
import FAQClient from '@/components/shared/FAQClient';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة',
  description: 'إجابات على أكثر الأسئلة شيوعاً حول خدمات المقاولات والبناء.',
};

export default async function FAQPage() {
  const faqs = await api.faqs().catch(() => []);

  return (
    <div>
      <section style={{
        background:'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
        color:'white', padding:'5rem 0 6rem',
        position:'relative', overflow:'hidden'
      }}>
        <div className="container-custom" style={{position:'relative', zIndex:1, textAlign:'center'}}>
          <span className="section-badge animate-fadeInUp"
                style={{background:'rgba(237,137,54,0.15)', color:'#fbd38d'}}>
            ❓ الأسئلة الشائعة
          </span>
          <h1 className="animate-fadeInUp animation-delay-100" style={{
            fontSize:'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight:'900', marginBottom:'1rem'
          }}>
            إجابات على <span className="text-gradient-orange">أسئلتك</span>
          </h1>
          <p className="animate-fadeInUp animation-delay-200" style={{
            color:'#cbd5e0', fontSize:'1.125rem', maxWidth:'40rem', margin:'0 auto'
          }}>
            تعرف على إجابات أكثر الأسئلة شيوعاً
          </p>
        </div>
        <div style={{position:'absolute', bottom:0, left:0, right:0, lineHeight:0}}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
               style={{display:'block', width:'100%', height:'60px'}}>
            <path d="M0,80 C320,20 720,20 1440,80 L1440,80 L0,80 Z" fill="#f8faff"/>
          </svg>
        </div>
      </section>

      <section className="section-padding" style={{background:'#f8faff'}}>
        <div className="container-custom" style={{maxWidth:'52rem'}}>
          <FAQClient faqs={faqs as any[]}/>
        </div>
      </section>
    </div>
  );
}
