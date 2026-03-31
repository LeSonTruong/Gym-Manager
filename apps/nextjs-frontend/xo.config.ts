import { type FlatXoConfig } from "xo";

const xoConfig: FlatXoConfig = [
  {
    ignores: ["node_modules", "postcss.config.mjs"],
  },
  {
    react: true,
    prettier: "compat",
    space: true,
    rules: {
      // Since Next.js is used this can be disabled
      "react/react-in-jsx-scope": "off",

      // Disable console logs in frontend
      "no-console": ["error"],

      // Force exhaustive dependencies in useEffect hooks by default
      "react-hooks/exhaustive-deps": "error",

      // Annoying
      "@typescript-eslint/capitalized-comments": "off",
      "capitalized-comments": "off",
      "unicorn/prevent-abbreviations": "off",

      // Typescript rules
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/no-unused-vars": "error",

      // Code rules
      "max-params": "error",

      // Import rules
      "import-x/extensions": "error",
      "n/file-extension-in-import": "error",
    },
  },
  {
    files: ["src/components/gym/render-gym-route.tsx"],
    rules: {
      complexity: "off",
      "max-lines": "off",
      "react/jsx-sort-props": "off",
      "react/boolean-prop-naming": "off",
      "@typescript-eslint/no-restricted-types": "off",
    },
  },
  {
    files: ["src/lib/gym-auth.ts"],
    rules: {
      "import-x/no-unassigned-import": "off",
      "@typescript-eslint/no-restricted-types": "off",
    },
  },
  {
    files: ["src/lib/gym-data.ts"],
    rules: {
      "@typescript-eslint/no-restricted-types": "off",
    },
  },
  {
    files: ["src/components/gym/gym-ui.tsx"],
    rules: {
      "react/no-array-index-key": "off",
    },
  },
  {
    files: ["src/app/**/layout.tsx"],
    rules: {
      "new-cap": "off",
    },
  },
  {
    files: ["next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
      "import-x/no-unassigned-import": "off",
    },
  },
];

export default xoConfig;
