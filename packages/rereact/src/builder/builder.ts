import { getConfig } from '../config/config.ts'
import type { ReReactConfigInternal } from '../config/types.ts'
import { Window } from 'happy-dom'
import { rolldown } from 'rolldown'
import { globSync } from 'node:fs'

const DEFAULT_HEAD_TITLE = 'ReReact App :)'
const DEFAULT_HTML_LANG = 'en'
const DEFAULT_HEAD_CHARSET = 'utf-8'

export async function buildApp(): Promise<void> {
  const config = await getConfig()

  const indexHtmlContent = getIndexHtml(config)

  await bundle(config)

  console.log(indexHtmlContent)
}

function getIndexHtml(config: ReReactConfigInternal): string {
  const window = new Window()

  const document = window.document

  // Append element for react to render in

  const mainElement = document.createElement('main')
  mainElement.id = 'app'

  document.body.appendChild(mainElement)

  // Head

  const { head } = config

  document.head.title = head?.title ?? DEFAULT_HEAD_TITLE
  document.documentElement.setAttribute('lang', head?.lang ?? DEFAULT_HTML_LANG)

  const charsetMetaTag = document.createElement('meta')
  charsetMetaTag.setAttribute('charset', head?.charset ?? DEFAULT_HEAD_CHARSET)
  document.head.appendChild(charsetMetaTag)

  return document.documentElement.outerHTML
}

async function bundle(config: ReReactConfigInternal): Promise<void> {
  const pagePaths = getPagePaths(config)

  const outputDir = `${config.appRootPath}/dist`

  const bundle = await rolldown({
    input: pagePaths,
    platform: 'browser',
    treeshake: true,
    jsx: 'react-jsx',
  })

  bundle.write({
    dir: outputDir,
    format: 'esm',
    minify: true,
    sourcemap: config.output?.sourcemap ?? false,
  })
}

function getPagePaths(config: ReReactConfigInternal): string[] {
  const pagesGlob = `${config.appRootPath}/app/pages/*`

  return globSync(pagesGlob)
}
