export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="100"
        y="190"
        style={{
          fontFamily: 'Calibre, "Calibre Medium", sans-serif',
          fontSize: '120px',
          fontWeight: 500,
          fill: 'currentColor',
        }}
      >
        Hofman
      </text>
      <text
        x="530"
        y="190"
        style={{
          fontFamily: 'Calibre, "Calibre Medium", sans-serif',
          fontSize: '120px',
          fontWeight: 500,
          fill: 'currentColor',
        }}
      >
        /
      </text>
      <text
        x="600"
        y="190"
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '126px',
          fontWeight: 600,
          fill: 'currentColor',
        }}
      >
        Studio
      </text>
    </svg>
  );
}
