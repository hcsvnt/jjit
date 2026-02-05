import MuiAutocomplete from '@mui/material/Autocomplete';
import type { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';

export default function Autocomplete<T>({
    options,
    noOptionsText,
    // getOptionLabel,
    renderInput,
    onChange,
}: {
    options: T[];
    noOptionsText?: string;
    // getOptionLabel: (option: T) => string;
    renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
    onChange: (event: any, value: T | null) => void;
}) {
    return (
        <MuiAutocomplete
            options={options}
            noOptionsText={noOptionsText}
            // getOptionLabel={getOptionLabel}
            renderInput={renderInput}
            onChange={onChange}
            fullWidth
        />
    );
}
