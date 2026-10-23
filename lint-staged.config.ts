import type { Configuration } from 'lint-staged'

export default {
  '*.{ts,tsx}': [
    'oxlint --fix --no-error-on-unmatched-pattern',
    'oxfmt --write --no-error-on-unmatched-pattern',
  ],
  '*.{js,jsx,mjs,cjs,json,jsonc,css,scss,less,html,md,mdx,yaml,yml}':
    'oxfmt --write --no-error-on-unmatched-pattern',
} satisfies Configuration
