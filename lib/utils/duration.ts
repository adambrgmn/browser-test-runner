export function format(ms: number) {
  if (ms > 1000) {
    return `${(ms / 1000).toFixed(2)} s`;
  }

  return `${ms.toFixed(2)} ms`;
}
