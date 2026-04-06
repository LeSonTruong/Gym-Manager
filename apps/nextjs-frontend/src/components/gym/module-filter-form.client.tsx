'use client';

import {
    type JSX,
    type ReactNode,
    type SyntheticEvent,
    useCallback,
    useEffect,
    useRef,
    useTransition,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation.ts';

const defaultSearchDebounceMs = 150;

type ModuleFilterFormClientProperties = {
    readonly query: string;
    readonly searchLabel: string;
    readonly placeholder: string;
    readonly filterButtonLabel: string;
    readonly debounceMs?: number;
    readonly children?: ReactNode;
};

function collectFormFieldNames(form: HTMLFormElement): Set<string> {
    const fieldNames = new Set<string>();

    for (const element of form.elements) {
        if (
            (
                element instanceof HTMLInputElement
                || element instanceof HTMLSelectElement
                || element instanceof HTMLTextAreaElement
            )
            && element.name.length > 0
        ) {
            fieldNames.add(element.name);
        }
    }

    return fieldNames;
}

export function ModuleFilterFormClient({
    query,
    searchLabel,
    placeholder,
    filterButtonLabel,
    debounceMs,
    children,
}: ModuleFilterFormClientProperties): JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    const searchParameters = useSearchParams();
    const formReference = useRef<HTMLFormElement | undefined>(undefined);
    const debounceTimerReference = useRef<
        ReturnType<typeof globalThis.setTimeout> | undefined
    >(undefined);
    const [, startTransition] = useTransition();
    const effectiveDebounceMs = Math.max(0, debounceMs ?? defaultSearchDebounceMs);

    const clearDebounceTimer = useCallback((): void => {
        if (debounceTimerReference.current !== undefined) {
            globalThis.clearTimeout(debounceTimerReference.current);
            debounceTimerReference.current = undefined;
        }
    }, []);

    const applyFilters = useCallback((): void => {
        const form = formReference.current;

        if (!form) {
            return;
        }

        const nextSearchParameters = new URLSearchParams(searchParameters.toString());

        for (const fieldName of collectFormFieldNames(form)) {
            nextSearchParameters.delete(fieldName);
        }

        const formData = new FormData(form);

        for (const [key, rawValue] of formData.entries()) {
            if (typeof rawValue !== 'string') {
                continue;
            }

            const value = rawValue.trim();

            if (value.length > 0) {
                nextSearchParameters.set(key, value);
            }
        }

        // Keep current page when filters change.

        const queryString = nextSearchParameters.toString();
        const href = queryString.length > 0 ? `${pathname}?${queryString}` : pathname;

        startTransition(() => {
            router.replace(href, { scroll: false });
        });
    }, [pathname, router, searchParameters]);

    useEffect(
        (): (() => void) => (): void => {
            clearDebounceTimer();
        },
        [clearDebounceTimer],
    );

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
        event.preventDefault();
        clearDebounceTimer();
        applyFilters();
    };

    const queueFilterApplication = (): void => {
        clearDebounceTimer();
        debounceTimerReference.current = globalThis.setTimeout((): void => {
            debounceTimerReference.current = undefined;
            applyFilters();
        }, effectiveDebounceMs);
    };

    const handleInputCapture = (event: SyntheticEvent<HTMLFormElement>): void => {
        const { target } = event;

        if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
            return;
        }

        if (target.name.length === 0 || target.type === 'hidden') {
            return;
        }

        queueFilterApplication();
    };

    const handleChangeCapture = (event: SyntheticEvent<HTMLFormElement>): void => {
        const { target } = event;

        if (target instanceof HTMLSelectElement) {
            clearDebounceTimer();
            applyFilters();
            return;
        }

        if (target instanceof HTMLInputElement) {
            if (target.type === 'search' || target.type === 'text') {
                return;
            }

            clearDebounceTimer();
            applyFilters();
        }
    };

    return (
        <form
            ref={(element): void => {
                formReference.current = element ?? undefined;
            }}
            method="get"
            className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3"
            onSubmit={handleSubmit}
            onInputCapture={handleInputCapture}
            onChangeCapture={handleChangeCapture}
        >
            <label className="min-w-[15.5rem] flex-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {searchLabel}
                </span>
                <input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder={placeholder}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
                />
            </label>
            {children}
            <noscript>
                <button
                    type="submit"
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-800"
                >
                    {filterButtonLabel}
                </button>
            </noscript>
        </form>
    );
}
