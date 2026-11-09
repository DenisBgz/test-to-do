import styles from './Icon.module.css'

// Все значки используют общую систему координат SVG. Для галочки длина пути приведена к единице, чтобы CSS мог постепенно её прорисовать.
const paths = {
  system: 'M3 4h18v12H3zM12 16v4m-5 0h10',
  light: 'M16 12a4 4 0 1 1-8 0 4 4 0 1 1 8 0zM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  dark: 'M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14z',
  list: 'm3 6 1.5 1.5L7 4m3 2h11M3 12h4m3 0h11M3 18h4m3 0h11',
  plus: 'M12 5v14M5 12h14',
  delete: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7m4-7v7',
  check: 'm4 12 5 5L20 6',
  calendar: 'M4 6h16v15H4zM8 3v6m8-6v6M4 11h16',
}

export function Icon({ kind }: { kind: keyof typeof paths }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={styles.icon}
      aria-hidden="true"
    >
      <path d={paths[kind]} pathLength={kind === 'check' ? 1 : undefined} />
    </svg>
  )
}
