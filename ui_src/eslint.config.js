import fs from 'fs'
import path from 'path'
import tsParser from '@typescript-eslint/parser'

const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json')

export default [
  {
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: fs.existsSync(tsconfigPath) ? [tsconfigPath] : undefined,
      tsconfigRootDir: process.cwd(),
    },
  },
  plugins: {
    '@typescript-eslint': {},
    'react-hooks': {},
  },
  ignores: ['dist', 'node_modules'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // recommended ruleset; adjust as needed
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
},
{
  files: ['*.ts', '*.tsx'],
  languageOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
}
]
