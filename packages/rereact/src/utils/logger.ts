export function logAndThrow(message: string): never {
  const errorMessage = `[ReReact] ${message}`

  console.error(errorMessage)

  throw new Error(errorMessage)
}

export function warn(message: string): void {
  console.warn(`[ReReact] ${message}`)
}
