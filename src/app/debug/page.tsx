import { api } from '@/lib/api';

export default async function DebugPage() {
  const results: Record<string, any> = {};
  const errors: Record<string, string> = {};

  const endpoints = [
    { name: 'settings', fn: () => api.settings() },
    { name: 'heroSlides', fn: () => api.heroSlides() },
    { name: 'featuredServices', fn: () => api.featuredServices() },
    { name: 'featuredProjects', fn: () => api.featuredProjects() },
    { name: 'testimonials', fn: () => api.testimonials() },
    { name: 'partners', fn: () => api.partners() },
    { name: 'latestBlogs', fn: () => api.latestBlogs() },
  ];

  for (const { name, fn } of endpoints) {
    try {
      const data = await fn();
      results[name] = data;
    } catch (e: any) {
      errors[name] = e.message || 'Unknown error';
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', direction: 'ltr' }}>
      <h1>🔍 API Debug Page</h1>
      
      <h2 style={{ color: 'red' }}>❌ Errors ({Object.keys(errors).length})</h2>
      <pre style={{ background: '#fee', padding: '1rem', borderRadius: '8px' }}>
        {JSON.stringify(errors, null, 2)}
      </pre>

      <h2 style={{ color: 'green' }}>✅ Successful Results</h2>
      {Object.entries(results).map(([name, data]) => (
        <div key={name} style={{ marginBottom: '2rem' }}>
          <h3 style={{ background: '#1e293b', color: '#fff', padding: '.5rem 1rem', borderRadius: '8px' }}>
            📦 {name}
          </h3>
          <div style={{ padding: '0 1rem' }}>
            <p><strong>Type:</strong> {Array.isArray(data) ? 'Array' : typeof data}</p>
            <p><strong>Is Array:</strong> {Array.isArray(data) ? `Yes (${data.length} items)` : 'No'}</p>
            {!Array.isArray(data) && data && typeof data === 'object' && (
              <p><strong>Keys:</strong> {Object.keys(data).join(', ')}</p>
            )}
            <details>
              <summary style={{ cursor: 'pointer', padding: '.5rem', background: '#f1f5f9' }}>
                Show Raw Data
              </summary>
              <pre style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '8px',
                maxHeight: '400px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      ))}
    </div>
  );
}

export const dynamic = 'force-dynamic';