import type { Task } from './tasks'

// Сохраняем прежний ключ, чтобы браузер находил задачи из предыдущих версий приложения.
export const storageKey = 'po-poryadku.tasks.v1'

// Проверяем обязательные поля каждой записи перед использованием данных из браузера.
function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false

  return (
    'id' in value && typeof value.id === 'string' &&
    'title' in value && typeof value.title === 'string' &&
    'done' in value && typeof value.done === 'boolean'
  )
}

export function loadList(): { tasks: Task[]; warning: string } {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw === null) return { tasks: [], warning: '' }

    const data: unknown = JSON.parse(raw)
    if (Array.isArray(data) && data.every(isTask)) {
      return { tasks: data, warning: '' }
    }
  } catch {
    // Если хранилище недоступно или запись повреждена, ниже вернём пустой список и предупреждение.
  }
  return { tasks: [], warning: 'Не удалось прочитать сохранённые задачи.' }
}

// При успешной записи возвращаем пустую строку, при ошибке — сообщение для интерфейса.
export function persistTasks(tasks: Task[]): string {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks))
    return ''
  } catch {
    return 'Браузер не смог сохранить изменения. Они доступны до обновления страницы.'
  }
}
