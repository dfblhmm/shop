module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'space-before-function-paren': 0,
        'func-call-spacing': 'off',
        'vue/script-indent': ['error', 2, {'baseIndent': 1}],
        'no-useless-return': 'off'
    },
    overrides:[
      {
        'files':['*.vue'],
        'rules':{
          'indent':'off'
        }
      }
    ]
}
