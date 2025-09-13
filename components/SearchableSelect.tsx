
import React, { useState, useEffect, useRef } from 'react';

interface SearchableSelectProps {
    label: string;
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    isRequired?: boolean;
    allowNew?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, options, selected, onSelect, isRequired = false, allowNew = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        onSelect(option);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (allowNew) {
            onSelect(e.target.value);
        }
    };
    
    const displayValue = allowNew ? selected : (selected || `اختر ${label}`);

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type="text"
                    required={isRequired && !allowNew}
                    value={allowNew ? selected : searchTerm || selected}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={allowNew ? 'اكتب أو اختر...' : `اختر ${label}...`}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 pr-10 focus:ring-blue-500 focus:border-blue-500"
                />
                 <button type="button" onClick={() => setIsOpen(!isOpen)} className="absolute inset-y-0 left-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-300 dark:border-gray-600 searchable-select-menu">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <li
                                key={option}
                                onClick={() => handleSelect(option)}
                                className="cursor-pointer select-none relative py-2 pr-9 pl-3 text-gray-900 dark:text-gray-100 hover:bg-blue-500 hover:text-white"
                            >
                                <span className={`block truncate ${selected === option ? 'font-semibold' : 'font-normal'}`}>{option}</span>
                                {selected === option ? (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                       <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </span>
                                ) : null}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-gray-500">لا توجد نتائج</li>
                    )}
                </ul>
            )}
        </div>
    );
};
