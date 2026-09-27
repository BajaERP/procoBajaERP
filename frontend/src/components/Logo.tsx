// Placeholder logo. Replace with the official mark once the brand assets land.
// Flat-top hexagon SVG with PB monogram — adapts to light/dark backgrounds via `tone`.

interface LogoMarkProps {
  size?: number
  tone?: 'light' | 'dark'
  className?: string
}

export function LogoMark({ size = 64, tone = 'light', className }: LogoMarkProps) {
  const s = size
  const cx = s / 2
  const cy = s / 2
  const r = s * 0.44

  // 6 vertices starting at top (-90 deg), stepping 60 deg
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return `${+(cx + r * Math.cos(a)).toFixed(2)},${+(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')

  const id = `clip-${size}`
  const fs = s * 0.3 // monogram font size
  const stripe = s * 0.11

  const fill = tone === 'dark' ? '#ffffff' : '#000000'
  const mono = tone === 'dark' ? '#000000' : '#ffffff'

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className={className}
      aria-label="Proco Baja (logo placeholder)"
      role="img"
    >
      <defs>
        <clipPath id={id}>
          <polygon points={pts} />
        </clipPath>
      </defs>
      {/* Hexagon body */}
      <polygon points={pts} fill={fill} />
      {/* Diagonal speed stripe */}
      <rect
        x={cx - stripe * 0.6}
        y={0}
        width={stripe}
        height={s}
        fill="#e60023"
        opacity={0.18}
        clipPath={`url(#${id})`}
      />
      {/* Border */}
      <polygon points={pts} fill="none" stroke="#e60023" strokeWidth={s * 0.028} />
      {/* Monogram */}
      <text
        x={cx}
        y={cy + fs * 0.36}
        textAnchor="middle"
        fill={mono}
        fontSize={fs}
        fontWeight="700"
        fontFamily="DM Sans, ui-sans-serif, sans-serif"
        letterSpacing={-s * 0.008}
      >
        PB
      </text>
    </svg>
  )
}

interface LogoFullProps {
  markSize?: number
  tone?: 'light' | 'dark'
  className?: string
}

export function LogoFull({ markSize = 48, tone = 'light', className }: LogoFullProps) {
  const textColor = tone === 'dark' ? '#ffffff' : '#000000'
  const subColor = tone === 'dark' ? '#a3a3a3' : '#62625b'

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <LogoMark size={markSize} tone={tone} />
      <div>
        <p
          style={{
            color: textColor,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 700,
            fontSize: markSize * 0.35,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          PROCO BAJA
        </p>
        <p
          style={{
            color: subColor,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500,
            fontSize: markSize * 0.22,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginTop: 1,
          }}
        >
          Sistema de Gestão
        </p>
      </div>
    </div>
  )
}
