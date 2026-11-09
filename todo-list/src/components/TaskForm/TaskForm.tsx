import { useRef, useState, type FormEvent } from 'react'
import { Icon } from '../Icon/Icon'
import styles from './TaskForm.module.css'

type Props = {
  onAdd: (title: string, input: HTMLInputElement) => void
}

export function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [quietFocus, setQuietFocus] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Название сохраняем без пробелов по краям. Для перелёта передаём поле с исходным текстом до очистки.
    const value = title.trim()
    if (value && input.current) {
      onAdd(value, input.current)
      setTitle('')
    }
    // Возвращаем курсор в поле для следующей задачи без обводки и сдвига прокрутки.
    setQuietFocus(true)
    input.current?.focus({ preventScroll: true })
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <input
        ref={input}
        value={title}
        data-quiet-focus={quietFocus || undefined}
        onPointerDown={() => setQuietFocus(true)}
        onBlur={() => setQuietFocus(false)}
        onChange={event => setTitle(event.target.value)}
        aria-label="Название новой задачи"
        placeholder="Что нужно сделать?"
        autoComplete="off"
      />
      <button
        type="submit"
        aria-label="Добавить задачу"
        onPointerDown={event => {
          // При касании кнопки сохраняем фокус в поле, чтобы клавиатура не закрывалась во время перелёта.
          if (event.pointerType === 'touch' && document.activeElement === input.current) {
            event.preventDefault()
          }
        }}
      >
        <Icon kind="plus" />
        <span>Добавить</span>
      </button>
    </form>
  )
}
