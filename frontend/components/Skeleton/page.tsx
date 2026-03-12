export default function Skeleton() {
  return (
    <div
      style={{
        width: '100%',
        height: 20,
        background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
        borderRadius: 4,
        marginBottom: 10,
      }}
    >
      <style>{`@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}</style>
    </div>
  )
}