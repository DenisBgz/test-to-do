import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { Filter, Task } from '../../model/tasks'
import type { TaskFlight } from '../../animations/textFlight'
import { EmptyState } from '../EmptyState/EmptyState'
import { TaskRow, type RowExit } from '../TaskRow/TaskRow'
import styles from './TaskList.module.css'

type Props = {
  tasks: Task[]
  filter: Filter
  flight: TaskFlight | null
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function TaskList({ tasks, filter, flight, onToggle, onRemove }: Props) {
  const list = useRef<HTMLUListElement>(null)
  useLayoutEffect(() => {
    // Новые задачи попадают в начало. Прокручиваем к новой строке до отрисовки кадра.
    if (flight && list.current) list.current.scrollTop = 0
  }, [flight])
  // Пока идёт анимация исчезновения, держим копию строки на прежнем месте, даже если данные уже изменились.
  const [leaving, setLeaving] = useState<{ task: Task; index: number; exit: RowExit }[]>([])
  const leavingIds = new Set(leaving.map(row => row.task.id))
  const rows: { task: Task; exit?: RowExit }[] = tasks
    .filter(task => !leavingIds.has(task.id))
    .map(task => ({ task }))
  for (const { task, index, exit } of leaving) {
    rows.splice(index, 0, { task, exit })
  }

  function startExit(task: Task, exit: RowExit) {
    const index = rows.findIndex(row => row.task.id === task.id)
    setLeaving(previous => [...previous.filter(row => row.task.id !== task.id), { task, index, exit }])
  }

  function toggle(task: Task) {
    // В общем списке задача остаётся видимой. В остальных разделах проигрываем её исчезновение.
    if (filter !== 'all') startExit({ ...task, done: !task.done }, 'filter')
    onToggle(task.id)
  }

  function remove(task: Task) {
    startExit(task, 'remove')
    onRemove(task.id)
  }

  // После окончания анимации освобождаем временную копию строки.
  const finishExit = useCallback((id: string) => {
    setLeaving(previous => previous.filter(row => row.task.id !== id))
  }, [])

  if (rows.length === 0) return <EmptyState filter={filter} />

  return (
    <ul ref={list} className={styles.list} tabIndex={0} aria-label="Задачи">
      {rows.map(({ task, exit }) => (
        <TaskRow
          key={task.id}
          task={task}
          exit={exit}
          origin={task.id === flight?.id ? flight.origin : undefined}
          onToggle={toggle}
          onRemove={remove}
          onExit={finishExit}
        />
      ))}
    </ul>
  )
}
