import { useState, type ImgHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> & {
  onError?: () => void
}

/**
 * Image that stays invisible until its pixels have actually decoded, then
 * fades/slightly scales in. Prevents the 0 → broken-frame → image flash when
 * a CMS URL takes a few hundred ms to arrive over the network.
 */
export function FadeInImage({ onError, className, alt = '', src, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.img
      {...rest}
      src={src}
      alt={alt}
      className={className}
      initial={false}
      animate={{
        opacity: loaded ? 1 : 0,
        scale: loaded ? 1 : 1.04,
        filter: loaded ? 'blur(0px)' : 'blur(6px)',
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onLoad={() => setLoaded(true)}
      onError={() => onError?.()}
    />
  )
}
