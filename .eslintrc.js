module.exports = {
    'env': {
      'browser': true,
      'es2021': true,
      'node': true
    },
    'extends': [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      // '@electron-toolkit/eslint-config-ts/recommended',
    ],
    'overrides': [
      {
        'env': {
          'node': true
        },
        'files': [
          '.eslintrc.{js,cjs}'
        ],
        'parserOptions': {
          'sourceType': 'script'
        }
      }
    ],
    'ignorePatterns': [
      'node_modules/**/*',
      'dist/**/*',
      'src/main/qrcode.ts/**/*'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
      'ecmaVersion': 'latest',
      'sourceType': 'module'
    },
    'plugins': [
      '@typescript-eslint'
    ],
    'rules': {
      'indent': [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'always'
      ]
    }
  };