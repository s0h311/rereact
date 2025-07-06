export type ReReactConfigInternal = ReReactConfig & {
  appRootPath: string
}

export type ReReactConfig = {
  head?: {
    title?: string
    lang?: 'en' | 'de' | 'fr' | 'ch' | (string & {})
    charset?: 'utf-8' | (string & {})
  }
  output?: {
    sourcemap?: boolean
  }
}
