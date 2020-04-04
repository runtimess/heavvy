module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: ['prettier', 'eslint:recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },

    plugins: ['prettier'],

    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },

    rules: {
        'prettier/prettier': 'error',
    },
}
