import { filters, type Filter } from '../../model/tasks'
import styles from './TaskFilters.module.css'

const labels: Record<Filter, string> = {
  all: 'Все',
  active: 'Активные',
  completed: 'Выполненные',
}

type Props = {
  value: Filter
  total: number
  done: number
  unread: Record<Filter, number>
  onChange: (filter: Filter) => void
}

export function TaskFilters({ value, total, done, unread, onChange }: Props) {
  // Число справа показывает размер раздела. Отдельный маячок показывает, сколько задач в нём ещё не просмотрено.
  const counts = { all: total, active: total - done, completed: done }

  return (
    <div className={styles.filters} role="group" aria-label="Фильтр задач">
      <h2>Фильтры</h2>
      {filters.map(filter => (
        <button
          key={filter}
          type="button"
          aria-pressed={value === filter}
          onClick={() => onChange(filter)}
        >
          {labels[filter]}
          {filter !== value && unread[filter] > 0 && (
            <b className={styles.badge} aria-label={'Новых задач: ' + unread[filter]}>
              +{unread[filter]}
            </b>
          )}
          <span>{counts[filter]}</span>
        </button>
      ))}
    </div>
  )
}
