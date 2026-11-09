import type { Filter } from '../../model/tasks'
import { Icon } from '../Icon/Icon'
import styles from './EmptyState.module.css'

// Заголовок уточняет, пуст ли весь список или только выбранный раздел.
const headings: Record<Filter, string> = {
  all: 'Задач пока нет',
  active: 'Активных задач пока нет',
  completed: 'Выполненных задач пока нет',
}

export function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className={styles.empty}>
      <div className={styles.symbol}><Icon kind="list" /></div>
      <h2>{headings[filter]}</h2>
      <p>{filter === 'completed'
        ? 'Отметьте задачу галочкой, и она появится здесь.'
        : 'Введите задачу выше и нажмите Enter.'}</p>
    </div>
  )
}
