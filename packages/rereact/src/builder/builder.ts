import { getConfig } from '../config/config.ts'
import type { ReReactConfigInternal } from '../config/types.ts'
import { Window } from 'happy-dom'
import { rolldown } from 'rolldown'
import { globSync } from 'node:fs'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { createElement, StrictMode } from 'react'
import { getRouter } from '../router/router.ts'

const DEFAULT_HEAD_TITLE = 'ReReact App :)'
const DEFAULT_HTML_LANG = 'en'
const DEFAULT_HEAD_CHARSET = 'utf-8'

const REACT_ROOT_ELEMENT_ID = 'app'

export async function buildApp(): Promise<void> {
  const config = await getConfig()

  const rootComponent = getReactRootComponent()

  await bundle(config)

  const indexHtmlContent = getIndexHtml(config)
}

async function bundle(config: ReReactConfigInternal): Promise<void> {
  const pagePaths = getPagePaths(config)

  const outputDir = `${config.appRootPath}/dist`

  const bundle = await rolldown({
    input: pagePaths, // TODO also include here the root component from getReactRootComponent
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

function getReactRootComponent(): Root {
  const router = getRouter()

  // TODO add this to main.js and import in index.html
  return createRoot(document.getElementById(REACT_ROOT_ELEMENT_ID)!).render(createElement(StrictMode, null, router))
}
