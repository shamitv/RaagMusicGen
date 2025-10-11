import fs from 'fs'
import path from 'path'

const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json')

export default {
  root: true,
  languageOptions: {
    parser: '@typescript-eslint/parser',
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
  overrides: [
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
    },
  ],
}
