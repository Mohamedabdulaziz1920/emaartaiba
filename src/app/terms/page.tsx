import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'الشروط والأحكام',
  description: 'الشروط والأحكام الخاصة بخدمات شركة البناء المتميز.',
};

export default function TermsPage() {
  return (
    <div>
      <section style={{
        background:'linear-gradient(135deg, #0f1729 0%, #1a365d 50%, #2b6cb0 100%)',
        color:'white', padding:'4rem 0 5rem',
        position:'relative', overflow:'hidden'
      }}>
        <div className="container-custom" style={{position:'relative', zIndex:1, textAlign:'center'}}>
          <span className="section-badge"
                style={{background:'rgba(237,137,54,0.15)', color:'#fbd38d'}}>
            📋 الشروط
          </span>
          <h1 style={{fontSize:'clamp(2rem, 4vw, 2.75rem)', fontWeight:'900', marginBottom:'0.75rem'}}>
            الشروط والأحكام
          </h1>
          <p style={{color:'#cbd5e0', fontSize:'1rem'}}>
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
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
          <div style={{
            background:'white', borderRadius:'1.5rem', padding:'2.5rem',
            boxShadow:'0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <Section title="📌 قبول الشروط">
              باستخدامك لموقع شركة البناء المتميز، فإنك توافق على الالتزام بهذه الشروط والأحكام.
              إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
            </Section>

            <Section title="🏢 خدماتنا">
              نقدم خدمات المقاولات العامة بما فيها بناء الفلل والمشاريع التجارية والتشطيبات
              والترميم والصيانة. جميع الخدمات تخضع لاتفاقية منفصلة مع العميل.
            </Section>

            <Section title="💰 الأسعار والدفع">
              <ul style={listStyle}>
                <li>الأسعار المعروضة على الموقع تقديرية وقابلة للتغيير</li>
                <li>السعر النهائي يحدد بعد المعاينة وتقديم العرض المفصل</li>
                <li>شروط الدفع تحدد في عقد العمل</li>
              </ul>
            </Section>

            <Section title="📐 مسؤولية المحتوى">
              نسعى لتقديم معلومات دقيقة على موقعنا، لكننا لا نضمن دقة جميع المعلومات في كل الأوقات.
              المحتوى قابل للتغيير دون إشعار مسبق.
            </Section>

            <Section title="⚖️ حقوق الملكية الفكرية">
              جميع المحتويات على هذا الموقع (نصوص، صور، شعارات) محمية بحقوق الملكية الفكرية
              وهي ملك لشركة البناء المتميز. لا يجوز نسخها أو إعادة استخدامها بدون إذن مكتوب.
            </Section>

            <Section title="📞 التواصل">
              لأي استفسارات حول الشروط والأحكام، يرجى زيارة صفحة{' '}
              <Link href="/contact" style={{color:'#1a365d', fontWeight:'700'}}>
                التواصل معنا
              </Link>.
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{marginBottom:'2rem'}}>
      <h2 style={{fontSize:'1.375rem', fontWeight:'800', color:'#0f172a', marginBottom:'0.875rem'}}>
        {title}
      </h2>
      <div style={{color:'#475569', lineHeight:'1.9', fontSize:'1rem'}}>
        {children}
      </div>
    </div>
  );
}

const listStyle: React.CSSProperties = {
  paddingRight:'1.5rem', display:'flex',
  flexDirection:'column', gap:'0.5rem'
};
