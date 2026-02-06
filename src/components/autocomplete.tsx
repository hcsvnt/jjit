import MuiAutocomplete from '@mui/material/Autocomplete';
import type { AutocompleteRenderInputParams, AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material/Autocomplete';

export default function Autocomplete<T>({
    options,
    noOptionsText,
    getOptionLabel,
    renderInput,
    onChange,
    value,
    loading,
}: {
    options: T[];
    noOptionsText?: string;
    getOptionLabel: (option: T) => string;
    renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
    onChange: (event: React.SyntheticEvent, value: T | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<T>) => void;
    value?: T | null;
    loading?: boolean;
}) {
    return (
        <MuiAutocomplete
            options={options}
            noOptionsText={noOptionsText}
            getOptionLabel={getOptionLabel}
            renderInput={renderInput}
            onChange={onChange}
            value={value ?? null}
            loading={loading}
            fullWidth
        />
    );
}
