module.exports = {
    "env": {
        "browser": true,
        "es2020": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 11,
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
  // ********************  使用方法  npm run lint -- --fix  *******************
    "rules": {
      // allow async-await
      'generator-star-spacing': 'off',
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      // 分号   永远要求分号  没有 报错
      'semi': ['error', 'always'],
      // 缩进  原生eslin不知道缩进怎么处理  就先把它关掉 然后下面自己写vue/script-indent
      'indent': 'off',
      // 基础缩进 1   倍数1   总共空1
      'vue/script-indent': ['error', 1, {'baseIndent': 1}],
      // 函数括号前的空格   异步async函数和匿名函数 前面需要空格   命名过的函数 不需要
      'space-before-function-paren': ['error', {'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always'}]
    }
};
