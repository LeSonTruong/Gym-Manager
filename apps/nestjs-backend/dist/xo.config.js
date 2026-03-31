"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xoConfig = [
    {
        ignores: ["node_modules"],
        prettier: "compat",
        space: true,
        rules: {
            "unicorn/prevent-abbreviations": "off",
            "new-cap": "off",
            "max-params": "error",
            "@typescript-eslint/capitalized-comments": "off",
            "capitalized-comments": "off",
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/no-var-requires": "error",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/consistent-type-imports": "off",
            "n/prefer-global/process": "off",
            "no-restricted-syntax": [
                "error",
                {
                    selector: "CallExpression[callee.property.name='findOneOrFail']",
                    message: "Avoid using 'findOneOrFail' as it will always throw an internal server error on fail. Use 'findOne' with manual error handling instead.",
                },
            ],
        },
    },
    {
        files: ["src/migrations/**/*"],
        rules: {
            "unicorn/filename-case": "off",
        },
    },
    {
        files: ["**/*.entity.ts"],
        rules: {
            "import/no-cycle": "off",
        },
    },
    {
        files: ["src/gym-management/gym-management.service.ts"],
        rules: {
            "@typescript-eslint/naming-convention": "off",
            "max-lines": "off",
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/prefer-nullish-coalescing": "off",
            "unicorn/no-array-method-this-argument": "off",
            "unicorn/no-await-expression-member": "off",
        },
    },
    {
        files: [
            "src/gym-management/auth/*.decorator.ts",
            "src/gym-management/audit/audit-action.decorator.ts",
        ],
        rules: {
            "@typescript-eslint/naming-convention": "off",
        },
    },
    {
        files: ["src/gym-management/audit/audit-log.interceptor.ts"],
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
        },
    },
    {
        files: ["test/**/*.ts"],
        rules: {
            "@typescript-eslint/no-deprecated": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/naming-convention": "off",
            "max-params": "off",
            "unicorn/no-array-method-this-argument": "off",
        },
    },
    {
        files: ["jest.config.js"],
        rules: {
            "unicorn/prefer-module": "off",
        },
    },
];
exports.default = xoConfig;
//# sourceMappingURL=xo.config.js.map