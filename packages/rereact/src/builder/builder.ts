import { getConfig } from '../config/config.ts'
import type { ReReactConfigInternal } from '../config/types.ts'
import { Window } from 'happy-dom'
import { rolldown } from 'rolldown'
import { getPagePaths, getRouter } from '../router/router.ts'

const DEFAULT_HEAD_TITLE = 'ReReact App :)'
const DEFAULT_HTML_LANG = 'en'
const DEFAULT_HEAD_CHARSET = 'utf-8'

const REACT_ROOT_ELEMENT_ID = 'app'

export async function buildApp(): Promise<void> {
  const config = await getConfig()

  await bundle(config)
  return
  const router = getRouter(config)

  const indexHtmlContent = getIndexHtml(config)
}

async function bundle(config: ReReactConfigInternal): Promise<void> {
  // TODO maybe it's just enough to use the router as input and not all the pages
  const pagePaths = getPagePaths(config)

  const outputDir = `${config.appRootPath}/dist`

  const bundle = await rolldown({
    input: pagePaths, // TODO also include here the root component from getReactRootComponent
    platform: 'browser',
    treeshake: true,
    jsx: 'react-jsx',
  })

  const output = await bundle.write({
    dir: outputDir,
    format: 'esm',
    minify: true,
    sourcemap: config.output?.sourcemap ?? false,
  })
}

function getIndexHtml(config: ReReactConfigInternal): string {
  const window = new Window()

  const document = window.document

  // Append element for react to render in

  const mainElement = document.createElement('main')
  mainElement.id = REACT_ROOT_ELEMENT_ID

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
