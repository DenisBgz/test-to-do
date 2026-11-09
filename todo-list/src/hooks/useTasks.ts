import { useEffect, useState } from 'react'
import { loadList, persistTasks, storageKey } from '../model/storage'
import { matchesFilter, type Filter, type Task } from '../model/tasks'

export function useTasks(filter: Filter) {
  // Читаем сохранённый список при начальной загрузке компонента.
  const [{ tasks, warning }, setList] = useState(loadList)

  useEffect(() => {
    // При изменении данных в другой вкладке перечитываем список. Ключ null означает очистку хранилища.
    function sync(event: StorageEvent) {
      if (event.storageArea === localStorage && (event.key === storageKey || event.key === null)) {
        setList(loadList())
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  // Обновляем список на экране даже при ошибке записи и передаём предупреждение интерфейсу.
  function save(next: Task[]) {
    setList({ tasks: next, warning: persistTasks(next) })
  }

  useEffect(() => {
    if (filter === 'all') return
    // Открытие раздела снимает маячки только у задач, которые в нём видны.
    const isNewHere = (task: Task) => task.unread === true && matchesFilter(task, filter)
    if (tasks.some(isNewHere)) {
      save(tasks.map(task => isNewHere(task) ? { ...task, unread: false } : task))
    }
  }, [tasks, filter])

  function addTask(title: string) {
    const id = crypto.randomUUID?.() ?? Date.now() + '-' + Math.random()
    // Новая задача появляется первой. В открытом разделе «Активные» она уже считается просмотренной.
    save([{ id, title, done: false, unread: filter !== 'active' }, ...tasks])
    return id
  }

  function toggleTask(id: string) {
    save(tasks.map(task => {
      if (task.id !== id) return task
      const done = !task.done
      // При смене статуса маячок относится к разделу, в который перешла задача.
      const destination = done ? 'completed' : 'active'
      return { ...task, done, unread: filter !== destination }
    }))
  }

  function removeTask(id: string) {
    save(tasks.filter(task => task.id !== id))
  }

  return { tasks, warning, addTask, toggleTask, removeTask }
}
