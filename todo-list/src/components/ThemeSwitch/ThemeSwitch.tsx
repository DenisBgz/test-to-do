import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '../Icon/Icon'
import styles from './ThemeSwitch.module.css'

const themes = [
  { value: 'system', label: 'Системная' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
] as const

type Theme = (typeof themes)[number]['value']
const storageKey = 'todo-list.theme'

function readTheme(): Theme {
  try {
    const value = localStorage.getItem(storageKey)
    if (value === 'light' || value === 'dark') return value
  } catch {
    // Если хранилище недоступно, используем системную тему.
  }
  return 'system'
}

export function ThemeSwitch() {
  const [theme, setTheme] = useState(readTheme)
  const [storageError, setStorageError] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const optionsId = useId()
  const currentLabel = themes.find(option => option.value === theme)?.label

  useLayoutEffect(() => {
    // Устанавливаем тему до отрисовки кадра. Палитра задана в global.css.
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    // Подхватываем выбор темы из другой вкладки, в том числе после очистки хранилища.
    function sync(event: StorageEvent) {
      if (event.storageArea === localStorage && (event.key === storageKey || event.key === null)) {
        setTheme(readTheme())
        setStorageError(false)
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  useEffect(() => {
    if (!expanded) return
    // На телефоне нажатие за пределами раскрытого меню сворачивает его.
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !container.current?.contains(event.target)) {
        setExpanded(false)
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => {
      window.clearTimeout(closeTimer.current)
      document.removeEventListener('pointerdown', closeOutside)
    }
  }, [expanded])

  function closeMenu() {
    if (!expanded) return
    setExpanded(false)
    trigger.current?.focus()
  }

  function select(value: Theme) {
    setTheme(value)
    try {
      localStorage.setItem(storageKey, value)
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }

  function finishSelection(value: Theme) {
    if (!expanded) return
    window.clearTimeout(closeTimer.current)
    if (value === theme || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      closeMenu()
    } else {
      // Даём ползунку дойти до выбранной темы, прежде чем свернуть меню.
      closeTimer.current = window.setTimeout(closeMenu, 240)
    }
  }

  return (
    <div
      ref={container}
      className={styles.wrapper}
      onBlur={event => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
          setExpanded(false)
        }
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && expanded) {
          event.preventDefault()
          closeMenu()
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={styles.trigger}
        aria-label={'Выбор темы: ' + currentLabel}
        aria-expanded={expanded}
        aria-controls={optionsId}
        onClick={() => setExpanded(value => !value)}
      >
        <Icon kind={theme} />
        <span className={styles.chevron} aria-hidden="true" />
      </button>
      <fieldset id={optionsId} className={styles.switch} data-expanded={expanded} data-choice={theme}>
        <legend>Тема оформления</legend>
        {themes.map(({ value, label }) => (
          <label key={value} title={label}>
            <input
              type="radio"
              name="theme"
              checked={theme === value}
              onChange={() => select(value)}
              onClick={() => finishSelection(value)}
            />
            <span><Icon kind={value} />{label}</span>
          </label>
        ))}
      </fieldset>
      {storageError && <small role="status">Не удалось сохранить тему в браузере.</small>}
    </div>
  )
}
