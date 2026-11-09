import type { CSSProperties } from 'react'
import styles from './Confetti.module.css'

const colors = ['#e76d77', '#eeb446', '#45a999', '#7996e5', '#ad7bc7']

// По индексу меняем дальность, высоту дуги и задержку. При повторной отрисовке траектории остаются прежними.
const pieces = Array.from({ length: 20 }, (_, i) => {
  const x = -98 + (i * 53) % 144
  return {
    '--x': `${x}px`,
    '--crest-x': `${x * 0.6}px`,
    '--crest-y': `${-22 - (i * 19) % 42}px`,
    '--landing-y': `${8 + (i * 11) % 24}px`,
    '--spin': `${(i % 2 ? -1 : 1) * (95 + i * 13)}deg`,
    '--delay': `${i * 4}ms`,
    backgroundColor: colors[i % colors.length],
  } as CSSProperties
})

export function Confetti({ onFinish }: { onFinish: () => void }) {
  // Оба залпа стартуют одновременно. CSS зеркально отражает левый, а последняя частица правого завершает весь эффект.
  return (['left', 'right'] as const).map(side => (
    <span key={side} className={`${styles.burst} ${styles[side]}`} aria-hidden="true">
      {pieces.map((style, i) => (
        <span
          key={i}
          className={styles.piece}
          style={style}
          onAnimationEnd={side === 'right' && i === pieces.length - 1 ? onFinish : undefined}
        />
      ))}
    </span>
  ))
}
