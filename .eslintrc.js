module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.js', 'json'],
        map: [
          ['@', __dirname]
        ]
      }
    }
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
