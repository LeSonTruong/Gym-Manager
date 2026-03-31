module.exports = [
    {
        ignores: ['node_modules', 'xo.config.js'],
        prettier: 'compat',
        space: true,
        rules: {
            'unicorn/prevent-abbreviations': 'off',
            'new-cap': 'off',
            'max-params': 'error',
            '@typescript-eslint/capitalized-comments': 'off',
            'capitalized-comments': 'off',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
        },
    },
];