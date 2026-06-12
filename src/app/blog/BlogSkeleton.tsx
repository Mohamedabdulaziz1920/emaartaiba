export default function BlogSkeleton() {
  return (
    <div className="skeleton-grid">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-title" />
          <div className="skeleton-text" />
          <div className="skeleton-text short" />
        </div>
      ))}
      <style jsx>{`
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }
        .skeleton-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          padding: 1rem;
        }
        .skeleton-image {
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 0.5rem;
        }
        .skeleton-title {
          height: 24px;
          width: 80%;
          margin: 1rem 0;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        .skeleton-text {
          height: 16px;
          width: 100%;
          margin: 0.5rem 0;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        .skeleton-text.short {
          width: 60%;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}