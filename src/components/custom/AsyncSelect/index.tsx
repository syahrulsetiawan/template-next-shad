'use client';

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  KeyboardEvent
} from 'react';
import {AsyncSelectProps, Option} from './type';
import CustomInput from '../Input';
import {ChevronDown, LoaderCircle} from 'lucide-react';
import {usePaginatedFetchSelect} from './use-fetchPaginate';

// ==============================
// Constants
// ==============================
const LIMIT_INIT_FETCH = 25;
const DEBOUNCE_DURATION = 500;

// ==============================
// Component
// ==============================
export const AsyncSelect: React.FC<AsyncSelectProps> = ({
  label,
  value,
  onChange,
  options,
  fetchUrl,
  params,
  debounceDuration = DEBOUNCE_DURATION,
  placeholder = 'Select...',
  disabled
}) => {
  // ==============================
  // State & Refs
  // ==============================
  const isStatic = Array.isArray(options);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value?.label || '');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // ==============================
  // Data fetching (paginated)
  // ==============================
  const {data, loading, search, setSearch} = usePaginatedFetchSelect<Option>(
    fetchUrl || '',
    {limit: LIMIT_INIT_FETCH, ...params},
    {
      enabled: !isStatic,
      debounceDuration
    }
  );

  // ==============================
  // Derived options
  // ==============================
  const displayedOptions = useMemo(() => {
    if (isStatic && options) {
      if (!search) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      );
    }
    return data;
  }, [isStatic, options, data, search]);

  // ==============================
  // Handlers
  // ==============================
  const closeDropdown = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      closeDropdown();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown') {
          setIsOpen(true);
          setHighlightedIndex(0);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < displayedOptions.length - 1 ? prev + 1 : 0
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : displayedOptions.length - 1
          );
          break;

        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && displayedOptions[highlightedIndex]) {
            const selected = displayedOptions[highlightedIndex];
            onChange?.(selected);
            setInputValue(selected.label);
            closeDropdown();
          }
          break;

        case 'Escape':
          closeDropdown();
          break;
      }
    },
    [isOpen, displayedOptions, highlightedIndex, onChange]
  );

  const handleInputChange = (val: string) => {
    setInputValue(val);
    setSearch(val);
    if (!isOpen) setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = (opt: Option) => {
    onChange?.(opt);
    setInputValue(opt.label);
    closeDropdown();
  };

  // ==============================
  // Effects
  // ==============================
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [handleOutsideClick]);

  useEffect(() => {
    setInputValue(value?.label || '');
  }, [value]);

  // ==============================
  // Render
  // ==============================
  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      {/* Label */}
      {label && <label className="text-sm font-medium">{label}</label>}

      {/* Input Wrapper */}
      <div className="relative">
        <CustomInput
          type="text"
          className="bg-white cursor-pointer"
          placeholder={placeholder}
          value={inputValue}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        {/* Icons */}
        <div className="absolute right-2 top-2 h-fit">
          {loading ? (
            <LoaderCircle className="text-gray-500 animate-spin" size={20} />
          ) : (
            <ChevronDown
              className={`text-gray-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              size={22}
            />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 top-[90%] mt-1 w-full border rounded-lg max-h-48 overflow-auto bg-white shadow-md">
          {/* Loading / Empty */}
          {loading && <p className="p-2 text-sm text-gray-500">Loading...</p>}
          {!loading && displayedOptions.length === 0 && (
            <p className="p-2 text-sm text-gray-500">No options found</p>
          )}

          {/* Options */}
          {displayedOptions.map((opt, index) => (
            <div
              key={opt.value}
              className={`p-2 cursor-pointer transition-colors ${
                highlightedIndex === index
                  ? 'bg-blue-100'
                  : value?.value === opt.value
                    ? 'bg-blue-50 font-medium'
                    : 'hover:bg-blue-50'
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
