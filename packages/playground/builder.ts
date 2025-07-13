import { rolldown } from 'rolldown'
import { copyFileSync, rmSync } from 'node:fs'

const OUTPUT_DIR = './dist'

rmSync(OUTPUT_DIR, { force: true, recursive: true })

const bundle = await rolldown({
  input: ['./main.tsx', './Router.tsx', './app/pages/index.tsx', './app/pages/login.tsx', './app/pages/dashboard.tsx'],
  platform: 'browser',
  treeshake: true,
  jsx: 'react-jsx',
})

await bundle.write({
  dir: OUTPUT_DIR,
  format: 'esm',
  minify: false,
})

copyFileSync('./index.html', './dist/index.html')
