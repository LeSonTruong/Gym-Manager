'use client';

import {
    type ChangeEvent,
    useEffect,
    type FocusEvent,
    type JSX,
    type KeyboardEvent,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';

type AutocompleteOption = {
    readonly value: string;
    readonly label: string;
};

type FormAutocompleteSelectProps = {
    readonly label: string;
    readonly name: string;
    readonly options: readonly AutocompleteOption[];
    readonly defaultValue?: string;
    readonly isRequired?: boolean;
    readonly placeholder?: string;
    readonly invalidSelectionMessage?: string;
    readonly emptyStateMessage?: string;
};

type HighlightedLabelPart = {
    readonly text: string;
    readonly isMatch: boolean;
    readonly startIndex: number;
};

const maximumVisibleOptions = 12;

function normalizeAutocompleteCharacter(value: string): string {
    return value
        .normalize('NFD')
        .replaceAll(/\p{Diacritic}/gv, '')
        .replaceAll('đ', 'd')
        .replaceAll('Đ', 'D')
        .toLowerCase();
}

function normalizeAutocompleteText(value: string): string {
    return Array.from(value, normalizeAutocompleteCharacter).join('').trim();
}

function getNormalizedLabelIndexMap(label: string): {
    readonly normalizedLabel: string;
    readonly normalizedIndexToRawIndexMap: number[];
} {
    let normalizedLabel = '';
    const normalizedIndexToRawIndexMap: number[] = [];

    let rawIndex = 0;

    for (const rawCharacter of label) {
        const normalizedCharacter = normalizeAutocompleteCharacter(rawCharacter);

        if (normalizedCharacter.length > 0) {
            normalizedLabel += normalizedCharacter;

            for (const normalizedCharacterPart of normalizedCharacter) {
                normalizedIndexToRawIndexMap.push(rawIndex);

                void normalizedCharacterPart;
            }
        }

        rawIndex += rawCharacter.length;
    }

    return {
        normalizedLabel,
        normalizedIndexToRawIndexMap,
    };
}

function getHighlightedAutocompleteLabelParts(
    label: string,
    query: string,
): HighlightedLabelPart[] {
    const normalizedQuery = normalizeAutocompleteText(query);

    if (!normalizedQuery) {
        return [{ text: label, isMatch: false, startIndex: 0 }];
    }

    const { normalizedLabel, normalizedIndexToRawIndexMap } =
        getNormalizedLabelIndexMap(label);
    const rawMatchRanges: Array<{ readonly start: number; readonly end: number }> = [];

    let normalizedSearchStartIndex = 0;

    while (
        normalizedSearchStartIndex
        <= normalizedLabel.length - normalizedQuery.length
    ) {
        const normalizedMatchStartIndex = normalizedLabel.indexOf(
            normalizedQuery,
            normalizedSearchStartIndex,
        );

        if (normalizedMatchStartIndex === -1) {
            break;
        }

        const normalizedMatchEndIndex =
            normalizedMatchStartIndex + normalizedQuery.length - 1;
        const rawMatchStartIndex =
            normalizedIndexToRawIndexMap[normalizedMatchStartIndex];
        const rawMatchEndCharacterIndex =
            normalizedIndexToRawIndexMap[normalizedMatchEndIndex];

        if (
            rawMatchStartIndex !== undefined
            && rawMatchEndCharacterIndex !== undefined
        ) {
            const rawMatchSlice = label.slice(rawMatchEndCharacterIndex);
            const rawEndCharacterCodePoint = rawMatchSlice.codePointAt(0);
            const rawEndCharacter =
                rawEndCharacterCodePoint === undefined
                    ? ''
                    : String.fromCodePoint(rawEndCharacterCodePoint);

            rawMatchRanges.push({
                start: rawMatchStartIndex,
                end: rawMatchEndCharacterIndex + rawEndCharacter.length,
            });
        }

        normalizedSearchStartIndex =
            normalizedMatchStartIndex + normalizedQuery.length;
    }

    if (rawMatchRanges.length === 0) {
        return [{ text: label, isMatch: false, startIndex: 0 }];
    }

    const highlightedParts: HighlightedLabelPart[] = [];

    let rawCurrentIndex = 0;

    for (const rawMatchRange of rawMatchRanges) {
        if (rawMatchRange.start > rawCurrentIndex) {
            highlightedParts.push({
                text: label.slice(rawCurrentIndex, rawMatchRange.start),
                isMatch: false,
                startIndex: rawCurrentIndex,
            });
        }

        if (rawMatchRange.end > rawMatchRange.start) {
            highlightedParts.push({
                text: label.slice(rawMatchRange.start, rawMatchRange.end),
                isMatch: true,
                startIndex: rawMatchRange.start,
            });
        }

        rawCurrentIndex = Math.max(rawCurrentIndex, rawMatchRange.end);
    }

    if (rawCurrentIndex < label.length) {
        highlightedParts.push({
            text: label.slice(rawCurrentIndex),
            isMatch: false,
            startIndex: rawCurrentIndex,
        });
    }

    return highlightedParts;
}

function getFilteredAutocompleteOptions(
    options: readonly AutocompleteOption[],
    typedLabel: string,
): AutocompleteOption[] {
    const query = normalizeAutocompleteText(typedLabel);

    if (!query) {
        return options.slice(0, maximumVisibleOptions);
    }

    return options
        .filter((option) => normalizeAutocompleteText(option.label).includes(query))
        .slice(0, maximumVisibleOptions);
}

export function FormAutocompleteSelect({
    label,
    name,
    options,
    defaultValue,
    isRequired = false,
    placeholder,
    invalidSelectionMessage = 'Vui lòng chọn một giá trị trong danh sách gợi ý.',
    emptyStateMessage = 'Không có gợi ý phù hợp.',
}: FormAutocompleteSelectProps): JSX.Element {
    const inputId = useId();
    const listboxId = useId();
    const highlightedOptionReferencesByIndex = useRef(new Map<number, HTMLLIElement>());
    const shouldAutoScrollToHighlightedOptionReference = useRef(false);
    const optionLookup = useMemo(() => {
        const map = new Map<string, string>();

        for (const option of options) {
            map.set(normalizeAutocompleteText(option.label), option.value);
        }

        return map;
    }, [options]);
    const defaultLabel =
        options.find((option) => option.value === (defaultValue ?? ''))?.label ?? '';
    const [typedLabel, setTypedLabel] = useState(defaultLabel);
    const [selectedValue, setSelectedValue] = useState(defaultValue ?? '');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const filteredOptions = useMemo(
        () => getFilteredAutocompleteOptions(options, typedLabel),
        [options, typedLabel],
    );

    const activeDescendantId =
        highlightedIndex >= 0 && highlightedIndex < filteredOptions.length
            ? `${listboxId}-option-${highlightedIndex}`
            : undefined;

    useEffect(() => {
        if (
            !isMenuOpen
            || highlightedIndex < 0
            || !shouldAutoScrollToHighlightedOptionReference.current
        ) {
            return;
        }

        const highlightedOptionElement =
            highlightedOptionReferencesByIndex.current.get(highlightedIndex);

        highlightedOptionElement?.scrollIntoView({
            block: 'nearest',
        });
        shouldAutoScrollToHighlightedOptionReference.current = false;
    }, [highlightedIndex, isMenuOpen]);

    const validateSelection = (
        inputElement: HTMLInputElement,
        nextLabel: string,
        nextSelectedValue: string,
    ): void => {
        if (nextSelectedValue) {
            inputElement.setCustomValidity('');

            return;
        }

        if (!nextLabel.trim()) {
            inputElement.setCustomValidity('');

            return;
        }

        inputElement.setCustomValidity(invalidSelectionMessage);
    };

    const syncSelection = (inputElement: HTMLInputElement, nextLabel: string): void => {
        const nextSelectedValue = optionLookup.get(normalizeAutocompleteText(nextLabel)) ?? '';

        setTypedLabel(nextLabel);
        setSelectedValue(nextSelectedValue);
        validateSelection(inputElement, nextLabel, nextSelectedValue);
    };

    const selectOption = (
        inputElement: HTMLInputElement,
        selectedOption: AutocompleteOption,
    ): void => {
        setTypedLabel(selectedOption.label);
        setSelectedValue(selectedOption.value);
        setIsMenuOpen(false);
        setHighlightedIndex(-1);
        shouldAutoScrollToHighlightedOptionReference.current = false;
        inputElement.setCustomValidity('');
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const nextLabel = event.currentTarget.value;
        const nextFilteredOptions = getFilteredAutocompleteOptions(options, nextLabel);

        syncSelection(event.currentTarget, nextLabel);
        setIsMenuOpen(true);
        setHighlightedIndex(nextFilteredOptions.length > 0 ? 0 : -1);
        shouldAutoScrollToHighlightedOptionReference.current = false;
    };

    const onFocus = (): void => {
        const focusFilteredOptions = getFilteredAutocompleteOptions(options, typedLabel);

        setIsMenuOpen(true);
        setHighlightedIndex(focusFilteredOptions.length > 0 ? 0 : -1);
    };

    const onBlur = (event: FocusEvent<HTMLInputElement>): void => {
        const rawTypedLabel = event.currentTarget.value;
        const normalizedTypedLabel = normalizeAutocompleteText(rawTypedLabel);
        const matchedOption = options.find(
            (option) => normalizeAutocompleteText(option.label) === normalizedTypedLabel,
        );

        syncSelection(
            event.currentTarget,
            matchedOption ? matchedOption.label : rawTypedLabel,
        );
        setIsMenuOpen(false);
        setHighlightedIndex(-1);
        shouldAutoScrollToHighlightedOptionReference.current = false;
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'ArrowDown') {
            const keyboardFilteredOptions = getFilteredAutocompleteOptions(
                options,
                event.currentTarget.value,
            );

            if (keyboardFilteredOptions.length === 0) {
                return;
            }

            event.preventDefault();
            setIsMenuOpen(true);
            shouldAutoScrollToHighlightedOptionReference.current = true;
            setHighlightedIndex((previousIndex) => {
                if (previousIndex < 0) {
                    return 0;
                }

                return Math.min(previousIndex + 1, keyboardFilteredOptions.length - 1);
            });

            return;
        }

        if (event.key === 'ArrowUp') {
            const keyboardFilteredOptions = getFilteredAutocompleteOptions(
                options,
                event.currentTarget.value,
            );

            if (keyboardFilteredOptions.length === 0) {
                return;
            }

            event.preventDefault();
            setIsMenuOpen(true);
            shouldAutoScrollToHighlightedOptionReference.current = true;
            setHighlightedIndex((previousIndex) => {
                if (previousIndex < 0) {
                    return keyboardFilteredOptions.length - 1;
                }

                return Math.max(previousIndex - 1, 0);
            });

            return;
        }

        if (event.key === 'Enter') {
            const highlightedOption =
                highlightedIndex >= 0 ? filteredOptions[highlightedIndex] : undefined;

            if (isMenuOpen && highlightedOption) {
                event.preventDefault();
                selectOption(event.currentTarget, highlightedOption);
            }

            return;
        }

        if (event.key === 'Home') {
            if (!isMenuOpen) {
                return;
            }

            const keyboardFilteredOptions = getFilteredAutocompleteOptions(
                options,
                event.currentTarget.value,
            );

            if (keyboardFilteredOptions.length === 0) {
                return;
            }

            event.preventDefault();
            setIsMenuOpen(true);
            shouldAutoScrollToHighlightedOptionReference.current = true;
            setHighlightedIndex(0);

            return;
        }

        if (event.key === 'End') {
            if (!isMenuOpen) {
                return;
            }

            const keyboardFilteredOptions = getFilteredAutocompleteOptions(
                options,
                event.currentTarget.value,
            );

            if (keyboardFilteredOptions.length === 0) {
                return;
            }

            event.preventDefault();
            setIsMenuOpen(true);
            shouldAutoScrollToHighlightedOptionReference.current = true;
            setHighlightedIndex(keyboardFilteredOptions.length - 1);

            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            setIsMenuOpen(false);
            setHighlightedIndex(-1);
            shouldAutoScrollToHighlightedOptionReference.current = false;
        }
    };

    return (
        <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {label}
            </span>
            <input type="hidden" name={name} value={selectedValue} />
            <div className="relative mt-2">
                <input
                    id={inputId}
                    type="search"
                    value={typedLabel}
                    required={isRequired}
                    placeholder={placeholder}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={isMenuOpen ? filteredOptions.length > 0 : false}
                    aria-controls={listboxId}
                    aria-activedescendant={activeDescendantId}
                    className="w-full rounded-2xl border border-slate-200/85 bg-white/95 px-4 py-3 text-sm text-slate-800 shadow-[0_10px_26px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-[var(--accent-500)] focus:ring-2 focus:ring-[var(--focus-ring)]"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                />
                {isMenuOpen ? (
                    <ul
                        id={listboxId}
                        role="listbox"
                        aria-labelledby={inputId}
                        className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => {
                                const isHighlightedOption = index === highlightedIndex;
                                const highlightedLabelParts =
                                    getHighlightedAutocompleteLabelParts(
                                        option.label,
                                        typedLabel,
                                    );

                                return (
                                    <li
                                        ref={(element) => {
                                            if (element) {
                                                highlightedOptionReferencesByIndex.current.set(
                                                    index,
                                                    element,
                                                );
                                            } else {
                                                highlightedOptionReferencesByIndex.current.delete(
                                                    index,
                                                );
                                            }
                                        }}
                                        key={`${name}-${option.value}`}
                                        id={`${listboxId}-option-${index}`}
                                        role="option"
                                        aria-selected={isHighlightedOption}
                                    >
                                        <button
                                            type="button"
                                            className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${isHighlightedOption
                                                ? 'bg-slate-900 text-white'
                                                : 'text-slate-700 hover:bg-slate-100'
                                                }`}
                                            onMouseEnter={() => {
                                                setHighlightedIndex(index);
                                            }}
                                            onMouseDown={(event) => {
                                                event.preventDefault();
                                            }}
                                            onClick={(event) => {
                                                const inputElement = event.currentTarget
                                                    .closest('label')
                                                    ?.querySelector<HTMLInputElement>('input[role="combobox"]');

                                                if (!inputElement) {
                                                    return;
                                                }

                                                selectOption(inputElement, option);
                                                inputElement.focus();
                                            }}
                                        >
                                            {highlightedLabelParts.map((labelPart) => (
                                                <span
                                                    key={`${name}-${option.value}-part-${labelPart.startIndex}-${labelPart.isMatch ? 'match' : 'text'}`}
                                                    className={labelPart.isMatch
                                                        ? isHighlightedOption
                                                            ? 'rounded bg-white/25 px-0.5 font-semibold text-white'
                                                            : 'rounded bg-amber-100 px-0.5 font-semibold text-amber-900'
                                                        : undefined}
                                                >
                                                    {labelPart.text}
                                                </span>
                                            ))}
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-3 py-2 text-sm text-slate-500">
                                {emptyStateMessage}
                            </li>
                        )}
                    </ul>
                ) : null}
            </div>
        </label>
    );
}
