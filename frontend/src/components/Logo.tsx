import procobajaLogo from '../assets/procobaja-logo.svg'
import procobajaLogoTransparent from '../assets/procobaja-transparente.svg'

// procoBaja logo. The boar mark on a deep-red square (procobaja-logo.svg,
// viewBox 733x733) is the canonical standalone mark — it carries its own
// background so it sits cleanly on any surface. The transparent variant
// (procobaja-transparente.svg, viewBox 565x443) drops the red square and
// keeps only the white boar path — for use on dark chrome where the red
// square would clash with the surrounding bg.

interface LogoMarkProps {
  /** Height in px. For 'solid' the mark is square so width == height.
   *  For 'transparent' the boar is wider than tall — width auto-derives. */
  size?: number
  variant?: 'solid' | 'transparent'
  className?: string
}

export function LogoMark({
  size = 64,
  variant = 'solid',
  className,
}: LogoMarkProps) {
  const src =
    variant === 'transparent' ? procobajaLogoTransparent : procobajaLogo
  // Native aspect of the transparent boar (565/443 ≈ 1.276).
  const width =
    variant === 'transparent' ? Math.round(size * (565 / 443)) : size

  return (
    <img
      src={src}
      alt="procoBaja"
      width={width}
      height={size}
      className={className}
      draggable={false}
      decoding="async"
    />
  )
}

interface LogoFullProps {
  markSize?: number
  variant?: 'solid' | 'transparent'
  className?: string
}

/** Mark + "PROCO BAJA" wordmark stacked beside it. */
export function LogoFull({
  markSize = 48,
  variant = 'solid',
  className,
}: LogoFullProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <LogoMark size={markSize} variant={variant} />
      <div className="leading-none">
        <p
          className="text-ink dark:text-white font-bold tracking-tight"
          style={{ fontSize: markSize * 0.36 }}
        >
          PROCO BAJA
        </p>
        <p
          className="text-mute dark:text-white/40 font-medium uppercase mt-1"
          style={{ fontSize: markSize * 0.22, letterSpacing: '0.08em' }}
        >
          Sistema de Gestão
        </p>
      </div>
    </div>
  )
}
