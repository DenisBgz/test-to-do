import { readFile, writeFile } from 'node:fs/promises'

// Находим результат сборки относительно скрипта, независимо от каталога запуска команды.
const dist = new URL('../dist/', import.meta.url)
const html = await readFile(new URL('index.html', dist), 'utf8')
// Берём имена ресурсов из HTML, поскольку Vite включает хеши в имена файлов.
const script = html.match(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/)
const stylesheet = html.match(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>/)

if (!script || !stylesheet) {
  throw new Error('Не удалось найти JavaScript или CSS в сборке Vite.')
}

const [js, css] = await Promise.all(
  [script[1], stylesheet[1]].map(path => readFile(new URL(path, dist), 'utf8')),
)
// Встраиваем стили и скрипт в один HTML. Экранируем закрывающий тег внутри кода, чтобы браузер не оборвал скрипт раньше времени.
const standalone = html
  .replace(script[0], () => '<script type="module">' + js.replace(/<\/script/gi, '<\\/script') + '</script>')
  .replace(stylesheet[0], () => '<style>' + css + '</style>')

await writeFile(new URL('../Открыть.html', import.meta.url), standalone)
