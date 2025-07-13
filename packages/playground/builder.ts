import { rolldown } from 'rolldown'
import { copyFileSync } from 'node:fs'

const bundle = await rolldown({
  input: ['./main.tsx', './Router.tsx', './app/pages/index.tsx', './app/pages/login.tsx', './app/pages/dashboard.tsx'],
  platform: 'browser',
  treeshake: true,
  jsx: 'react-jsx',
})

await bundle.write({
  dir: 'dist',
  format: 'esm',
  minify: false,
})

copyFileSync('./index.html', './dist/index.html')
