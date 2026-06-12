export default function Loading() {
  return (
    <div style={{
      minHeight:'100vh', display:'flex',
      alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)'
    }}>
      <div style={{textAlign:'center'}}>
        <div style={{
          width:'5rem', height:'5rem', margin:'0 auto 1.5rem',
          border:'4px solid #e0e9ff',
          borderTopColor:'#1a365d',
          borderRadius:'50%',
          animation:'spin 1s linear infinite'
        }}/>
        <p style={{color:'#64748b', fontWeight:'600', fontSize:'1.0625rem'}}>
          جاري التحميل...
        </p>
      </div>
    </div>
  );
}
