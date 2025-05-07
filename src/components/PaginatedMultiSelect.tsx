
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

interface PaginatedResponse<T> {
    count: number;
    total_pages: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

const PaginatedMultiSelect = ({
    label,
    options,
    value,
    onChange,
    fetchData,
    page,
    totalPages,
    onPageChange
}: {
    label: string;
    options: { value: string; label: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    fetchData: (page: number) => Promise<PaginatedResponse<any> | null>;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) => {

    const [selectedValues, setSelectedValues] = useState(value);

    // Update selectedValues when the 'value' prop changes
    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    const handleOptionChange = (optionValue: string) => {
        let newValues;
        if (selectedValues.includes(optionValue)) {
            newValues = selectedValues.filter(v => v !== optionValue);
        } else {
            newValues = [...selectedValues, optionValue];
        }
        onChange(newValues);
    };

    const getSelectedLabels = () => {
        return options
            .filter(option => selectedValues.includes(option.value))
            .map(option => option.label)
            .join(', ');
    };

    return (
        <div>
            <Label htmlFor={label}>{label}</Label>
            <div className="mt-1">
                {/* Display currently selected items */}
                {selectedValues.length > 0 && (
                    <div className="mb-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm font-medium">Selected: {getSelectedLabels()}</p>
                    </div>
                )}

                {/* Item selection */}
                <div className="border rounded-md p-2 max-h-60 overflow-auto">
                    <div className="grid grid-cols-2 gap-2">
                        {options.map(option => (
                            <div key={option.value} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`${label}-${option.value}`}
                                    checked={selectedValues.includes(option.value)}
                                    onChange={() => handleOptionChange(option.value)}
                                    className="mr-2"
                                />
                                <label htmlFor={`${label}-${option.value}`} className="text-sm">
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex justify-center mt-4">
                        <nav className="flex items-center">
                            <button
                                onClick={() => onPageChange(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 border rounded mr-1 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="px-3">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1 border rounded ml-1 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaginatedMultiSelect;
