import { useEffect, useRef, useState } from 'react'
import { measureInputText, type TaskFlight } from './animations/textFlight'
import { Header } from './components/Header/Header'
import { TaskProgress } from './components/TaskProgress/TaskProgress'
import { TaskFilters } from './components/TaskFilters/TaskFilters'
import { TaskForm } from './components/TaskForm/TaskForm'
import { TaskList } from './components/TaskList/TaskList'
import { useTasks } from './hooks/useTasks'
import { useViewportHeight } from './hooks/useViewportHeight'
import { matchesFilter, type Filter } from './model/tasks'
import styles from './App.module.css'

export default function App() {
  useViewportHeight()
  const page = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const { tasks, warning, addTask, toggleTask, removeTask } = useTasks(filter)
  const [flight, setFlight] = useState<TaskFlight | null>(null)
  const done = tasks.filter(task => task.done).length
  // Маячки считают новые задачи отдельно для двух разделов. В общем списке маячка нет.
  const unread = {
    active: tasks.filter(task => task.unread === true && !task.done).length,
    completed: tasks.filter(task => task.unread === true && task.done).length,
    all: 0,
  }

  // Передаём координаты поля новой строке один раз, при её первом появлении.
  useEffect(() => {
    if (flight) setFlight(null)
  }, [flight])

  function add(title: string, input: HTMLInputElement) {
    // Снимаем координаты и текст до того, как форма очистит поле.
    const origin = page.current && measureInputText(input, page.current)
    const id = addTask(title)
    if (origin) setFlight({ id, origin })
    // Новая задача активна. Показываем общий список, чтобы была видна строка, куда летит текст.
    if (filter === 'completed') setFilter('all')
  }

  return (
    <div ref={page} className={styles.page}>
      <main>
        <Header />
        <div className={styles.workspace}>
          <TaskFilters value={filter} total={tasks.length} done={done} unread={unread} onChange={setFilter} />
          <section className={styles.content} aria-label="Список задач">
            <TaskProgress done={done} total={tasks.length} />
            <TaskForm onAdd={add} />
            {warning && <p className={styles.warning} role="alert">{warning}</p>}
            <TaskList
              key={filter}
              tasks={tasks.filter(task => matchesFilter(task, filter))}
              filter={filter}
              flight={flight}
              onToggle={toggleTask}
              onRemove={removeTask}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
