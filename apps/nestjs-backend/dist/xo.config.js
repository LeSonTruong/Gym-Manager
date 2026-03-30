"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xoConfig = [
    {
        ignores: ['node_modules'],
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
            '@typescript-eslint/consistent-type-imports': 'off',
            'n/prefer-global/process': 'off',
            'no-restricted-syntax': [
                'error',
                {
                    selector: "CallExpression[callee.property.name='findOneOrFail']",
                    message: "Avoid using 'findOneOrFail' as it will always throw an internal server error on fail. Use 'findOne' with manual error handling instead.",
                },
            ],
        },
    },
    {
        files: ['src/migrations/**/*'],
        rules: {
            'unicorn/filename-case': 'off',
        },
    },
    {
        files: ['**/*.entity.ts'],
        rules: {
            'import/no-cycle': 'off',
        },
    },
];
exports.default = xoConfig;
//# sourceMappingURL=xo.config.js.map