import { useEffect, useState } from 'react'
import { Confetti } from '../Confetti/Confetti'
import styles from './TaskProgress.module.css'

export function TaskProgress({ done, total }: { done: number; total: number }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const ratio = total ? done / total : 0
  const complete = ratio === 1
  // Показываем 100% только после выполнения всех задач, даже если доля округлилась бы до 100 раньше.
  const percent = complete ? 100 : Math.min(99, Math.round(ratio * 100))
  useEffect(() => {
    if (!complete) setShowConfetti(false)
  }, [complete])

  return (
    <section className={styles.panel} aria-label="Прогресс задач">
      <div className={styles.summary}>
        <span>Выполнено <strong>{done} из {total}</strong></span>
        <strong>{percent}%</strong>
      </div>
      <div className={styles.meter}>
        <div
          className={styles.track}
          role="progressbar"
          aria-label="Прогресс выполнения"
          aria-valuenow={percent}
          aria-valuetext={`${done} из ${total}`}
        >
          <span
            className={styles.fill}
            style={{ transform: `scaleX(${ratio})` }}
            onTransitionEnd={event => {
              // Запускаем конфетти, когда полоса доходит до края. При загрузке уже готового списка перехода нет.
              if (event.propertyName === 'transform' && complete) setShowConfetti(true)
            }}
          />
        </div>
        {showConfetti && complete && <Confetti onFinish={() => setShowConfetti(false)} />}
      </div>
    </section>
  )
}
