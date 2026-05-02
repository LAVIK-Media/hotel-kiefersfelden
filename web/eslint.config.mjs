import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
/** @type {import('eslint').Linter.Config[]} */
const nextConfigs = require('eslint-config-next')

export default [
  { ignores: ['.next/**', 'node_modules/**', '.open-next/**', '*.config.*', '**/dist/**'] },
  ...nextConfigs,
]
