import { useState } from "react";

const PaginatedMultiSelect = ({ options, value, onChange, placeholder }: {
    options: { value: string; label: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder: string;
}) => {
    const [selectedValues, setSelectedValues] = useState(value || []);

    const handleToggleOption = (optionValue: string) => {
        let newValues;
        if (selectedValues.includes(optionValue)) {
            newValues = selectedValues.filter(v => v !== optionValue);
        } else {
            newValues = [...selectedValues, optionValue];
        }
        setSelectedValues(newValues);
        onChange(newValues);
    };

    const getSelectedLabels = () => {
        return options
            .filter(option => selectedValues.includes(option.value))
            .map(option => option.label)
            .join(', ');
    };

    return (
        <div className="relative">
            <div className="border rounded-md p-2 min-h-10 flex flex-wrap gap-1">
                {selectedValues.length > 0 ? getSelectedLabels() : placeholder}
            </div>
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {options.map(option => (
                    <div
                        key={option.value}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedValues.includes(option.value) ? 'bg-blue-100' : ''}`}
                        onClick={() => handleToggleOption(option.value)}
                    >
                        <input
                            type="checkbox"
                            checked={selectedValues.includes(option.value)}
                            onChange={() => { }}
                            className="mr-2"
                        />
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaginatedMultiSelect;