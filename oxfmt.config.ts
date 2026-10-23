import { readdirSync } from 'node:fs'
import { defineConfig } from 'oxfmt'

const formattedRootEntries = new Set([
  'src',
  'index.html',
  'package.json',
  'tailwind.config.js',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
  'oxfmt.config.ts',
  'oxlint.config.ts',
  'lint-staged.config.ts',
  'README.md',
  'postcss.config.js',
  '.vscode',
])

const priorityImports = [
  'path',
  'vite',
  '@vitejs/**',
  'react',
  'react-dom/client',
  'react/**',
  'globals',
  'zod',
  'axios',
  'date-fns',
  'react-hook-form',
  'use-intl',
  '@radix-ui/**',
  '@hookform/resolvers/zod',
  '@tanstack/react-query',
  '@tanstack/react-router',
  '@tanstack/react-table',
]

const internalImports = [
  '@/assets/**',
  '@/api/**',
  '@/stores/**',
  '@/lib/**',
  '@/utils/**',
  '@/constants/**',
  '@/context/**',
  '@/hooks/**',
  '@/components/layouts/**',
  '@/components/ui/**',
  '@/components/errors/**',
  '@/components/**',
  '@/features/**',
]

export default defineConfig({
  arrowParens: 'always',
  semi: false,
  tabWidth: 2,
  printWidth: 80,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  endOfLine: 'lf',
  // Expand the previous root allowlist so directory scans and staged files agree.
  ignorePatterns: [
    ...readdirSync(import.meta.dirname)
      .filter((entry) => !formattedRootEntries.has(entry))
      .map((entry) => `/${entry}`),
    '/src/routeTree.gen.ts',
  ],
  sortPackageJson: false,
  sortImports: {
    customGroups: [
      ...priorityImports.map((pattern, index) => ({
        groupName: `priority-${index}`,
        elementNamePattern: [pattern],
      })),
      ...internalImports.map((pattern, index) => ({
        groupName: `internal-${index}`,
        elementNamePattern: [pattern],
      })),
      {
        groupName: 'relative-imports',
        elementNamePattern: ['.', '..', './**', '../**', '/**'],
      },
    ],
    groups: [
      ...priorityImports.map((_, index) => `priority-${index}`),
      ['builtin', 'external', 'internal', 'subpath', 'unknown'],
      ...internalImports.map((_, index) => `internal-${index}`),
      'relative-imports',
    ],
    newlinesBetween: false,
    ignoreCase: false,
    sortSideEffects: false,
  },
  sortTailwindcss: {
    functions: ['cn', 'clsx'],
    stylesheet: './src/styles/index.css',
  },
})
