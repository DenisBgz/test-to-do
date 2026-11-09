import { Icon } from '../Icon/Icon'
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch'
import styles from './Header.module.css'

// Форматируем дату по правилам русской локали. В шапке выводим её без сокращения «г.».
const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function Header() {
  return (
    <header className={styles.header}>
      <div>
        <h1>Мои задачи</h1>
        <time className={styles.date}>
          <Icon kind="calendar" />
          {dateFormat.format(new Date()).replace(/ г\.$/, '')}
        </time>
      </div>
      <ThemeSwitch />
    </header>
  )
}
