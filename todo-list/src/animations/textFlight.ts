type TextOrigin = {
  container: HTMLElement
  left: number
  top: number
  scroll: number
  width: number
  value: string
}

// Идентификатор связывает координаты поля с одной новой строкой списка.
export type TaskFlight = { id: string; origin: TextOrigin }

// Находим начало строки внутри рамки поля и запоминаем, насколько текст прокручен по горизонтали.
export function measureInputText(input: HTMLInputElement, container: HTMLElement): TextOrigin {
  const rect = input.getBoundingClientRect()
  const page = container.getBoundingClientRect()
  const style = getComputedStyle(input)
  const padding = parseFloat(style.paddingLeft)
  return {
    container,
    left: rect.left - page.left + input.clientLeft + padding,
    top: rect.top - page.top + (rect.height - parseFloat(style.lineHeight)) / 2,
    scroll: input.scrollLeft,
    width: input.clientWidth - padding - parseFloat(style.paddingRight),
    value: input.value,
  }
}
