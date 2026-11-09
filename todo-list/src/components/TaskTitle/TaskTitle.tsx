import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { TaskFlight } from '../../animations/textFlight'
import styles from './TaskTitle.module.css'

type Props = { done: boolean; title: string; origin?: TaskFlight['origin'] }

export function TaskTitle({ done, title, origin }: Props) {
  // Запоминаем точку старта на время перелёта. При уменьшенном движении сразу показываем обычный заголовок.
  const [launch, setLaunch] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? undefined : origin
  )
  const anchor = useRef<HTMLSpanElement>(null)
  const copy = useRef<HTMLSpanElement>(null)

  function updateDestination() {
    const element = copy.current
    if (!launch || !element || !anchor.current) return
    const target = anchor.current.getBoundingClientRect()
    const page = launch.container.getBoundingClientRect()
    element.style.setProperty('--travel-x', target.left - page.left - launch.left + 'px')
    element.style.setProperty('--travel-y', target.top - page.top - launch.top + 'px')
    element.style.setProperty('--label-width', target.width + 'px')
    const lines = anchor.current.firstElementChild?.getClientRects()
    // Одинаковая однострочная надпись может лететь как одна копия. Для перенесённого текста нужны две.
    element.toggleAttribute('data-same-line', Boolean(
      launch.value === title && !launch.scroll && lines?.length === 1 && lines[0].width <= launch.width
    ))
  }

  // При быстром добавлении задач следующая строка может сдвинуть цель ещё во время перелёта.
  useLayoutEffect(updateDestination)

  useLayoutEffect(() => {
    if (!launch) return
    // Слушаем прокрутку в фазе захвата, чтобы отслеживать и внутренний список.
    document.addEventListener('scroll', updateDestination, true)
    window.addEventListener('resize', updateDestination)
    const viewport = window.visualViewport
    viewport?.addEventListener('resize', updateDestination)
    viewport?.addEventListener('scroll', updateDestination)
    return () => {
      document.removeEventListener('scroll', updateDestination, true)
      window.removeEventListener('resize', updateDestination)
      viewport?.removeEventListener('resize', updateDestination)
      viewport?.removeEventListener('scroll', updateDestination)
    }
  }, [launch])

  return (
    <span ref={anchor} className={styles.taskTitle} data-done={done || undefined}>
      <span className={launch ? styles.reservedText : undefined}>{title}</span>
      {launch && createPortal(
        <span
          ref={copy}
          className={styles.flyingText}
          style={{ left: launch.left, top: launch.top }}
          aria-hidden="true"
          onAnimationEnd={event => {
            // Когда копия долетела, открываем настоящий заголовок и убираем копию из портала.
            if (event.target === event.currentTarget) setLaunch(undefined)
          }}
        >
          <span className={styles.inputCopy} style={{ width: launch.width }}>
            <span style={{ transform: `translateX(${-launch.scroll}px)` }}>{launch.value}</span>
          </span>
          <span className={styles.labelCopy}>{title}</span>
        </span>,
        launch.container,
      )}
    </span>
  )
}
