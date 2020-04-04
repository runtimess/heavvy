export default {
    input: {
        example: 'examples/example',
        'versatile-example': 'examples/versatile-example',
    },

    output: {
        dir: 'dist',
        entryFileNames: '[name]-bundle.js',
        format: 'cjs',
    },

    external: ['worker_threads'],
}
