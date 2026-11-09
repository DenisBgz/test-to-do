import { useState } from 'react'
import type { TaskFlight } from '../../animations/textFlight'
import type { Task } from '../../model/tasks'
import { Icon } from '../Icon/Icon'
import { TaskTitle } from '../TaskTitle/TaskTitle'
import styles from './TaskRow.module.css'

export type RowExit = 'remove' | 'filter'

type Props = {
  task: Task
  exit?: RowExit
  origin?: TaskFlight['origin']
  onToggle: (task: Task) => void
  onRemove: (task: Task) => void
  onExit: (id: string) => void
}

export function TaskRow({ task, exit, origin, onToggle, onRemove, onExit }: Props) {
  // Если текст прилетает из поля, строке не нужна вторая анимация появления.
  const [entryClass] = useState(origin ? undefined : styles.entering)
  const [press, setPress] = useState(0)
  const exitClasses = { remove: styles.exiting, filter: styles.filterExit }

  function toggle() {
    // Новое значение ключа заново запускает анимацию галочки при каждом нажатии.
    setPress(count => count + 1)
    onToggle(task)
  }

  return (
    <li
      className={exit ? exitClasses[exit] : entryClass}
      inert={Boolean(exit)}
      aria-hidden={exit ? true : undefined}
      onAnimationEnd={event => {
        // Закрываем строку только по окончании её собственной анимации. События от галочки тоже всплывают сюда.
        if (exit && event.target === event.currentTarget) onExit(task.id)
      }}
    >
      <label className={styles.task}>
        <input
          type="checkbox"
          checked={task.done}
          onChange={toggle}
        />
        <span key={press} className={styles.box} data-pressed={press > 0 || undefined}>
          <Icon kind="check" />
        </span>
        <TaskTitle done={task.done} title={task.title} origin={origin} />
      </label>
      <button
        className={styles.remove}
        aria-label={'Удалить задачу «' + task.title + '»'}
        onClick={() => onRemove(task)}
      >
        <Icon kind="delete" />
      </button>
    </li>
  )
}
