export type HeaderDecoratorParam = string | {
    headerName: string;
    options?: HeaderValidationOptions;
};
type HeaderValidationOptions = {
    expectedValue?: string | string[] | RegExp | Record<string, string | number>;
    caseSensitive?: boolean;
    missingMessage?: string;
    invalidValueMessage?: string;
    allowEmpty?: boolean;
};
export {};
