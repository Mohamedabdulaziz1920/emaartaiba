'use client';

import { useState } from 'react';

export default function FAQClient({ faqs }: { faqs: any[] }) {
  const [open, setOpen] = useState<number | null>(0);

  if (!faqs?.length) {
    return (
      <div style={{textAlign:'center', padding:'3rem 0'}}>
        <div style={{fontSize:'4rem', marginBottom:'1rem'}}>❓</div>
        <p style={{color:'#64748b'}}>لا توجد أسئلة متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
      {faqs.map((f: any, i: number) => (
        <div key={f.id} style={{
          background:'white', borderRadius:'1rem', overflow:'hidden',
          border:'1px solid #e8edf5', boxShadow:'0 2px 10px rgba(0,0,0,0.04)',
          transition:'all 0.3s'
        }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width:'100%', padding:'1.25rem 1.5rem',
              background:'transparent', border:'none', cursor:'pointer',
              display:'flex', justifyContent:'space-between', alignItems:'center',
              gap:'1rem', fontFamily:'Cairo, sans-serif',
              textAlign:'right'
            }}>
            <span style={{
              fontSize:'1.0625rem', fontWeight:'700',
              color:'#0f172a', flex:1
            }}>
              {f.question_ar}
            </span>
            <span style={{
              flexShrink:0, width:'2rem', height:'2rem',
              borderRadius:'50%', background: open === i ? '#1a365d' : '#f1f5f9',
              color: open === i ? 'white' : '#64748b',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1.125rem', fontWeight:'700',
              transition:'all 0.3s',
              transform: open === i ? 'rotate(45deg)' : 'rotate(0)'
            }}>
              +
            </span>
          </button>
          {open === i && (
            <div style={{
              padding:'0 1.5rem 1.5rem',
              color:'#64748b', lineHeight:'1.8', fontSize:'0.9375rem',
              animation:'fadeIn 0.3s ease'
            }}>
              {f.answer_ar}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
