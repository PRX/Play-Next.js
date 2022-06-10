module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'next/core-web-vitals',
    'airbnb',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'jest'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'] }
    ],
    'react/function-component-definition': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'react/prop-types': 0,
    'import/no-unresolved': ['error', { ignore: ['\\.svg$'] }],
    'import/extensions': [
      'error',
      'never',
      { ignorePackage: true, svg: 'always' }
    ]
  }
};
