import fs from 'fs'
import path from 'path'
import tsParser from '@typescript-eslint/parser'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json')

export default [
  {
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // don't provide `project` here - it makes the parser try to type-check
      // every file (including config and generated files). Provide it only for
      // TypeScript file overrides below.
    },
  },
  plugins: {
    '@typescript-eslint': tsEslintPlugin,
    'react-hooks': reactHooksPlugin,
  },
  ignores: ['dist', 'node_modules', 'dist/**', '**/dist/**', 'vite.config.ts', 'vite.config.js', 'postcss.config.js', 'tailwind.config.js', '*.config.js', '*.config.ts'],
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
  files: ['src/**/*.ts', 'src/**/*.tsx'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: fs.existsSync(tsconfigPath) ? [tsconfigPath] : undefined,
      tsconfigRootDir: process.cwd(),
    },
  },
  // instead of 'extends' use plugin-provided configs where possible
  rules: {
    ...tsEslintPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
  },
}
]
