export type Task = {
  id: string
  title: string
  done: boolean
  // Признак для маячка раздела. В ранее сохранённых задачах это поле может отсутствовать.
  unread?: boolean
}

export const filters = ['all', 'active', 'completed'] as const
export type Filter = (typeof filters)[number]

// Один и тот же фильтр используется при выводе строк и при сбросе маячков.
export function matchesFilter(task: Task, filter: Filter): boolean {
  if (filter === 'active') return !task.done
  if (filter === 'completed') return task.done
  return true
}
