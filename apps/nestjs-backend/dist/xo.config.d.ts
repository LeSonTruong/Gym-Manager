declare const xoConfig: ({
    ignores: string[];
    prettier: string;
    space: boolean;
    rules: {
        'unicorn/prevent-abbreviations': string;
        'new-cap': string;
        'max-params': string;
        '@typescript-eslint/capitalized-comments': string;
        'capitalized-comments': string;
        '@typescript-eslint/explicit-function-return-type': string;
        '@typescript-eslint/no-explicit-any': string;
        '@typescript-eslint/no-non-null-assertion': string;
        '@typescript-eslint/no-var-requires': string;
        '@typescript-eslint/no-unused-vars': string;
        '@typescript-eslint/consistent-type-imports': string;
        'n/prefer-global/process': string;
        'no-restricted-syntax': (string | {
            selector: string;
            message: string;
        })[];
        'unicorn/filename-case'?: undefined;
        'import/no-cycle'?: undefined;
    };
    files?: undefined;
} | {
    files: string[];
    rules: {
        'unicorn/filename-case': string;
        'unicorn/prevent-abbreviations'?: undefined;
        'new-cap'?: undefined;
        'max-params'?: undefined;
        '@typescript-eslint/capitalized-comments'?: undefined;
        'capitalized-comments'?: undefined;
        '@typescript-eslint/explicit-function-return-type'?: undefined;
        '@typescript-eslint/no-explicit-any'?: undefined;
        '@typescript-eslint/no-non-null-assertion'?: undefined;
        '@typescript-eslint/no-var-requires'?: undefined;
        '@typescript-eslint/no-unused-vars'?: undefined;
        '@typescript-eslint/consistent-type-imports'?: undefined;
        'n/prefer-global/process'?: undefined;
        'no-restricted-syntax'?: undefined;
        'import/no-cycle'?: undefined;
    };
    ignores?: undefined;
    prettier?: undefined;
    space?: undefined;
} | {
    files: string[];
    rules: {
        'import/no-cycle': string;
        'unicorn/prevent-abbreviations'?: undefined;
        'new-cap'?: undefined;
        'max-params'?: undefined;
        '@typescript-eslint/capitalized-comments'?: undefined;
        'capitalized-comments'?: undefined;
        '@typescript-eslint/explicit-function-return-type'?: undefined;
        '@typescript-eslint/no-explicit-any'?: undefined;
        '@typescript-eslint/no-non-null-assertion'?: undefined;
        '@typescript-eslint/no-var-requires'?: undefined;
        '@typescript-eslint/no-unused-vars'?: undefined;
        '@typescript-eslint/consistent-type-imports'?: undefined;
        'n/prefer-global/process'?: undefined;
        'no-restricted-syntax'?: undefined;
        'unicorn/filename-case'?: undefined;
    };
    ignores?: undefined;
    prettier?: undefined;
    space?: undefined;
})[];
export default xoConfig;
